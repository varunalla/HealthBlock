const GRANTS = {
  STATUS_GRANT: "Grant to read the state of the service",
  PATIENT_GRANT: "Grant to access patient api",
  DOCTOR_GRANT: "Grant to access doctor api",
  HC_GRANT: "GRANT to access health care provider api",
  ADMIN: "Grant to access Admin api api",
};
const roleMappings = {
  patient: [GRANTS.PATIENT_GRANT, GRANTS.STATUS_GRANT],
  doctor: [GRANTS.DOCTOR_GRANT, GRANTS.STATUS_GRANT],
  hcprovider: [GRANTS.HC_GRANT, GRANTS.STATUS_GRANT],
  admin: [
    GRANTS.PATIENT_GRANT,
    GRANTS.DOCTOR_GRANT,
    GRANTS.HC_GRANT,
    GRANTS.ADMIN,
    GRANTS.STATUS_GRANT,
  ],
};
module.exports = {
  roleMappings,
  GRANTS,
};
