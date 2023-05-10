import React, { FunctionComponent, useContext, useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { HealthContext } from '../../providers/HealthProvider';
import AWS from 'aws-sdk';
import axios from 'axios';
import { AuthContext } from '../../providers/AuthProvider';
import { useAuthFetch } from '../../hooks/api';

interface AppointmentDetails {
  doctor_email: string;
  patient_email: string;
  appointment_id: string;
  patient_name: string;
  doctor_address: string;
  patient_address: string;
  created_at: string;
  appointment_time: string;
  appointment_status: string;
}

const ManageMedicalRecords: FunctionComponent<{}> = () => {
  const { user, role, logout } = useContext(AuthContext);
  
  const [confirmedAppointmentData, setConfirmedAppointmentData] = useState<AppointmentDetails[]>(
    [],
  );
  const[foundFile,setFoundFile]=useState<Boolean>(false);
  const { requestMedicalRecordHealthBlockContract } = useContext(HealthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOption, setFilterOption] = useState<string>('all');
  const [showRequestPopup, setShowRequestPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState<undefined | File>(undefined);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  const checkDoctorKeys = async (email: string) => {
    try {
      const body = {
        bucket: process.env.REACT_APP_BUCKET_KEYS!,
        key: `doctor_${email}`,
      };
      let resp = await fetch('/downloadKeysFroms3', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
      const keys:any = await resp.json();
      return keys.data;
    } catch (err: any) {
      if (err.code === 'NotFound') {
          console.log("No keys found")
          return null;
      } else {
        throw err;
      }
    }
  };
  const checkPatientKeys = async (name: string) => {
    try {
      const body = {
        bucket: process.env.REACT_APP_BUCKET_KEYS!,
        key: `patient_${name}`,
      };
      let resp = await fetch('/downloadKeysFroms3', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
      const keys:any = await resp.json();
      return keys.data;
    } catch (err: any) {
      if (err.code === 'NotFound') {
        console.log("No keys found")
        return null;
      } else {
        throw err;
      }
    }
  };

  const checkEncryptRes = async (name: string) => {
    try {
      const body = {
        bucket: process.env.REACT_APP_BUCKET_ENCRYPT!,
        key: `patient_${name}`,
      };
      let resp = await fetch('downloadKeysFroms3', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
      const encryptRes:any = await resp.json();
      return encryptRes.data;
    } catch (err: any) {
      if (err.code === 'NotFound') {
        console.log("No keys found")
        return null;
      } else {
        throw err;
      }
    }
  };

  const checkReencryptRes = async (Email: string) => {
    try {
      const body = {
        bucket: process.env.REACT_APP_BUCKET_REENCRYPT,
        key: `doctor_${Email}`,
      };
      let resp = await fetch('/downloadKeysFroms3', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
      const encryptRes:any = await resp.json();
      return encryptRes.data;
    } catch (err: any) {
      if (err.code === 'NotFound') {
        console.log("No keys found")
        return null;
      } else {
        throw err;
      }
    }
  };
  const checkMedicalRecord = async (docEmail: string,patientEmail:string,patientName:string) => {
    try {
      const body = {
        bucket: process.env.REACT_APP_BUCKET_RECORDS,
        key: `${docEmail}_${patientEmail}`,
      };
      let resp = await fetch('/downloadFroms3', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
      const medicalRecords = await resp.json();
      console.log("medical Records:",medicalRecords)
      await downloadFile(`${docEmail}${"_"}${patientEmail}`,patientName)
     
     // return medicalRecords.data;
    } catch (err: any) {
      if (err.code === 'NotFound') {
       
        console.log("No Medical Record found")
        return null;
      } else {
       
        throw err;
      }
    }
  };
  const downloadFile = async (filename?: string, patientName?: string) => {
    try {
      console.log("File Name:",filename);
      if (!filename) {
        throw new Error('File name is required');
      }
    
      if (!patientName) {
        throw new Error('Patient name is required');
      }

      const doctorKeys = await checkDoctorKeys(user!.email);
      console.log("Doctor keys:")
      console.log(doctorKeys)

      const patientKeys = await checkPatientKeys(patientName);
      console.log("Patient keys")
      console.log(patientKeys)
      
      const encryptedData =await checkEncryptRes(patientName);
      console.log("Encrypt Response Data")
      console.log(encryptedData)
      
      const reencryptedData=await checkReencryptRes(user!.email);
      console.log("Reencrypt Response Data")
      console.log(reencryptedData)

      const response_decryptReencrypt = await fetch('/proxy-reencryption/decryptReencrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          private_key: doctorKeys.data.private_key,
          public_key: patientKeys.data.public_key,
          capsule: encryptedData.data.capsule,
          ciphertext: encryptedData.data.ciphertext,
          cfrags: reencryptedData.data.cfrags
        })
      });
      
      const cleartext = await response_decryptReencrypt.json();
      console.log("cleartext:",cleartext)
      console.log("cleartext.data:",cleartext.data)
      
      const body = {
        fileName: filename,
        key: cleartext.data,
      };
      let resp = await fetch('/downloadFile', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });

      const buffer = await resp.arrayBuffer();
      const blob = new Blob([buffer], { type: 'application/pdf' });
      console.log("blob", buffer)
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getConfirmedAppointment();
  }, []);
  const getConfirmedAppointment = async () => {
    const { fetch } = useAuthFetch();
    let resp = await fetch('GET', '/confirmedAppointments/' + user?.email);
    if (resp && resp.data && resp.data.result) {
      setConfirmedAppointmentData(resp.data.result);
    } else {
      setConfirmedAppointmentData([]);
    }
  };

  const handleMedicalRecordRequest = async (
    patientAddress: string,
    patientName: string,
    docEmail: string,
    patientEmail: string,
  ) => {
    try {      
      await requestMedicalRecordHealthBlockContract?.(
        patientAddress,
        docEmail,
        patientName,
        patientEmail,
      );
      alert('Medical record request sent successfully');
    } catch (err) {
      console.log(err);
    }
  };
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      setSelectedFile(event.target.files[0]);
    }
  };
  const toggleUploadPopup = () => {
    setShowUploadPopup(!showUploadPopup);
  };

  const toggleRequestPopup = async () => {
    setShowRequestPopup(!showRequestPopup);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOption(event.target.value);
    setCurrentPage(1); 
  };

  return (
    <div>
      <div className='flex flex-col  px-4 lg:px-8 '>
        <div className='bg-gray-100 py-4 px-4 flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Share & Request Medical Records</h1>
          <div className='relative flex items-center'>
            <label htmlFor='date' className='mr-2 text-sm font-medium'>
              Showing:
            </label>
            <select
              className='block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
              value={filterOption}
              onChange={handleFilterChange}
            >
              <option value='all'>All Appointments</option>
              <option value='upcoming'>Upcoming Appointments</option>
              <option value='past'>Past Appointments</option>
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <svg
                className='fill-current h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
              </svg>
            </div>
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
                      File
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    ></th>
                  </tr>
                </thead>

                {confirmedAppointmentData.map((appointment) => {
                 
              
                  return (
                  <tr key={appointment.appointment_id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{appointment.patient_name}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{appointment.patient_email}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{appointment.created_at}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                    <button
                          id='request-btn'
                          className='bg-blue-500 text-white font-bold rounded-md px-4 py-2 ml-2'
                          onClick={() =>checkMedicalRecord(user!.email,appointment.patient_email,appointment.patient_name)}
                        >
                          Download
                        </button>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        <button
                          id='request-btn'
                          className='bg-blue-500 text-white font-bold rounded-md px-4 py-2 ml-2'
                          onClick={toggleRequestPopup}
                        >
                          Request
                        </button>
                        
                      </div>
                      {showRequestPopup && (
                        <div className='fixed z-10 inset-0 overflow-y-auto'>
                          <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                            <div className='fixed inset-0 transition-opacity'>
                              <div className='absolute inset-0 bg-gray-500 opacity-30'></div>
                            </div>

                            <span
                              className='hidden sm:inline-block sm:align-middle sm:h-screen'
                              aria-hidden='true'
                            >
                              &#8203;
                            </span>

                            <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
                              <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                                <div className='sm:flex sm:items-start'>
                                  <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                                    <h3
                                      className='text-lg leading-6 font-medium text-gray-900'
                                      id='modal-title'
                                    >
                                      Attention
                                      <span
                                        className='text-red-500'
                                        aria-label='Warning'
                                        role='img'
                                      >
                                        ⚠️
                                      </span>
                                    </h3>
                                    <div className='mt-2'>
                                      <p className='text-sm leading-5 text-gray-500'>
                                        You are requesting medical records from{' '}
                                        <span style={{ fontWeight: 'bold', color: 'blue' }}>
                                          {appointment.patient_name}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                                <span className='flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto'>
                                  <div className='flex justify-center'>
                                    <button
                                      id='confirm-btn'
                                      type='button'
                                      className='inline-flex justify-center w-full sm:w-auto rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                                      onClick={() => {
                                        toggleRequestPopup();
                                        //handleRequest(appointment.patient_email);
                                        handleMedicalRecordRequest(
                                          appointment.patient_address,
                                          appointment.doctor_email,
                                          appointment.patient_name,
                                          appointment.patient_email,
                                        );
                                      }}
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      type='button'
                                      className='inline-flex justify-center w-full sm:w-auto rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5 mt-3 sm:mt-0 sm:ml-3'
                                      onClick={toggleRequestPopup}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                
                )})}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageMedicalRecords;
