const { GRANTS, roleMappings } = require("./index");
function verifyGrant(grants) {
  return (req, res, next) => {
    const role = res.locals.decoded.type;
    const availableGrants = roleMappings[role];
    if (availableGrants) {
      for (let grant of grants) {
        if (availableGrants.indexOf(grant) === -1) {
          throw Error("Insufficient Privileges");
        }
      }
    } else {
      throw Error("invalid role");
    }
    next();
  };
}
module.exports = {
  verifyGrant,
};
