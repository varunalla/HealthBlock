var HealthBlock = artifacts.require("HealthBlock");
var PatientProvider = artifacts.require("PatientProvider");
module.exports = async function (deployer) {
  // deployment steps
  await deployer.deploy(HealthBlock);
  await deployer.deploy(PatientProvider);
};
