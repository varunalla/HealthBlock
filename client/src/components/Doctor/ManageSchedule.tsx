import axios from 'axios';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { useAuthFetch } from '../../hooks/api';
import { AuthContext } from '../../providers/AuthProvider';
import { HealthContext } from '../../providers/HealthProvider';

type Schedule = {
  [day: string]: { startTime: string; endTime: string };
};
type Schedule1 = {
  [day: string]: String[];
};

const ManageSchedule: FunctionComponent<{}> = () => {
  const [daysOfTheweek, setDaysOfWeek] = useState<String[]>([]);
  const { user } = useContext(AuthContext);
  const { currentAccount } = useContext(HealthContext);
  let opt = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
  ];
  const [schedule, setSchedule] = useState<Schedule>({});
  const [schedule1, setSchedule1] = useState<Schedule1>({});
  const { fetch } = useAuthFetch();
  const getDatesOfTheWeek = () => {
    let currentDate = moment().add(1, 'day');
    // let weekEnd = moment().endOf('week').subtract(1, 'day').endOf('day');
    let weekEnd = moment().endOf('week').endOf('day');
    let datesUntilSaturday = [];

    while (currentDate <= weekEnd) {
      datesUntilSaturday.push(moment(currentDate).format('YYYY-MM-DD'));
      currentDate = moment(currentDate).add(1, 'day');
    }

    setDaysOfWeek(datesUntilSaturday);

    return datesUntilSaturday;
  };

  useEffect(() => {
    getDatesOfTheWeek();
  }, []);

  const setChange = (event: React.ChangeEvent<HTMLSelectElement>, day: string, start: boolean) => {
    let scheduleData = { ...schedule };
    scheduleData[day] = {
      ...scheduleData[day],
      [event.target.name]: event.target.value,
    };
    setSchedule(scheduleData);
  };
  console.log('scheduledata-->', schedule);
  const handleSubmit = async () => {
    for (const dateStr in schedule) {
      const { startTime, endTime } = schedule[dateStr];
      const date = moment(dateStr);
      const timeSlots = [];

      // loop through each hour between start and end times
      for (
        let time = moment(startTime, 'h:mm A');
        time.isSameOrBefore(moment(endTime, 'h:mm A'));
        time.add(1, 'hour')
      ) {
        timeSlots.push(time.format('h:mm A'));
      }

      // assign the time slots array to the date in the schedule object
      schedule1[dateStr] = timeSlots;
    }
    let resp = await fetch(
      'POST',
      '/availability/' + user?.email + `/${currentAccount}`,
      schedule1,
    );
    if (resp && resp.status == 204) {
      alert('Schedule created');
    } else {
      alert('Could not schedule, Please try again!');
    }
  };

  return (
    <div>
      <h1 className='text-3xl leading-9 font-bold text-black mt-10 text-center '>
        Manage Schedule
      </h1>
      <div className='flex flex-col justify-center items-center  h-screen'>
        <div>
          {daysOfTheweek.map((day) => (
            <div className='mb-10'>
              <div className='flex flex-row '>
                <div className='w-60%  bg-blue-500"'>
                  <input
                    type='text'
                    className='border-b border-teal-500 focus:outline-none focus:border-teal-700 w-30 mr-10 items-center'
                    value={day.toString()}
                  />
                </div>
                <div className='w-40% flex flex-row items-center'>
                  <select
                    name='startTime'
                    onChange={(e) => setChange(e, day.toString(), true)}
                    className='block appearance-none border border-gray-400 rounded py-1 px-2 mr-4'
                  >
                    {' '}
                    Start Time
                    {opt.map((time) => {
                      return <option value={time}>{time}</option>;
                    })}
                  </select>
                  <select
                    name='endTime'
                    onChange={(e) => setChange(e, day.toString(), false)}
                    className='block appearance-none border border-gray-400 rounded py-1 px-2 mr-4'
                  >
                    {' '}
                    End time
                    {opt.map((time) => {
                      return <option value={time}>{time}</option>;
                    })}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => handleSubmit()}
          className='mb-4 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        >
          Submit
        </button>
      </div>
    </div>
  );
};
export default ManageSchedule;
