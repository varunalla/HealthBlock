const Web3 = require('web3');
const fs = require('fs');

const providerUrl = "http://127.0.0.1:8545";
const contractPort = "5777";
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
        //console.log(this.web3.eth);
        let tempContract = new this.web3.eth.Contract(this.contract.abi, "0x90018148DbAe289989f6beD30148963Cc960B3F7");
        //console.log(tempContract);
        this.healthBlock = tempContract;//tempContract.at(this.contract.networks[contractPort].address);
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
        console.log(e);
        callback("error");
    }
}
const fetchDoctorProfile = async (userAddress, callback) => {
    try {
        console.log(userAddress);
        let profile = await getWeb3Obj().getHealthBlock().methods.getDoctorInfoAll(userAddress).call();
        callback(null, profile);
    }
    catch (e) {
        console.log(e);
        callback("error");
    }
}

module.exports = {
    fetchUserProfile,
    fetchDoctorProfile,
    init_web3,
    getWeb3Obj
}