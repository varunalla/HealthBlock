import React, { FunctionComponent, useContext, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { useAuthFetch } from '../../hooks/api';
import { HealthContext } from '../../providers/HealthProvider';
import { hc_address } from '../../config/hc_constants';

interface AppointmentRequestDetails {
  doctor_name: string;
  doctor_email: string;
  speciality: string;
  time_slots: string[];
  availability_date: string;
}

interface Doctor {
  name: string;
  email: string;
  age: Number;
  specialization: string;
}
const PatientAppointment: FunctionComponent<{}> = () => {
  const navigate = useNavigate();
  const { fetch } = useAuthFetch();
  const { user, role, logout } = useContext(AuthContext);
  const { fetchAllDoctors, doctorList } = useContext(HealthContext);
  const [doctorDetails, setDoctorDetails] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState({});

  useEffect(() => {
    fetchAllDoctors?.(hc_address);

    setDoctorDetails(doctorDetails);
  }, []);

  return (
    <div className='flex flex-col  px-4 lg:px-8 '>
      <div className='bg-gray-100 py-4 px-4 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Appointments</h1>
        <div className='flex items-center'>
          <label htmlFor='date' className='mr-2 text-sm font-medium'>
            Filter by date:
          </label>
          <input
            type='date'
            id='date'
            name='date'
            className='border border-gray-300 rounded-md px-4 py-2'
          />
          <button className='bg-blue-500 text-white font-bold rounded-md px-4 py-2 ml-2'>
            Filter
          </button>
        </div>
      </div>
      <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 mt-8'>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Doctor Name
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Email ID
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Speciality
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {doctorList &&
                  doctorList.map((details) => (
                    <tr>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{details.name}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{details.email}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {details.specialization}
                      </td>
                      <td className='px-6 py-2 whitespace-nowrap text-sm text-gray-500'>
                        <button
                          onClick={() => {
                            //localStorage.setItem('doctor_selected', JSON.stringify(details));

                            navigate('/scheduleappointments', {
                              state: {
                                doctor_name: details.name,
                                doctor: details.email,
                              },
                            });
                            //setSelectedDoctor(details)
                          }}
                          className='bg-blue-500 text-white font-bold rounded-md px-4 py-2 ml-2'
                        >
                          Schedule
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {}
    </div>
  );
};
export default PatientAppointment;
