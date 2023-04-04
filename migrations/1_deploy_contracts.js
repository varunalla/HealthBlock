var HealthBlock = artifacts.require("HealthBlock");
var DoctorHealthBlock = artifacts.require("DoctorHealthBlock");

module.exports = async function (deployer) {
    // deployment steps
    await deployer.deploy(HealthBlock);
};