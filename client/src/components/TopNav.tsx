import React, { FunctionComponent, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthConsumer, AuthContext } from '../providers/AuthProvider';
import WalletComponent from './WalletComponent';
const TopNav: FunctionComponent<{}> = () => {
  const { isLoggedIn, role } = useContext(AuthContext);
  return (
    <nav className='bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900'>
      <div className='container flex flex-wrap justify-between items-center mx-auto'>
        <Link className='flex items-center' to='/'>
          <span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>
            HealthBlock
          </span>
        </Link>

        <div className='hidden w-full md:block md:w-auto' id='navbar-default'>
          <ul className='flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700'>
            {!isLoggedIn && (
              <>
                <li>
                  <Link
                    to='/patientlogin'
                    className='block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                    aria-current='page'
                  >
                    Patient
                  </Link>
                </li>
                <li>
                  <Link
                    to='/doctorlogin'
                    className='block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                    aria-current='page'
                  >
                    Doctor
                  </Link>
                </li>
                <li>
                  <Link
                    to='/hcproviderlogin'
                    className='block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                    aria-current='page'
                  >
                    HealthCare Provider
                  </Link>
                </li>
              </>
            )}
            {isLoggedIn && role === 'patient' && (
              <>
                <li>
                  <Link
                    to='/patientManageMedicalRecords'
                    className='block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                    aria-current='page'
                  >
                    Manage Records
                  </Link>
                </li>
                <li>
                  <Link
                    to='/patient'
                    className='block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                    aria-current='page'
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to='/patient/provider'
                    className='block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                    aria-current='page'
                  >
                    Patient Provider
                  </Link>
                </li>
              </>
            )}
            {isLoggedIn && role === 'doctor' && (
              <>
                <li>
                  <Link
                    to='/doctor'
                    className='block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                    aria-current='page'
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  {' '}
                  <Link
                    to='/manageMedicalRecords'
                    className='block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                    aria-current='page'
                  >
                    Manage Medical Records
                  </Link>
                </li>
              </>
            )}
            {isLoggedIn && role === 'hcprovider' && (
              <>
                <li>
                  <Link
                    to='/hcprovider'
                    className='block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                    aria-current='page'
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to='/hcprovider/patients'
                    className='block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                    aria-current='page'
                  >
                    Patients
                  </Link>
                </li>
              </>
            )}
            <li>
              <WalletComponent />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default TopNav;
