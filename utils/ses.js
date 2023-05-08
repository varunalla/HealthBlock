const { createSESClient } = require("../factories/aws");

require("dotenv").config();

const ses = createSESClient(
  process.env.AWS_REGION,
  process.env.AWS_ACCESS_KEY_ID_FOR_SES,
  process.env.AWS_SECRET_ACCESS_KEY_FOR_SES
);

function sendEmail(patient, doctor, body) {
  const params = {
    Destination: {
      ToAddresses: [patient],
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
        Data: "Update on your appointment",
      },
    },
    Source: doctor,
  };

  ses.getIdentityVerificationAttributes(
    { Identities: [patient] },
    (err, data) => {
      if (err) {
        return err;
      } else {
        const verificationAttributes = data.VerificationAttributes[patient];

        if (
          verificationAttributes &&
          verificationAttributes.VerificationStatus === "Success"
        ) {
          // Email identity is verified, send the email
          ses.sendEmail(params, (err, data) => {
            if (err) {
              console.log(err);
              return err;
            } else {
              return true;
            }
          });
        }
      }
    }
  );
}

module.exports = { sendEmail };
