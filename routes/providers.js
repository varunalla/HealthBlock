const { fetchHCProviderProfile } = require("../web3-utils/user");
const { verify_token } = require("../utils/jwt");

module.exports = (app) => {
  app.get("/providers/:MetaAddress", verify_token, (req, res) => {
    fetchHCProviderProfile(req.params.MetaAddress, (err, profile) => {
      if (err) {
        return res.send({ success: false, msg: "error", err: err });
      }
      return res.send({ success: true, profile });
    });
  });
};
