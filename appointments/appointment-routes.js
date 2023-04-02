const uuid = require('uuid');


module.exports = (app) => {
    app.get('/getAppointments', (req, res) => {
       // res.send(req.metaAuth.challenge);
       const appointmentId = uuid.v4();
       res.send(appointmentId)
    });
}