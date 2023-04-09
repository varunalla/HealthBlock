const { ses } = require("../factories/dynamodb");
function sendEmail(from, to, subject, body) {
  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },
    Source: "abc@gmail.com",
  };

  ses.sendEmail(params, (err, data) => {
    if (err) {
      console.log("Error sending email:", err);
    } else {
      console.log("Email sent:", data);
    }
  });
}

module.exports = { sendEmail };
