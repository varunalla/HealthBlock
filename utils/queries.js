const { createDynamoDBClient } = require("../factories/aws");
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
  };

  try {
    const result = await dynamodb.query(params).promise();

    if (result.Items && result.Items.length > 0) {
      return result.Items[0].availability_time;
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
  console.log("get Appointments");
  const params = {
    TableName: "appointments",
    KeyConditionExpression: "doctor_email = :doctorEmail",
    ExpressionAttributeValues: {
      ":doctorEmail": doctor,
    },
  };
  try {
    let result = await dynamodb.query(params).promise();
    console.log("resp from getappointments-->", result);
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
  console.log("update Appointments");
  const params = {
    TableName: "appointments",
    FilterExpression: "appointment_id = :appointmentId",
    ExpressionAttributeValues: {
      ":appointmentId": appt_id,
    },
  };

  dynamodb.scan(params, (err, data) => {
    if (err) {
      console.error("Error scanning appointment", err);
      return new Error("Could not retrieve appointment data");
    } else {
      console.log("Scan succeeded:", data);
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
          console.log("Appointment status updated successfully", data);
          return data.Attributes;
        }
      });
    }
  });
}

module.exports = {
  getDoctors,
  getDocAvailability,
  postAppointments,
  getAppointments,
  updateAppointmentStatus,
};
