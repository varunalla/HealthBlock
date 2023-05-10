  import React, { FunctionComponent, useContext, useState ,useEffect} from 'react';
  import { HealthContext } from '../../providers/HealthProvider';
  import { AuthContext } from '../../providers/AuthProvider';
  import axios from 'axios';

  const PatientManageMedicalRecords: FunctionComponent<{}> = () => {
    const { user, role, logout } = useContext(AuthContext);
    const { getAllRequestsForPatient,approveMedicalRecordsRequestHealthBlockContract,rejectMedicalRecordsRequestHealthBlockContract, currentAccount} = useContext(HealthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const[medicalRecordRequests,setMedicalRecordRequests]=useState<any>([]);
    const [filterOption, setFilterOption] = useState<string>('all');
    const [showDeclinePopup, setShowDeclinePopup] = useState(false);
    const [selectedFile, setSelectedFile] = useState<undefined | File>(undefined);
    const [showAcceptPopup, setShowAcceptPopup] = useState(false);

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
    const uploadEncryptedFileToS3 = async (file: File | undefined, filename: string, key: string) => {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', filename);
        formData.append('key', key);
        formData.append('patientEmail', user!.email);
        try {
          await axios.post('/uploadFile', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('File uploaded successfully');
        } catch (error) {
          console.error('Failed to upload file:', error);
        }
      }
    };

    const GetAllMedicalRecordRequests = async (patientAddress: string) => {
      try {
        const requests=await getAllRequestsForPatient?.(patientAddress);
        console.log(requests);
        setMedicalRecordRequests(requests);
      } catch (err) {
        console.log("Error while fetching the medical Record Requests",err);
      }
    };

    const approveRequest=async(requestID: string,email:string)=>{
      try{
        if (!selectedFile) {
          console.error("File is undefined.");
          return undefined;
        }

        const patientKeys = await checkPatientKeys(user!.name);
        console.log("doc Email",email)
        const doctorKeys= await checkDoctorKeys(email);
        console.log("Doctor Keys:",doctorKeys);
        console.log("Patient Keys:",patientKeys);

        const response_encrypt = await fetch('/proxy-reencryption/encrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aesKey: user!.name,
          private_key: patientKeys.data.private_key,
          public_key: patientKeys.data.public_key,
          signing_key: patientKeys.data.signing_key
        })
        });
        
        const encryptedData = await response_encrypt.json();

        console.log("encrypt data:", encryptedData);

        const response_reencrypt = await fetch('/proxy-reencryption/reencrypt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            capsule: encryptedData.data.capsule,
            private_key: patientKeys.data.private_key,
            public_key: doctorKeys.data.public_key,
            signing_key: patientKeys.data.signing_key,
          })
          });
          
          const cfrags = await response_reencrypt.json();
          
          console.log("cfrags:", cfrags);
    
          const Buffer = require('buffer').Buffer;
          const encryptedDataBuffer = Buffer.from(JSON.stringify(encryptedData), 'utf-8');
          const cfragsBuffer = Buffer.from(JSON.stringify(cfrags), 'utf-8');
    
          const params_encrypt = {
            bucket: process.env.REACT_APP_BUCKET_ENCRYPT,
            key: `patient_${user!.name}`,
            file: encryptedDataBuffer
          };
          const params_reencrypt = {
            bucket: process.env.REACT_APP_BUCKET_REENCRYPT,
            key: `doctor_${email}`,
            file: cfragsBuffer,
          };
        await approveMedicalRecordsRequestHealthBlockContract?.(requestID)

      const r1 = await fetch('/uploadTos3', {
        method: 'POST',
        body: JSON.stringify(params_encrypt),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("r1", r1);

      const r2 = await fetch('/uploadTos3', {
        method: 'POST',
        body: JSON.stringify(params_reencrypt),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("r2", r2);

      if(currentAccount){
          GetAllMedicalRecordRequests(currentAccount);}
      }catch(err){
        console.log("Error while approving the medical Record Requests",err);
      }
    };
    const rejectRequest=async(requestID: string)=>{
      try{
        await rejectMedicalRecordsRequestHealthBlockContract?.(requestID)
        if(currentAccount){
        GetAllMedicalRecordRequests(currentAccount);}
        alert('Medical record request rejected');
      }catch(err){
        console.log("Error while rejecting the medical Record Requests",err);
      }
    };

    useEffect(()=>{
      if(currentAccount){
      GetAllMedicalRecordRequests(currentAccount);
    }
    },[]) 
  
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files !== null) {
        setSelectedFile(event.target.files[0]);
      }
    };
    const toggleAcceptPopup = () => {
      setShowAcceptPopup(!showAcceptPopup);
    };

    const toggleDeclinePopup = async () => {
      setShowDeclinePopup(!showDeclinePopup);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setFilterOption(event.target.value);
      setCurrentPage(1); // Reset current page to 1 when filter option is changed
    }; 

    return (
      <div>
        <div className='flex flex-col  px-4 lg:px-8 '>
          <div className='bg-gray-100 py-4 px-4 flex items-center justify-between'>
            <h1 className='text-2xl font-bold'>Share Medical Records</h1>
            <div className='relative flex items-center'>
              <label htmlFor='date' className='mr-2 text-sm font-medium'>
                Showing:
              </label>
              <select
                className='block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
                value={filterOption}
                onChange={handleFilterChange}
              >
                <option value='all'>All Requests</option>
                <option value='upcoming'>Pending</option>
                <option value='past'>Confirmed</option>
                <option value='past'>Rejected</option>
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
                        EMAIL ID
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        PUBLIC ADDRESS
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        STATUS
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      ></th>
                    </tr>
                  </thead>

                  {medicalRecordRequests?.map((request:any)=> (
                    <tr key={request.requestId}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{request.docEmail}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{request.doctorAddress}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className={`text-sm ${request.status === 'REJECTED' ? 'text-red-500 font-bold' : request.status === 'CONFIRMED' ? 'text-green-500 font-bold' : 'text-gray-500 font-bold'}`}>{request.status}</div>
                      </td>
                      
                      <td className='px-6 py-4 whitespace-nowrap'>
                      {request.status == "PENDING" && (
                        <div className='text-sm text-gray-900'>
                          <button
                            id='request-btn'
                            className='bg-blue-500 text-white font-bold rounded-md px-4 py-2 ml-2'
                            onClick={toggleAcceptPopup}
                          >
                            Accept
                          </button>
                          <button
                            className='bg-blue-500 text-white font-bold rounded-md px-4 py-2 ml-2'
                            onClick={toggleDeclinePopup}
                          >
                            Decline
                          </button>
                        </div>
                        )}
                        {showDeclinePopup && (
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
                                          You are declining the medical record request to{' '}
                                          <span style={{ fontWeight: 'bold', color: 'blue' }}>
                                            {request.docEmail}
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
                                        id='decline-confirm-btn'
                                        type='button'
                                        className='inline-flex justify-center w-full sm:w-auto rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                                        onClick={() => {
                                          //handleDecline(request.docEmail);
                                          rejectRequest(request.requestId);
                                          toggleDeclinePopup();
                                        }}
                                      >
                                        Confirm
                                      </button>
                                      <button
                                        type='button'
                                        className='inline-flex justify-center w-full sm:w-auto rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5 mt-3 sm:mt-0 sm:ml-3'
                                        onClick={toggleDeclinePopup}
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
                        {showAcceptPopup && (
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

                              <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full max-h-80vh'>
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
                                          You are uploading your medical
                                          records for Doctor{' '}
                                          <span style={{ fontWeight: 'bold', color: 'blue' }}>
                                            {request.docEmail}
                                          </span>
                                        </p>
                                        <div className='mt-2'>
                                          <label htmlFor='file-upload' className='cursor-pointer'>
                                            <p
                                              className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow inline-block'
                                              style={{ width: 'auto' }}
                                            >
                                              Browse
                                            </p>
                                          </label>
                                          {selectedFile && (
                                            <span className='text-sm leading-5 text-gray-500 ml-2'>
                                              {selectedFile.name}
                                            </span>
                                          )}
                                          <input
                                            id='file-upload'
                                            name='file-upload'
                                            type='file'
                                            accept='.pdf,.doc,.docx'
                                            className='sr-only'
                                            onChange={handleFileSelect}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                                  <span className='flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto'>
                                    <div className='flex justify-center'>
                                      <button
                                        id='accept-confirm-btn'
                                        type='button'
                                        className='inline-flex justify-center w-full sm:w-auto rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                                        onClick={() => {
                                          toggleAcceptPopup();
                                          approveRequest(request.requestId, request.docEmail)
                                          uploadEncryptedFileToS3(selectedFile, request.requestId, user!.name)
                                          //handleAccept(request.docEmail);
                                        }}
                                      >
                                        Confirm
                                      </button>
                                      <button
                                        type='button'
                                        className='inline-flex justify-center w-full sm:w-auto rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5 mt-3 sm:mt-0 sm:ml-3'
                                        onClick={toggleAcceptPopup}
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
                  ))}
                </table>
              </div>
            </div>          
          </div>
        </div>
      </div>
    );
  };
  export default PatientManageMedicalRecords;
