var HealthBlock = artifacts.require("HealthBlock");

module.exports = async function (deployer) {
    // deployment steps
    await deployer.deploy(HealthBlock);
};