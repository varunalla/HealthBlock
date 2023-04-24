import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { HealthContext } from '../../providers/HealthProvider';

const DoctorDashboard: React.FunctionComponent<{}> = () => {
  const { user, role, logout } = useContext(AuthContext);
  const { handleRaiseRequest } = useContext(HealthContext);
  const [hcProvider, setHCProvider] = useState<string>('');

  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  const logouthandler = () => {
    logout?.();
    navigate('/doctorlogin');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleVerificationRequest = async () => {
    try {
      await handleRaiseRequest?.(user!.name, file);
    } catch (err) {
      console.log(err);
    }
  };

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
                <input
                  className='bg-gray-200 appearance-none border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                  id='health-care-provider'
                  type='text'
                  value={hcProvider}
                  onChange={(e) => setHCProvider(e.target.value)}
                />
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
