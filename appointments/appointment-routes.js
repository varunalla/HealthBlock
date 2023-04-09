require("dotenv").config();
const { dynamodb, ses } = require("../factories/dynamodb");
const { encode_jwt, verify_token } = require("../utils/jwt");
const { sendEmail } = require("../utils/ses");

module.exports = (app) => {
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
        console.log("Error querying appointments: ", err);
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
              console.log("data in put--->", data);
              if (data && data.Attributes) {
                const {
                  Attributes: {
                    patient_email,
                    patient_name,
                    appointment_time,
                    created_at,
                    doctor_email,
                  },
                } = data;
                let body = "";
                if (appointmentStatus == "confirmed") {
                  body = `<h1>Appointment Status Update for ${patient_name}</h1><br><p>Thank you for booking an appointment with "abc". Your appointment is confirmed for ${appointment_time} on ${created_at}</p>`;
                } else {
                  body = `<h1>Appointment Status Update for ${patientName}</h1><br><p>We regret to inform that your appointment with abc has been cancelled. Please choose another date to book an appointment</p>`;
                }
                sendEmail(
                  doctor_email,
                  "shruthisrinivasan97@gmail.com",
                  "Update on Appointment",
                  body
                );
              }
            }
          });
        }
      });
    }
  );
};
