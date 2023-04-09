require("dotenv").config();
const { dynamodb } = require("../factories/dynamodb");
const { encode_jwt, verify_token } = require("../utils/jwt");

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
            }
          });
        }
      });
    }
  );
};
