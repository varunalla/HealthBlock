import React, { FunctionComponent, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { HealthContext } from '../../providers/HealthProvider';
import * as CryptoJS from 'crypto-js';
const AWS = require('aws-sdk');

const HCProviderDashboard: FunctionComponent<{}> = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useContext(AuthContext);
  const { handleApproveRequest, handleRejectRequest, verificationRequests, fetchRequests } =
    useContext(HealthContext);
  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION
  });

  const logouthandler = () => {
    logout?.();
    navigate('/hcproviderlogin');
  };
  const approveRequest = async (requestId: number) => {
    try {
      await handleApproveRequest?.(requestId);
    } catch (err) {
      console.log(err);
    }
  };

  const rejectRequest = async (requestId: number) => {
    try {
      await handleRejectRequest?.(requestId);
    } catch (err) {
      console.log(err);
    }
  };

  const decrypt = (data: Uint8Array, key: string): Uint8Array => {
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.lib.WordArray.create(Array.from(data)),
    });
    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return new Uint8Array(decrypted.words);
  };
  

  const downloadFile = async (fileName ?: string) => {
    if (!fileName) {
      throw new Error('File name is required');
    }
  
    try {
      const params = {
        Bucket: process.env.REACT_APP_BUCKET_NAME,
        Key: fileName,
      };
      const { Body } = await s3.getObject(params).promise();
      console.log("File Body ---> ", Body.buffer);
      const decryptedFile = decrypt(new Uint8Array(Body as ArrayBuffer), user!.name);
      console.log("decryptedFile ----> ", decryptedFile.buffer);
      const blob = new Blob([decryptedFile], { type: "application/pdf"});
      console.log("File blob ----> ", blob);
      const url = window.URL.createObjectURL(blob);
      console.log("File download url ---->", url); 
      const link = document.createElement('a');
      console.log("File download link ---->", link);
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.log(err);
    }
  };
  

  useEffect(() => {
    (() => {
      fetchRequests?.();
    })();
  }, []);

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center mt-0'>
        <h5 className='mt-4 mb-1 text-xl font-medium text-gray-900 dark:text-white'>
          {user?.name}
        </h5>
        <span className='mb-4 text-sm text-gray-500 dark:text-gray-400'>{user?.email}</span>
        <button
          className='mb-4 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          onClick={() => logouthandler()}
        >
          Logout
        </button>
      </div>
      <div className='mt-8 w-full max-w-screen-lg mx-auto'>
        <table className='w-full'>
          <thead>
            <tr>
              <th className='px-6 py-3 text-center'>Doctor Name</th>
              <th className='px-6 py-3 text-center'>File Name</th>
              <th className='px-6 py-3 text-center'>Status</th>
              <th className='px-6 py-3 text-center'>Action</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {verificationRequests &&
              verificationRequests.map(
                (
                  request: {
                    doctorName:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                      | React.ReactFragment
                      | React.ReactPortal
                      | null
                      | undefined;
                      fileName:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                      | React.ReactFragment
                      | React.ReactPortal
                      | null
                      | undefined;
                    status: any;
                  },
                  index,
                ) => (
                  <tr key={index}>
                    <td className='px-6 py-4 text-center'>{request.doctorName}</td>
                    <button
                            className='ml-2 px-3 py-1 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                            onClick={() => {
                              if (typeof request.fileName === 'string') {
                                downloadFile(request.fileName);
                              }
                            }}
                          >
                          {request.fileName}
                        </button>
                    <td className='px-6 py-4 text-center'>
                      {request.status == 'approved'
                        ? 'Approved'
                        : request.status == 'rejected'
                        ? 'Rejected'
                        : 'Pending'}
                    </td>
                    <td className='px-6 py-4 text-center'>
                      {request.status == 'pending' && (
                        <>
                          <button
                            className='px-3 py-1 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                            onClick={() => approveRequest(index)}
                          >
                            Approve
                          </button>
                          <button
                            className='ml-2 px-3 py-1 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'
                            onClick={() => rejectRequest(index)}
                          >
                            Reject
                          </button>
                         
                        </>
                      )}
                    </td>
                  </tr>
                ),
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HCProviderDashboard;
