var HealthBlock = artifacts.require("HealthBlock");
var DoctorHealthBlock = artifacts.require("DoctorHealthBlock");
var HCProviderHealthBlock = artifacts.require("HCProviderHealthBlock");

module.exports = async function (deployer) {
    // deployment steps
    await deployer.deploy(HealthBlock);
    await deployer.deploy(DoctorHealthBlock);
    await deployer.deploy(HCProviderHealthBlock);
};