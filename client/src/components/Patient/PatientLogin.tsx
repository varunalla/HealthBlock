import React, { FunctionComponent, useContext } from 'react';
import { HealthContext } from '../../providers/HealthProvider';
import axios from 'axios';
import Web3 from 'web3';
import { AuthContext } from '../../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { blockChainAddress } from '../../config/constants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PatientLogin: FunctionComponent<{}> = () => {
  const { currentAccount } = useContext(HealthContext);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const loginhandler = async () => {
    let resp = await axios.get('/custom_auth/' + currentAccount);
    if (resp && resp.data) {
      const provider = new Web3.providers.HttpProvider(blockChainAddress);
      const web3 = new Web3(provider);
      const account = currentAccount || '';
      const signed = web3.utils.keccak256(resp.data.challenge);
      if (signed) {
        web3.eth.sign(signed, account, async (err, signature) => {
          let auth_resp = await axios.get(
            '/verify_auth/' + signature + '?client_address=' + account,
          );
          if (auth_resp.data && auth_resp.data.success) {
            login?.(auth_resp.data.user, auth_resp.data.user.token, 'patient');
            toast('Login Successfull');
            navigate('/patient');
          } else {
            console.error('login failed');
            toast.error('Invalid user Please Register', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored',
            });
          }
        });
      }
    }
  };
  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />
      <div>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'
          onClick={() => loginhandler()}
        >
          Login
        </button>
      </div>
    </>
  );
};

export default PatientLogin;
