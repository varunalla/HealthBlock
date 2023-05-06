import axios from 'axios';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';

import { AuthContext } from '../../providers/AuthProvider';
import { useAuthFetch } from '../../hooks/api';
import { HealthContext } from '../../providers/HealthProvider';
import moment from 'moment';
interface AppointmentDetails {
  name: string;
  patient_email: string;
  appointment_id: string;
  patient_name: string;
  created_at: string;
  appointment_time: string;
  appointment_status: string;
}

const DoctorAppointments: FunctionComponent<{}> = () => {
  const { user, role, logout } = useContext(AuthContext);
  const { fetch } = useAuthFetch();
  const { fetchAllDoctors, doctorList } = useContext(HealthContext);
  const [filterDate, setFilterDate] = useState('all');
  const [appointmentData, setAppointmentData] = useState<AppointmentDetails[]>([]);

  useEffect(() => {
    //fetchDoctors();

    getAppointment();
  }, []);

  const getAppointment = async () => {
    console.log('filterdate-->', filterDate);
    let resp = await fetch('GET', '/appointments/' + user?.email + `?created_at= ${filterDate}`);
    if (resp && resp.data && resp.data.result) {
      setAppointmentData(resp.data.result);
    } else {
      setAppointmentData([]);
    }
  };

  const getStatusColor = (status: String) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-200';
      case 'reject':
        return 'bg-red-200';
      default:
        return '';
    }
  };
  const updateStatus = async (status: String, appointmentId: String) => {
    let resp = await fetch('PUT', '/appointmentStatus/' + appointmentId + '/status', {
      appointmentStatus: status,
    });

    if (resp && resp.status == 204) {
      alert('Appointment status updated');
      getAppointment();
    }
  };

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
            value={filterDate}
            onChange={(e) => {
              let date = moment(e.target.value).format('YYYY-MM-DD');
              setFilterDate(date);
            }}
            className='border border-gray-300 rounded-md px-4 py-2'
          />
          <button
            onClick={() => {
              getAppointment();
            }}
            className='bg-blue-500 text-white font-bold rounded-md px-4 py-2 ml-2'
          >
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
                    Name
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
                    Date
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Time
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {appointmentData.length > 0 &&
                  appointmentData.map((appointment) => (
                    <tr key={appointment.appointment_id}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{appointment.patient_name}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{appointment.patient_email}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {appointment.created_at}
                      </td>

                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {appointment.appointment_time}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            appointment.appointment_status,
                          )}`}
                        >
                          {appointment.appointment_status == 'pending' ? (
                            <div className='flex justify-between'>
                              <button
                                className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded'
                                onClick={() => updateStatus('reject', appointment.appointment_id)}
                              >
                                Reject
                              </button>
                              <div className='w-4'></div>
                              <button
                                className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded'
                                onClick={() =>
                                  updateStatus('confirmed', appointment.appointment_id)
                                }
                              >
                                Confirm
                              </button>
                            </div>
                          ) : (
                            <div>{appointment.appointment_status}</div>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
