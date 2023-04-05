import React, { FunctionComponent } from 'react';
import PatientLogin from './PatientLogin';
import PatientRegister from './PatientRegister';

const PatientLanding: FunctionComponent<{}> = () => {
  return (
    <>
      <div className='flex flex-row min-h-screen justify-center items-center'>
        <div className='flex flex-col'>
          <div className='flex flex-row space-x-4'>
            <div className='w-96 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700'>
              <a href='#'>
                <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
                  Patient Signup{' '}
                </h5>
              </a>
              <PatientRegister />
            </div>

            <div className='w-96 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700'>
              <a href='#'>
                <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
                  Patient Login{' '}
                </h5>
              </a>
              <div className='flex flex-row  justify-center items-center'>
                <PatientLogin />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientLanding;
