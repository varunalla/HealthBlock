import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { HealthContext } from '../../providers/HealthProvider';

const DoctorDashboard: React.FunctionComponent<{}> = () => {
  const { user, role, logout } = useContext(AuthContext);
  const {fetchHealthCareProviders, providers, handleRaiseRequest} = useContext(HealthContext);
  const [hcProvider, setHCProvider] = useState<any>('');
  const [providerId, setProviderId] = useState<any>('');
  const [providerEmail, setProviderEmail] = useState<any>('');
  const { fetchAllDoctors, doctorList } = useContext(HealthContext);
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null | undefined>();

  const logouthandler = () => {
    logout?.();
    navigate('/doctorlogin');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  const checkDoctorKeys = async (name: string) => {
    try {
      const body = {
        bucket: process.env.REACT_APP_BUCKET_KEYS!,
        key: `doctor_${name}`,
      };
      let resp = await fetch('/s3download', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
      const keys:any = await resp.json();
      return keys.data;
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
      const body = {
        bucket: process.env.REACT_APP_BUCKET_KEYS!,
        key: `hcprovider_${name}`,
      };
      let resp = await fetch('/s3download', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
      const keys:any = await resp.json();
      return keys.data;
    } catch (err: any) {
      if (err.code === 'NotFound') {
        console.log("No keys found")
        return null;
      } else {
        throw err;
      }
    }
  };

  const handleVerificationRequest = async () => {
    try {
      if (!file) {
        console.error("File is undefined.");
        return undefined;
      }

      await handleRaiseRequest?.(user!.name, file!.name, providerId);
      uploadEncryptedFileToS3(file, file!.name, user!.name)

      const keys = await checkDoctorKeys(user!.name);
      console.log(keys);

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

      console.log("encrypt", encryptedData);

      const hcProviderKeys = await checkHCProviderKeys(hcProvider);

      console.log("HCP keys", hcProviderKeys);

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

      console.log("cfrags", cfrags);

      const Buffer = require('buffer').Buffer;
      const encryptedDataBuffer = Buffer.from(JSON.stringify(encryptedData), 'utf-8');
      const cfragsBuffer = Buffer.from(JSON.stringify(cfrags), 'utf-8');

      const params_encrypt = {
        bucket: process.env.REACT_APP_BUCKET_ENCRYPT,
        key: `doctor_${user!.name}`,
        data: encryptedDataBuffer
      };

      const params_reencrypt = {
        bucket: process.env.REACT_APP_BUCKET_REENCRYPT,
        key: `hcprovider_${hcProvider}`,
        data: cfragsBuffer,
      };

      await fetch('/s3upload', {
        method: 'POST',
        body: JSON.stringify(params_encrypt),
        headers: { 'Content-Type': 'application/json' },
      });

      await fetch('/s3upload', {
        method: 'POST',
        body: JSON.stringify(params_reencrypt),
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (err) {
      console.log(err);
    }
  };

  const uploadEncryptedFileToS3 = async (file: File | undefined, filename: string, key: string) => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', filename);
      formData.append('key', key);
      formData.append('providerEmail', providerEmail);
      try {
        await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('File uploaded successfully');
      } catch (error) {
        console.error('Failed to upload file:', error);
      }
    }
  };

  useEffect(() => {
    (async () => {
      await fetchHealthCareProviders?.();
    })();
  }, []);

  const appointmentHandler = () => {
    navigate('/doctorappointments');
  };

  const _renderAppointmentSection = () => {
    return (
      <div className='bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg shadow-lg p-6 flex justify-center w-400 h-300"'>
        <button
          onClick={() => appointmentHandler()}
          className='bg-white text-gray-800 py-2 px-6 rounded-full font-medium'
        >
          Appointments
        </button>
      </div>
    );
  };
  const _renderManageScheduleSection = () => {
    return (
      <div className='bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg shadow-lg p-6 flex justify-center w-400 h-300"'>
        <button
          onClick={() => navigate('/manageschedule')}
          className='bg-white text-gray-800 py-2 px-6 rounded-full font-medium'
        >
          Manage Schedule
        </button>
      </div>
    );
  };
  const _renderUpdateProfileSection = () => {
    return (
      <div className='bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg shadow-lg p-6 flex justify-center w-400 h-300"'>
        <button
          onClick={() => navigate('/update-profile')}
          className='bg-white text-gray-800 py-2 px-6 rounded-full font-medium'
        >
          Register with Health Care
        </button>
      </div>
    );
  };

  
  return (
    <div className='flex flex-col justify-center h-screen'>
      <div className='flex flex-row space-x-6'>
        {_renderAppointmentSection()}
        {_renderUpdateProfileSection()}
        {_renderManageScheduleSection()}
      </div>

      {/* <button
        className='mb-4 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        onClick={() => appointmentHandler()}
      >
        Appointments
      </button> */}
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
                  onChange={(e) => {
                    const selectedProviderName = e.target.value;
                    const selectedProvider = providers && providers.find(provider => provider.name === selectedProviderName);
                    const hcpId = selectedProvider ? selectedProvider.id : '';
                    const hcpEmail = selectedProvider ? selectedProvider.email : '';
                    setHCProvider(e.target.value);
                    setProviderId(hcpId);
                    setProviderEmail(hcpEmail);
                  }}
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

