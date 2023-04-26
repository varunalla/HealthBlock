const { createDynamoDBClient } = require("../factories/aws");
const { encode_jwt, verify_token } = require("../utils/jwt");
const {
  getDoctors,
  getDocAvailability,
  postAppointments,
} = require("../utils/queries");
const uuid = require("uuid");

module.exports = (app) => {
  app.get("/provider/:hcprovider/doctors", verify_token, async (req, res) => {
    let { speciality } = req.query;
    let { hcprovider } = req.params;
    try {
      let result = await getDoctors(hcprovider, speciality);

      res.send({ success: true, result });
    } catch (err) {
      res.status(500).send();
    }
  });

  app.get("/availability/:doctor/:date", verify_token, async (req, res) => {
    let { doctor, date } = req.params;
    try {
      let result = await getDocAvailability(doctor, date);

      res.send({ success: true, result });
    } catch (err) {
      res.status(500).send();
    }
  });

  app.post("/appointments", verify_token, async (req, res) => {
    const appointment = {
      appointment_id: uuid.v4(),
      patient_email: req.body.patientEmail,
      doctor_email: req.body.doctorEmail,
      patient_name: req.body.patientName,
      reason: req.body.reason,
      created_at: req.body.appointmentDate,
      appointment_time: req.body.appointmentTime,
      appointment_status: req.body.status,
    };
    try {
      let result = await postAppointments(appointment);

      res.status(201).json("Appointment created succesfully");
    } catch (err) {
      res.status(500).json("Error creating appointment");
    }
  });

  app.get("/getAppointments/:doctorEmail", verify_token, (req, res) => {
    let { doctorEmail } = req.params;

    const params = {
      TableName: "appointments",
      KeyConditionExpression: "doctor_email = :doctorEmail",
      ExpressionAttributeValues: {
        ":doctorEmail": doctorEmail,
      },
    };

    dynamodb.query(params, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.status(200).send(data.Items ? data.Items : data);
      }
    });
  });

  app.put(
    "/updateAppointmentStatus/:appointmentID/status",
    verify_token,
    (req, res) => {
      const { appointmentID } = req.params;
      const { appointmentStatus } = req.body;

      const params = {
        TableName: "appointments",
        FilterExpression: "appointment_id = :appointmentId",
        ExpressionAttributeValues: {
          ":appointmentId": appointmentID,
        },
      };

      dynamodb.scan(params, (err, data) => {
        if (err) {
          console.error("Error scanning appointment", err);
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
              ":status": appointmentStatus,
            },
            ReturnValues: "ALL_NEW",
          };

          dynamodb.update(updateParams, (err, data) => {
            if (err) {
              console.error("Error updating appointment status", err);
              res.status(500).send("Error updating record");
            } else {
              console.log("Appointment status updated successfully", data);
              res
                .status(200)
                .json({ message: "Resource updated successfully" });
            }
          });
        }
      });
    }
  );
};
