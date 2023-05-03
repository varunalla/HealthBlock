const { createSESClient } = require("../factories/aws");
require("dotenv").config();

const ses = createSESClient(
  process.env.AWS_ACCESS_KEY_ID,
  process.env.AWS_SECRET_ACCESS_KEY,
  process.env.AWS_REGION
);
function sendEmail(patient_email, doctor_email, body) {
  console.log("patient email", patient_email, doctor_email);
  const params = {
    Destination: {
      ToAddresses: "hasinireddy765@gmail.com",
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Update on Appointment status",
      },
    },
    Source: "dharahasini.gangalapudi@gmail.com",
  };
  try {
    ses.sendEmail(params);
  } catch (Err) {
    console.log("Error sending email", Err);
  }
}
module.exports = { sendEmail };
