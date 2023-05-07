import React, { FunctionComponent, useContext, useState } from 'react';
import { HealthContext } from '../../providers/HealthProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HCProviderRegister: FunctionComponent<{}> = ({}) => {
  const { currentAccount, 
          healthBlockContract,
          fetchHealthCareProviderContract,
          registerHCProviderHealthBlockContract } = useContext(HealthContext);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const registerHCProvider = async () => {
    try {
      const user = await fetchHealthCareProviderContract?.();
      if (!user?.email) {
        toast('HealthCare Provider Registration Initiated!');
        await registerHCProviderHealthBlockContract?.(name, email, address, phone);
        toast('HealthCare Provider Created');
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
      toast.error('Error Registering HealthCare Provider, please try after sometime!');
      console.log('Register Error', err);
    }
    try {
      await registerHCProviderHealthBlockContract?.(name, email, address, phone);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <form className='w-full max-w-sm' onSubmit={(e) => e.preventDefault()}>
      <div className='md:flex md:items-center mb-6'>
        <div className='md:w-1/3'>
          <label className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>
            Name
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
          <label className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>
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
        <div className='md:w-1/3'>
          <label className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>
            Address
          </label>
        </div>
        <div className='md:w-2/3'>
          <input
            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
            id='inline-full-name'
            type='text'
            value={address}
            onChange={(e) => setAddress(e.currentTarget.value)}
          />
        </div>
      </div>
      <div className='md:flex md:items-center mb-6'>
        <div className='md:w-1/3'>
          <label className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>
            Phone
          </label>
        </div>
        <div className='md:w-2/3'>
          <input
            className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
            id='inline-full-name'
            type='string'
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
          />
        </div>
      </div>
      <div className='md:flex md:items-center mb-6'>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'
          onClick={() => registerHCProvider()}
        >
          Register HealthCare Provider
        </button>
      </div>
    </form>
  );
};

export default HCProviderRegister;
