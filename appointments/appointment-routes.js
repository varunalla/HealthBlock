const uuid = require("uuid");
const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: 'AKIAWKISFSUDRPW5SMMP',
    secretAccessKey: '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',
    region: 'us-east-1'
  });
  const dynamodb =new AWS.DynamoDB.DocumentClient();

module.exports = (app) => {
  app.get("/getAppointments/:doctorEmail", (req, res) => {
    // res.send(req.metaAuth.challenge);
    //const appointmentId = uuid.v4();
    let { doctorEmail } = req.params;
    console.log("dcotorEmail",doctorEmail)
    const appointmentId = uuid.v4()
    console.log("appointmentid--->",appointmentId)

    const params = {
      TableName: "appointments",
      KeyConditionExpression: "doctor_email = :doctorEmail",
      ExpressionAttributeValues: {
        ":doctorEmail": "abc@gmail.com",
      },
    };

    dynamodb.query(params, (err, data) => {
      if (err) {
        console.log("Error querying appointments: ", err);
        res.send(err)
      } else {
        console.log("Appointments: ", data.Items);
        res.status(200).send(data.Items?data.Items:data);
      }
    });
   
  });

app.put('/updateAppointmentStatus/:appointmentID/status',(req,res)=>{
    const {appointmentId} = req.params
    const {appointmentStatus} = req.body
    console.log("appointmentid--->",req.params)
    const db = new AWS.DynamoDB();
   


    const params = {
        TableName: 'appointments',
        Key:{
            'doctor_email': { S: 'abc@gmail.com' },
            //'appointment_id': { S: 'c8d947c1-f3cb-4510-bc94-e2c75b16b3e0'},
            'created_at':{S:'2023-04-04'}
        },
        UpdateExpression: 'SET appointment_status = :newStatus',
       
        ExpressionAttributeValues: {
          ':newStatus': {S:"reject"}
        },
      };
      console.log("params",params)
      
      db.updateItem(params, function(err, data) {
        if (err) {
          console.log('Error', err);
        } else {
          console.log('Success', data);
          res.send({"success":true})
        }
      });


 })

};
