const { createDynamoDBClient } = require("../factories/aws");
const { sendEmail } = require("./ses");
require("dotenv").config();
const dynamodb = createDynamoDBClient(
  process.env.AWS_ACCESS_KEY_ID,
  process.env.AWS_SECRET_ACCESS_KEY,
  process.env.AWS_REGION
);

async function getDoctors(hcprovider, speciality) {
  const scanParams = {
    TableName: "availability",
    FilterExpression: "hc_provider = :p",
    ExpressionAttributeValues: {
      ":p": hcprovider,
    },
  };
  if (speciality !== "all") {
    scanParams.FilterExpression += " AND speciality = :speciality";
    scanParams.ExpressionAttributeValues[":speciality"] = speciality;
  }
  try {
    const result = await dynamodb.scan(scanParams).promise();

    if (result.Items) {
      return result.Items;
    } else {
      return null;
    }
  } catch (err) {
    return err;
  }
}

async function getDocAvailability(doc_email, availability_date) {
  const params = {
    TableName: "availability",
    KeyConditionExpression:
      "doctor_email = :email and availability_date = :avail_date",
    ExpressionAttributeValues: {
      ":email": doc_email,
      ":avail_date": availability_date,
    },
    ProjectionExpression: "availability_time, doctor_address",
  };

  try {
    const result = await dynamodb.query(params).promise();

    if (result.Items && result.Items.length > 0) {
      return result.Items[0];
    } else {
      return null;
    }
  } catch (err) {
    return err;
  }
}

async function postAppointments(body) {
  const params = {
    TableName: "appointments",
    Item: body,
  };
  try {
    let resp = await dynamodb.put(params).promise();

    return JSON.stringify(body);
  } catch (err) {
    throw new Error("Unable to add appointment");
  }
}

async function getAppointments(doctor) {
  const params = {
    TableName: "appointments",
    KeyConditionExpression: "doctor_email = :doctorEmail",
    ExpressionAttributeValues: {
      ":doctorEmail": doctor,
    },
  };
  try {
    let result = await dynamodb.query(params).promise();

    if (result.Items && result.Items.length > 0) {
      return result.Items;
    } else {
      return null;
    }
  } catch (err) {
    return new Error("Could not retrieve data");
  }
}

async function updateAppointmentStatus(appt_id, appt_status) {
  const params = {
    TableName: "appointments",
    FilterExpression: "appointment_id = :appointmentId",
    ExpressionAttributeValues: {
      ":appointmentId": appt_id,
    },
  };

  dynamodb.scan(params, (err, data) => {
    if (err) {
      return new Error("Could not retrieve appointment data");
    } else {
    }
    if (data && data.Items && data.Items.length > 0) {
      let results = data.Items[0];
      const updateParams = {
        TableName: "appointments",
        Key: {
          doctor_email: results.doctor_email,
          created_at: results.created_at,
        },
        UpdateExpression: "set appointment_status = :status",
        ExpressionAttributeValues: {
          ":status": appt_status,
        },
        ReturnValues: "ALL_NEW",
      };

      dynamodb.update(updateParams, (err, data) => {
        if (err) {
          return new Error("Could not update");
        } else {
          let body = "";
          if (data.Attributes?.appointment_status == "confirmed") {
            body = `<h1>Appointment Status Update for ${data.Attributes?.patient_name}</h1><br><p>Thank you for booking an appointment with ${data.Attributes?.doctor_email}. Your appointment is confirmed for ${data.Attributes?.appointment_time} on ${data.Attributes?.created_at}</p>`;
          } else {
            body = `<h1>Appointment Status Update for ${data.Attributes?.patient_name}</h1><br><p>We regret to inform that your appointment with abc has been cancelled. Please choose another date to book an appointment</p>`;
          }
          sendEmail(
            data.Attributes?.patient_email,

            data.Attributes?.doctor_email,
            body
          );

          updateDoctorAvailability(
            data.Attributes?.doctor_email,
            data.Attributes?.created_at,
            data.Attributes?.appointment_time
          );
          return data.Attributes;
        }
      });
    }
  });
}

async function updateDoctorAvailability(doctor, appt_date, timeslot) {
  let res = await getDocAvailability(doctor, appt_date);

  let updatedTimeSlot = res.availability_time.filter((ele) => {
    return ele != timeslot;
  });

  const params = {
    TableName: "availability",
    Key: {
      doctor_email: doctor,
      availability_date: appt_date,
    },
    UpdateExpression: "SET availability_time = :updatedAvailabilityTime",
    ExpressionAttributeValues: {
      ":updatedAvailabilityTime": updatedTimeSlot,
    },

    //ConditionExpression: "contains(availability_time, :val)",
  };

  dynamodb.update(params, (err, data) => {
    if (err) {
      console.error(
        "Unable to update doctor availability. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    }
  });
}

async function postAvailability(avail_date, time, doctor, doctorAddress) {
  const attributeValues = time.map((time) => {
    return { S: time };
  });
  const params = {
    TableName: "availability",
    Item: {
      doctor_email: doctor,
      availability_date: avail_date,
      availability_time: time,
      doctor_address: doctorAddress,
    },
  };
  dynamodb.put(params, function (err, data) {
    if (err) {
      console.log("Error inserting new item: ", err);
      throw new Error(err);
    } else {
      console.log("New item inserted successfully: ", data);
      return true;
    }
  });
}

module.exports = {
  getDoctors,
  getDocAvailability,
  postAppointments,
  getAppointments,
  updateAppointmentStatus,
  postAvailability,
};
