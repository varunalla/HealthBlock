import React, { FunctionComponent, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { useAuthFetch } from '../../hooks/api';
import { HealthContext } from '../../providers/HealthProvider';
import { hc_address } from '../../config/hc_constants';

const PatientDashboard: FunctionComponent<{}> = () => {
  const navigate = useNavigate();
  const { fetch } = useAuthFetch();
  const { user, role, logout } = useContext(AuthContext);
  const { fetchAllDoctors, doctorList } = useContext(HealthContext);
  const logouthandler = async () => {
    logout?.();
    navigate('/patientlogin');
  };
  const fetchStatus = async () => {
    console.log(await fetch('POST', '/verify_token/', {}));
  };

  const appointmentHandler = () => {
    navigate('/patientappointments');
  };
  const _renderApptSection = () => {
    return (
      <div className='text-white bg-blue-700 border border-gray-200 rounded-lg shadow-md p-6 flex justify-center w-200 h-300'>
        <button
          onClick={() => appointmentHandler()}
          className='text-white-800 py-2 px-6 rounded-full font-medium'
        >
          Manage Appointments
        </button>
      </div>
    );
  };

  return (
    <div className='flex flex-col h-screen'>
      <div style={{ width: '30%', marginTop: 10 }}>{_renderApptSection()}</div>
      {/* <button
        className='inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        onClick={() => appointmentHandler()}
      >
        Manage appointments
      </button> */}

      <div className='flex flex-row min-h-screen justify-center items-center'>
        <div className='w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700'>
          <div className='flex flex-col items-center pb-10'>
            {/* <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src="/docs/images/people/profile-picture-3.jpg" alt="Patient image" />*/}
            <h5 className='mb-1 text-xl font-medium text-gray-900 dark:text-white'>
              {' '}
              {user?.name}
            </h5>
            <span className='text-sm text-gray-500 dark:text-gray-400'>{user?.email}</span>
            <div className='flex mt-4 space-x-3 md:mt-6'>
              {/*  <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Age: {user?.age}</div>*/}
              <button
                className='inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                onClick={() => logouthandler()}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
