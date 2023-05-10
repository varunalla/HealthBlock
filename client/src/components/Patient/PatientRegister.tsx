import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { HealthContext } from '../../providers/HealthProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthFetch } from '../../hooks/api';

const PatientRegister: FunctionComponent<{}> = ({}) => {
  const {
    currentAccount,
    healthBlockContract,
    registerHealthBlockContract,
    fetchPatientContract,
    fetchPatientInfoContract,
  } = useContext(HealthContext);
  const { fetch } = useAuthFetch();
  const [name, setName] = useState<string>('varun');
  const [age, setAge] = useState<number>(32);
  const [email, setEmail] = useState<string>('abc@abc.com');

  const verifyEmail = () => {
    fetch('POST', '/verify_emails/', { email });
  };
  const registerPatient = async () => {
    try {
      //read patient info
      const user = await fetchPatientContract?.();
      if (!user?.email) {
        toast('Patient Registration Initiated!');
        await registerHealthBlockContract?.(name, age, email);
        //feed back to user for registration
        toast('Patient Created');
        verifyEmail();
      } else {
        toast.error('User already present', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
    } catch (err) {
      toast.error('Error Registering Patient, please try after sometime!');
      console.log('Register Error', err);
    }
  };
  const fetchPatient = async () => {
    try {
      await fetchPatientContract?.();
    } catch (err) {
      console.log('Fetch Patient Error', err);
    }
  };
  useEffect(() => {
    healthBlockContract?.();
  }, []);
  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />
      <form className='w-full max-w-sm' onSubmit={(e) => e.preventDefault()}>
        <div className='md:flex md:items-center mb-6'>
          <div className='md:w-1/3'>
            <label className='block text-white font-bold md:text-right mb-1 md:mb-0 pr-4'>
              Full Name
            </label>
          </div>
          <div className='md:w-2/3'>
            <input
              className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
              id='inline-full-name'
              type='text'
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className='md:flex md:items-center mb-6'>
          <div className='md:w-1/3'>
            <label className='block text-white  font-bold md:text-right mb-1 md:mb-0 pr-4'>
              Age
            </label>
          </div>
          <div className='md:w-2/3'>
            <input
              className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
              id='inline-full-name'
              type='number'
              value={age}
              onChange={(e) =>
                e.currentTarget.value === '' ? setAge(0) : setAge(parseInt(e.currentTarget.value))
              }
            />
          </div>
        </div>
        <div className='md:flex md:items-center mb-6'>
          <div className='md:w-1/3'>
            <label className='block text-white  font-bold md:text-right mb-1 md:mb-0 pr-4'>
              Email
            </label>
          </div>
          <div className='md:w-2/3'>
            <input
              className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
              id='inline-full-name'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className='md:flex md:items-center mb-6'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'
            onClick={() => registerPatient()}
          >
            Register Patient
          </button>
          {/*<button onClick={() => fetchPatient()}>Fetch Patient</button> */}
        </div>
      </form>
    </>
  );
};

export default PatientRegister;
