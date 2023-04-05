const Web3 = require('web3');
const fs = require('fs');
const {healthBlockAddress}=require('../config/constants');
const providerUrl = "http://127.0.0.1:8545";
class WebObj {
    constructor() {
        this.contract = {};
        this.healthBlock = '';
        this.web3 = new Web3();
    }

    setProvider() {
        this.web3.setProvider(new this.web3.providers.HttpProvider(providerUrl));
    }

    loadContract() {
        let source = fs.readFileSync("./client/src/contracts/HealthBlock.json");
        this.contract = JSON.parse(source);
        let tempContract = new this.web3.eth.Contract(this.contract.abi,healthBlockAddress );
        this.healthBlock = tempContract;
    }

    getWeb3() {
        return this.web3;
    }

    getHealthBlock() {
        return this.healthBlock;
    }
}
function init_web3() {
    web3Obj = new WebObj();
    web3Obj.setProvider();
    web3Obj.loadContract();
    //console.log(web3Obj);
}

function getWeb3Obj() {
    return web3Obj;
}

const fetchUserProfile = async (userAddress, callback) => {
    try {
        console.log(userAddress);
        let profile = await getWeb3Obj().getHealthBlock().methods.getPatientInfoAll(userAddress).call();
        callback(null, profile);
    }
    catch (e) {
        callback(e);
    }
}
const fetchDoctorProfile = async (userAddress, callback) => {
    try {
        let profile = await getWeb3Obj().getHealthBlock().methods.getDoctorInfoAll(userAddress).call();
        callback(null, profile);
    }
    catch (e) {
        callback("error");
    }
}

const fetchHCProviderProfile = async (userAddress, callback) => {
    try {
        let profile = await getWeb3Obj().getHealthBlock().methods.getHCProviderInfoAll(userAddress).call();
        callback(null, profile);
    }
    catch (e) {
        callback("error");
    }
}

module.exports = {
    fetchUserProfile,
    fetchDoctorProfile,
    fetchHCProviderProfile,
    init_web3,
    getWeb3Obj
}