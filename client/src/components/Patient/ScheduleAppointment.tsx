import React, { FormEvent, FunctionComponent, useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';

import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { useAuthFetch } from '../../hooks/api';
interface Appointment {
  doctor_name: string;
  doctor_email: string;
  availability_time: string[];
  availability_date: string;
  reason: string;
}

const ScheduleAppointment: FunctionComponent<{}> = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { fetch } = useAuthFetch();
  const { user, role, logout } = useContext(AuthContext);
  const [appt_date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [time, setTime] = useState('10:00 AM');
  const [reason, setReason] = useState('');
  const [time_slots, setTimeSlots] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState<Appointment>({
    doctor_name: '',
    doctor_email: '',
    availability_time: [],
    availability_date: '',
    reason: '',
  });

  useEffect(() => {
    getDocAvailability(state.doctor, appt_date);
  }, []);
  const getDocAvailability = async (doc_email: string, appt_date: string) => {
    let resp = await fetch('GET', '/availability/' + `${doc_email}` + `/${appt_date}`);

    if (resp && resp.data && resp.data.result) {
      setTimeSlots(resp.data.result);
    } else {
      setTimeSlots([]);
    }
  };

  const scheduleAppt = async () => {
    const body = {
      patientEmail: user?.email,
      doctorEmail: state.doctor,
      patientName: user?.name,
      reason: reason,
      appointmentDate: appt_date,
      appointmentTime: time,
      status: 'pending',
    };
    let resp = await fetch('POST', '/appointments', body);

    if (resp && resp.status == 201) {
      alert('Appointment created');
    } else {
      alert('Could not schedule an appointment, Please try again!');
    }
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className='mt-4'>
      <h1 className='text-3xl leading-9 font-bold text-black'>Schedule Appointment</h1>
      <form onSubmit={handleSubmit} className='max-w-md mx-auto'>
        <div className='mb-4'>
          <label htmlFor='doctor-name' className='block text-gray-700 font-bold mb-2'>
            Doctor Name
          </label>
          <input
            type='text'
            id='doctor-name'
            value={state.doctor_name}
            //onChange={(e) =>
            //setDoctorName(e.target.value)
            //}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='doctor-email' className='block text-gray-700 font-bold mb-2'>
            Doctor Email
          </label>
          <input
            type='email'
            id='doctor-email'
            value={state.doctor}
            //onChange={(e) =>
            // setDoctorEmail(e.target.value)
            // }
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='date' className='block text-gray-700 font-bold mb-2'>
            Date
          </label>
          <input
            type='date'
            id='date'
            value={appt_date}
            onChange={(e) => {
              setDate(e.target.value);
              getDocAvailability(state.doctor, e.target.value);
            }}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='time-slot' className='block text-gray-700 font-bold mb-2'>
            Time Slot
          </label>
          <div style={{ justifyContent: 'space-between' }}>
            {time_slots.length > 0 ? (
              time_slots.map((ele) => {
                return (
                  <button
                    className={
                      time == ele
                        ? 'bg-blue-500 text-white font-bold py-2 px-4 rounded'
                        : 'bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
                    }
                    onClick={() => {
                      setTime(ele);
                    }}
                  >
                    {ele}
                  </button>
                );
              })
            ) : (
              <div>No time slots available</div>
            )}
          </div>
        </div>

        <div className='mb-4'>
          <label htmlFor='reason' className='block text-gray-700 font-bold mb-2'>
            Reason for Appointment
          </label>
          <textarea
            id='reason'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            //rows="3"
          ></textarea>
        </div>
        <div className='flex flex-row items-center justify-between w-80'>
          <button
            onClick={() => {
              scheduleAppt();
            }}
            className='bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'
          >
            Schedule
          </button>

          <button
            onClick={() => navigate('/patientappointments')}
            className='bg-red-500 text-white font-bold py-2 px-4 rounded'
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleAppointment;
