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
  const [hc, setHc] = useState('');
  const { updateProfile, currentAccount } = useContext(HealthContext);
  const account = currentAccount || '';

  let providers = [
    {
      name: 'Kaiser',
      address: '0xB74357Df49Ed35Ec1AEc5efdA41f5A5D846fAa8e',
    },
    {
      name: 'Sutter Health Care',
      address: '0xEE619586e0826CA2F00772701eADc2065E5D5A47',
    },
    {
      name: 'El Camino',
      address: '0x8eda1014b9177d464306935e8fcf9fd27c20aa08',
    },
  ];

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
              {providers &&
                providers.map((provider) => (
                  <option value={provider.address}>{provider.name}</option>
                ))}
            </select>
          </div>
          <button
            onClick={() => updateProfile?.(hc, account)}
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
