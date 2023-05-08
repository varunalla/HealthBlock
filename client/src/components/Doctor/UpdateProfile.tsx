import axios from 'axios';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';

import { AuthContext } from '../../providers/AuthProvider';
import { useAuthFetch } from '../../hooks/api';
import { HealthContext } from '../../providers/HealthProvider';
import { hc_address, hc_registed } from '../../config/hc_constants';
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
  const [hc, setHc] = useState('');
  const { user } = useContext(AuthContext);
  const { updateProfile, currentAccount, raiseDoctorToHCRequest } = useContext(HealthContext);
  const account = currentAccount || '';

  return (
    <div className='flex flex-col items-center'>
      <form className='w-full max-w-sm mt-8'>
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
              value={hc}
              onChange={(e) => {
                setHc(e.target.value);
              }}
            >
              <option value=''>Select a provider</option>
              {hc_registed &&
                hc_registed.map((provider) => (
                  <option value={provider.address}>{provider.name}</option>
                ))}
            </select>
          </div>
          <button
            onClick={() => {
              if (user?.name) {
                raiseDoctorToHCRequest?.(hc, account, user?.name);
              }
            }}
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
