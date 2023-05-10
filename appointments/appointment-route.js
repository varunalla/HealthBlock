const { createDynamoDBClient } = require("../factories/aws");
const { encode_jwt, verify_token } = require("../utils/jwt");
const {
  getDoctors,
  getDocAvailability,
  postAppointments,
  getAppointments,
  getConfirmedAppointments,
  updateAppointmentStatus,
  updateDoctorAvailability,
  postAvailability,
} = require("../utils/queries");
const uuid = require("uuid");
const { verifyEmail, sendEmail } = require("../utils/ses");

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
      doctor_address: req.body.doctorAddress,
      patient_address: req.body.patientAddress,
    };
    try {
      let result = await postAppointments(appointment);

      res.status(201).json("Appointment created succesfully");
    } catch (err) {
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

  app.get(
    "/confirmedAppointments/:doctorEmail",
    verify_token,
    async (req, res) => {
      let { doctorEmail } = req.params;
      try {
        let result = await getConfirmedAppointments(doctorEmail);

        res.send({ success: true, result });
      } catch (err) {
        res.status(500).send({ success: false, msg: "Internal server err" });
      }
    }
  );

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
  app.post(
    "/availability/:doctor/:doctorAddress",
    verify_token,
    async (req, res) => {
      let success = true;

      for (const [date, time] of Object.entries(req.body)) {
        try {
          await postAvailability(
            date,
            time,
            req.params.doctor,
            req.params.doctorAddress
          );
        } catch (err) {
          success = false;
        }
      }
      if (success) {
        res.status(204).send({ success: true, msg: "Insert successful" });
      } else {
        res.status(500).send({ success: false, msg: "Insert unsuccessful" });
      }
    }
  );

  app.post("/verify_emails", async (req, res) => {
    let email = req.body.email;
    try {
      await verifyEmail(email);
    } catch (err) {
      console.log("err-->", err);
    }
  });
};
