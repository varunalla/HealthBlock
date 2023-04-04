const cache = require("memory-cache");
const crypto = require('crypto');
const web3 = require('web3');
const { fetchUserProfile, getWeb3Obj, fetchDoctorProfile, fetchHCProviderProfile} = require("../web3-utils/user");
const { encode_jwt, verify_token } = require("../utils/jwt");
const ethers = require('ethers');

module.exports = (app, metaAuth) => {
    app.get('/auth/:MetaAddress', metaAuth, (req, res) => {
        res.send(req.metaAuth.challenge);
    });

    app.get('/auth/:MetaMessage/:MetaSignature', metaAuth, (req, res) => {
        if (req.metaAuth.recovered) {
            fetchUserProfile(req.metaAuth.recovered, (err, profile) => {
                let user = {
                    name: profile[0],
                    role: profile[1],
                }
                user.token = encode_jwt(Object.assign({}, user, { id: req.metaAuth.recovered }));
                res.send({ "success": true, user });
            });
        } else {
            res.status(500).send();
        };
    });

    app.get('/custom_auth/:MetaAddress', (req, res) => {
        let web3 = getWeb3Obj().getWeb3();
        let { MetaAddress } = req.params;
        if (MetaAddress && web3.utils.isAddress(MetaAddress)) {
            try {
                crypto.randomBytes(48, function (err, buffer) {
                    var challenge = buffer.toString('hex');
                    cache.put(MetaAddress, challenge, 60000);// one minute
                    res.json({ challenge, success: true });
                });
            }
            catch (e) {
                res.json({ success: false, msg: "error" });
            }
        }
        else {
            res.json({ success: false, msg: "invalid or missing address" });
        }
    });

    app.get('/verify_auth/:signature', (req, res) => {
        let { client_address } = req.query;
        let challenge = cache.get(client_address);
        if (req.params.signature && challenge) {
            const pk = ethers.utils.recoverPublicKey(ethers.utils.arrayify(ethers.utils.hashMessage(ethers.utils.arrayify(web3.utils.keccak256(challenge)))), req.params.signature);
            const recoveredAddress = ethers.utils.computeAddress(pk);
            if (recoveredAddress.toLowerCase() === client_address) {
                fetchUserProfile(client_address, (err, profile) => {
                    if(profile['0']&&profile['1']&&profile['2']){
                        let user = {
                            name: profile[0],
                            email: profile[2],
                            age: profile[1]
                        }
                        user.token = encode_jwt(Object.assign({}, user, { client_address }));
                        res.send({ "success": true, user });
                    }
                    else{
                       res.status(401).send();
                    }
                    
                });
            }
            else {
                res.status(500).send();
            }
        }
        else {
            res.status(500).send();
        }
    });
    app.get('/verify_auth/doctor/:signature', (req, res) => {
        let { client_address } = req.query;
        let challenge = cache.get(client_address);
        if (req.params.signature && challenge) {
            const pk = ethers.utils.recoverPublicKey(ethers.utils.arrayify(ethers.utils.hashMessage(ethers.utils.arrayify(web3.utils.keccak256(challenge)))), req.params.signature);
            const recoveredAddress = ethers.utils.computeAddress(pk)
            if (recoveredAddress.toLowerCase() === client_address) {
                fetchDoctorProfile(client_address, (err, profile) => {
                    if(profile['0']&&profile['1']&&profile['2']){
                        let user = {
                            name: profile[0],
                            email: profile[2],
                            address: profile[1]
                        }
                        user.token = encode_jwt(Object.assign({}, user, { client_address }));
                        res.send({ "success": true, user });
                    }
                    else{
                        res.status(401).send();
                    }
                });
            }
            else {
                res.status(500).send();
            }
        }
        else {
            res.status(500).send();
        }
    });
    app.get('/verify_auth/hcprovider/:signature', (req, res) => {
        let { client_address } = req.query;
        let challenge = cache.get(client_address);
        if (req.params.signature && challenge) {
            const pk = ethers.utils.recoverPublicKey(ethers.utils.arrayify(ethers.utils.hashMessage(ethers.utils.arrayify(web3.utils.keccak256(challenge)))), req.params.signature);
            const recoveredAddress = ethers.utils.computeAddress(pk)
            if (recoveredAddress.toLowerCase() === client_address) {
                fetchHCProviderProfile(client_address, (err, profile) => {
                    console.log("profile-->", profile)
                    if(profile['0']&&profile['1']&&profile['2']&& profile['3']){
                        let user = {
                            name: profile[0],
                            email: profile[1],
                            address: profile[2],
                            phone: profile[3]
                        }
                        user.token = encode_jwt(Object.assign({}, user, { client_address }));
                        res.send({ "success": true, user });
                    }
                    else{
                        res.status(401).send();
                    }
                });
            }
            else {
                res.status(500).send();
            }
        }
        else {
            res.status(500).send();
        }
    });
    app.head('/verify_token/', verify_token, (req, res) => {
        res.writeHead(200, { 'success': true });
        res.end();
    });
}