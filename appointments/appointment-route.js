const { createDynamoDBClient } = require("../factories/aws");
const { encode_jwt, verify_token } = require("../utils/jwt");
const {
  getDoctors,
  getDocAvailability,
  postAppointments,
  getAppointments,
  updateAppointmentStatus,
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

      res.status(201).send({ success: true, result });
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
      console.log("err from post");
      res.status(500).json("Error creating appointment");
    }
  });

  app.get("/appointments/:doctorEmail", verify_token, async (req, res) => {
    let { doctorEmail } = req.params;
    try {
      let result = await getAppointments(doctorEmail);

      res.send({ success: true, result });
    } catch (err) {
      res.status(500).send({ success: false, msg: "Internal server err" });
    }
  });

  app.put(
    "/appointmentStatus/:appointmentID/status",
    verify_token,
    async (req, res) => {
      const { appointmentID } = req.params;
      const { appointmentStatus } = req.body;

      try {
        let result = await updateAppointmentStatus(
          appointmentID,
          appointmentStatus
        );

        res.status(204).send({ success: true, msg: "Update succesfull" });
      } catch (err) {
        res.status(500).send({ success: false, msg: "Update unsuccessful" });
      }
    }
  );
};