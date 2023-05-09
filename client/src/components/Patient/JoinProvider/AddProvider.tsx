import { ethers } from 'ethers';
import { FunctionComponent, useContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { HealthContext } from '../../../providers/HealthProvider';

const AddProviderComponent: FunctionComponent<{}> = () => {
  // show add button
  const { registerWithProvider } = useContext(HealthContext);
  const [providerAddress, setProviderAddress] = useState('');
  const addProvider = async () => {
    if (!ethers.utils.isAddress(providerAddress)) {
      toast.error('Invalid Address');
    } else {
      const result = await registerWithProvider?.(providerAddress);
      console.log(result);
    }
  };
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
            <label className='block text-black  font-bold md:text-right mb-1 md:mb-0 pr-4'>
              Provider Address
            </label>
          </div>
          <div className='md:w-2/3'>
            <input
              className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
              id='inline-full-name'
              type='text'
              value={providerAddress}
              onChange={(e) => setProviderAddress(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className='md:flex md:items-center mb-6'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'
            onClick={() => addProvider()}
          >
            Join Provider
          </button>
          {/*<button onClick={() => fetchPatient()}>Fetch Patient</button> */}
        </div>
      </form>
    </>
  );
};
export default AddProviderComponent;
