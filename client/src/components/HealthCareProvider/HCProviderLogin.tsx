import React, { FunctionComponent, useContext } from "react";
import { HealthContext } from "../../providers/HealthProvider";
import axios from 'axios';
import Web3 from 'web3';
import { AuthContext } from "../../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const HCProviderLogin: FunctionComponent<{}> = () => {
    const { currentAccount } = useContext(HealthContext);
    const url = 'http://127.0.0.1:8545';
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const loginhandler = async () => {
        console.log('login')
        let resp = await axios.get('/custom_auth/' + currentAccount);

        if (resp && resp.data) {
            const provider = new Web3.providers.HttpProvider(url);
            const web3 = new Web3(provider);
            const account = currentAccount || "";

            const signed = web3.utils.keccak256(resp.data.challenge);
            console.log(signed)
            if (signed) {
                web3.eth.sign(signed, account, async (err, signature) => {
                    let auth_resp = await axios.get('/verify_auth/hcprovider/' + signature + '?client_address=' + account);

                    if (auth_resp.data && auth_resp.data.success) {

                        console.log("login success ", auth_resp.data);
                        login?.(auth_resp.data.user, auth_resp.data.user.token, "hcprovider");
                        navigate('/hcprovider');
                    } else {
                        console.error("login failed");
                    }
                });
            }
        }
    }
    return (<div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={() => loginhandler()}>
            Login
        </button>
    </div>)
}

export default HCProviderLogin;