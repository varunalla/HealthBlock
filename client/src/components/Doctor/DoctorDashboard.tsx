import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { HealthContext } from '../../providers/HealthProvider';
const AWS = require('aws-sdk');
import * as CryptoJS from 'crypto-js';

const DoctorDashboard: React.FunctionComponent<{}> = () => {
  const { user, role, logout } = useContext(AuthContext);
  const {fetchHealthCareProviders, providers, handleRaiseRequest } = useContext(HealthContext);
  const [hcProvider, setHCProvider] = useState<any>('');
  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION
  });
  console.log("s3", s3);
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>();

  const logouthandler = () => {
    logout?.();
    navigate('/doctorlogin');
  };
  
  const encrypt = (data: Uint8Array, key: string): Uint8Array => {
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(new TextDecoder().decode(data)),
      key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).ciphertext;
    //const encryptedString = CryptoJS.enc.Hex.stringify(encrypted);
    //return Buffer.from(encryptedString, 'hex');
    return new Uint8Array(encrypted.words);
  };

const checkDoctorKeys = async (name: string) => {
  try {
    const params = {
      Bucket: process.env.REACT_APP_BUCKET_KEYS!,
      Key: `doctor_${name}`,
    };
    const data = await s3.getObject(params).promise();
    const Buffer = require('buffer').Buffer;
    const keys = JSON.parse(Buffer.from(data.Body).toString('utf-8'));
    return keys;
  } catch (err: any) {
    if (err.code === 'NotFound') {
        console.log("No keys found")
        return null;
    } else {
      throw err;
    }
  }
};
const checkHCProviderKeys = async (name: string) => {
  try {
    const params = {
      Bucket: process.env.REACT_APP_BUCKET_KEYS,
      Key: `hcprovider_${name}`,
    };
    const data = await s3.getObject(params).promise();
    const Buffer = require('buffer').Buffer;
    const keys = JSON.parse(Buffer.from(data.Body).toString('utf-8'));
    return keys;
  } catch (err: any) {
    if (err.code === 'NotFound') {
      console.log("No keys found")
      return null;
    } else {
      throw err;
    }
  }
};
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleVerificationRequest = async () => {
    try {
      await handleRaiseRequest?.(user!.name, file!.name);
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const encryptedFile = encrypt(new Uint8Array(arrayBuffer), user!.name);
        console.log("file --->", file)
        setFile(new File([encryptedFile], file.name, { type: file.type }));
        console.log("encryptedFile --->", encryptedFile)
        const keys = await checkDoctorKeys(user!.name);
        console.log("Doctor keys:")
        console.log(keys)
      console.log(JSON.stringify({
        aesKey: user!.name,
        private_key: keys.data.private_key,
        public_key: keys.data.public_key,
        signing_key: keys.data.signing_key
      }))
      const response_encrypt = await fetch('/proxy-reencryption/encrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aesKey: user!.name,
          private_key: keys.data.private_key,
          public_key: keys.data.public_key,
          signing_key: keys.data.signing_key
        })
      });
      const encryptedData = await response_encrypt.json();
      console.log("/Encrypt response data")
      console.log(encryptedData);
      const hcProviderKeys = await checkHCProviderKeys(hcProvider);
      console.log("HCProvider keys")
      console.log(hcProviderKeys)
      const req_public_key = hcProviderKeys.data.public_key;

      const response_reencrypt = await fetch('/proxy-reencryption/reencrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          capsule: encryptedData.data.capsule,
          private_key: keys.data.private_key,
          public_key: hcProviderKeys.data.public_key,
          signing_key: keys.data.signing_key,
        })
      });

      const cfrags = await response_reencrypt.json();
      console.log("/Reencrypt response data")
      console.log(cfrags);
      const Buffer = require('buffer').Buffer;
      const encryptedDataBuffer = Buffer.from(JSON.stringify(encryptedData), 'utf-8');
      const cfragsBuffer = Buffer.from(JSON.stringify(cfrags), 'utf-8');

        const params_file = {
          Bucket: process.env.REACT_APP_BUCKET_NAME,
          Key: file.name,
          Body: encryptedFile.buffer,
        };
        const params_encrypt = {
          Bucket: process.env.REACT_APP_BUCKET_ENCRYPT,
          Key: `doctor_${user!.name}`,
          Body: encryptedDataBuffer,
        };
        const params_reencrypt = {
          Bucket: process.env.REACT_APP_BUCKET_REENCRYPT,
          Key: `hcprovider_${hcProvider}`,
          Body: cfragsBuffer,
        };

        s3.upload(params_file, (err: any, data: any) => {
          if (err) {
            console.log("Encrypted AES file upload is unsuccessful")
            console.error(err);
          } else {
            console.log('File uploaded successfully.Location:'+ data.Location);
          }
        });
        
        s3.upload(params_encrypt, (err: any, data: any) => {
          if (err) {
            console.log("Encrypt response is not getting stored in s3")
            console.error(err);
          } else {
            console.log('Encrypt response file uploaded successfully. Location:', data.Location);
          }
        });
        s3.upload(params_reencrypt, (err: any, data: any) => {
          if (err) {
            console.log('Error uploading cfraggs:', err);
          } else {
            console.log('cfraggs uploaded successfully. Location:', data.Location);
          }
        });


      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    (() => {
      fetchHealthCareProviders?.();
    console.log(providers);
    })();
  }, []);

  const appointmentHandler = () => {
    navigate('/doctorappointments');
  };

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className='w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center'>
        <h5 className='mt-4 mb-1 text-xl font-medium text-gray-900 dark:text-white'>
          {user?.name}
        </h5>
        <span className='mb-4 text-sm text-gray-500 dark:text-gray-400'>{user?.email}</span>
        <button
          className='mb-4 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          onClick={() => logouthandler()}
        >
          Logout
        </button>
      </div>

      <div className='mt-8 w-full max-w-screen-lg mx-auto'>
        <div className='bg-white border border-gray-300 rounded-lg shadow-md dark:bg-gray-3000 dark:border-gray-2500 p-4'>
          <form onSubmit={(e) => e.preventDefault()}>
          <div className='md:flex md:items-center mb-6'>
              <div className='md:w-1/3'>
                <label
                  className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'
                  htmlFor='health-care-provider'
                >
                  HealthCare Provider
                </label>
              </div>
              <div className='md:w-1/2'>
                <select
                  className='bg-gray-200 appearance-none border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                  id='health-care-provider'
                  value={hcProvider}
                  onChange={(e) => setHCProvider(e.target.value)}
                >
                  <option value=''>Select a provider</option>
                  {providers && providers.map(provider => (
                    <option key={provider.email} value={provider.name}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='md:flex md:items-center mb-6'>
              <div className='md:w-1/3'>
                <label
                  className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'
                  htmlFor='file'
                >
                  File Upload
                </label>
              </div>
              <div className='md:w-1/2'>
                <input
                  type='file'
                  id='file'
                  name='file'
                  accept='.pdf,.doc,.docx,.txt'
                  onChange={handleFileUpload}
                  className='border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                />
              </div>
            </div>
            <div className='md:flex md:items-center mb-6'>
              <div className='md:w-1/3'></div>
              <div className='md:w-1/2'>
                <button
                  className='bg-blue-500 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 border border-blue-700 rounded'
                  onClick={() => handleVerificationRequest()}
                >
                  Request Credential Verification
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
