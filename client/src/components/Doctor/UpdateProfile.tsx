import axios from 'axios';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';

import { AuthContext } from '../../providers/AuthProvider';
import { useAuthFetch } from '../../hooks/api';
import { HealthContext } from '../../providers/HealthProvider';
interface AppointmentDetails {
  name: string;
  patient_email: string;
  appointment_id: string;
  patient_name: string;
  created_at: string;
  appointment_time: string;
  appointment_status: string;
}

const UpdateProfile: FunctionComponent<{}> = () => {
  const [address, setAddress] = useState('');
  const { updateProfile } = useContext(HealthContext);
  return (
    <div className='flex flex-col items-center'>
      <form className='w-full max-w-sm mt-8'>
        <div className='flex items-center border-b border-teal-500 py-2'>
          <input
            className='appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none'
            type='text'
            placeholder='Enter your input here'
            aria-label='Input field'
            onChange={(e) => setAddress(e.target.value)}
          />
          <button
            onClick={() =>
              updateProfile?.(
                '0xB74357Df49Ed35Ec1AEc5efdA41f5A5D846fAa8e',
                '0xa05441fF1F5320ff56001662B70057A9B5CFB762',
              )
            }
            className='flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded'
            type='button'
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
export default UpdateProfile;
