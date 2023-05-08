import React, { FunctionComponent, useContext, useState } from 'react';
import { HealthContext } from '../../providers/HealthProvider';
import AWS from 'aws-sdk';
import axios from 'axios';
const HCProviderRegister: FunctionComponent<{}> = ({}) => {
  const { currentAccount, registerHCProviderHealthBlockContract } = useContext(HealthContext);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const generateKeys = async () => {
    try {
      const response = await axios.get('/proxy-reencryption/keys', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };  
  const uploadDoctorKeysToS3 = async (Keys: any, Name: string) => {
    try {
      AWS.config.update({
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        region: process.env.REACT_APP_AWS_REGION,
      });
      const s3 = new AWS.S3();
      const Buffer = require('buffer').Buffer;
      const KeysString = JSON.stringify(Keys);
      const params = {
        Bucket: process.env.REACT_APP_BUCKET_KEYS!,
        Key: `hcprovider_${Name}`,
        Body: Buffer.from(KeysString),
      };
      console.log(params);
      s3.upload(params, (err: any, data:any) => {
        if (err) {
          console.error('Error uploading HC provider Keys to S3:', err);
        } else {
          console.log('HC provider keys uploaded successfully. Location:', data.Location);
        }
      });
    } catch (err) {
      console.log('Error uploading HC provider Keys:', err);
    }
  };

  const registerHCProvider = async () => {
    try {
      await registerHCProviderHealthBlockContract?.(name, email, address, phone);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className='w-full max-w-sm' onSubmit={(e) => e.preventDefault()}>
      <div className='md:flex md:items-center mb-6'>
        <div className='md:w-1/3'>
          <label className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>
            Name
          </label>
        </div>
        <div className='md:w-2/3'>
          <input
            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
            id='inline-full-name'
            type='text'
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </div>
      </div>
      <div className='md:flex md:items-center mb-6'>
        <div className='md:w-1/3'>
          <label className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>
            Email
          </label>
        </div>
        <div className='md:w-2/3'>
          <input
            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
            id='inline-full-name'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </div>
      </div>
      <div className='md:flex md:items-center mb-6'>
        <div className='md:w-1/3'>
          <label className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>
            Address
          </label>
        </div>
        <div className='md:w-2/3'>
          <input
            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
            id='inline-full-name'
            type='text'
            value={address}
            onChange={(e) => setAddress(e.currentTarget.value)}
          />
        </div>
      </div>
      <div className='md:flex md:items-center mb-6'>
        <div className='md:w-1/3'>
          <label className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>
            Phone
          </label>
        </div>
        <div className='md:w-2/3'>
          <input
            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
            id='inline-full-name'
            type='string'
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
          />
        </div>
      </div>
      <div className='md:flex md:items-center mb-6'>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'
          onClick={async () => {
            const Keys = await generateKeys();
            registerHCProvider();
            await uploadDoctorKeysToS3(Keys, name);
          }}
        >
          Register HealthCare Provider
        </button>
      </div>
    </form>
  );
};

export default HCProviderRegister;
