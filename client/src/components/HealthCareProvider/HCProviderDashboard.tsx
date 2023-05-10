import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { HealthContext } from '../../providers/HealthProvider';

const HCProviderDashboard: FunctionComponent<{}> = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useContext(AuthContext);
  const [providerId, setProviderId] = useState<any>('');
  const { handleApproveRequest, handleRejectRequest, verificationRequests, fetchRequests, fetchHealthCareProviderContract } =
    useContext(HealthContext);

  const logouthandler = () => {
    logout?.();
    navigate('/hcproviderlogin');
  };
  const approveRequest = async (requestId: number) => {
    try {
      await handleApproveRequest?.(requestId, providerId);
    } catch (err) {
      console.log(err);
    }
  };

  const rejectRequest = async (requestId: number) => {
    try {
      await handleRejectRequest?.(requestId, providerId);
    } catch (err) {
      console.log(err);
    }
  };

  const checkDoctorKeys = async (name: string) => {
    try {
      const body = {
        bucket: process.env.REACT_APP_BUCKET_KEYS!,
        key: `doctor_${name}`,
      };
      let resp = await fetch('/s3download', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
      const keys:any = await resp.json();
      return keys.data;
    } catch (err: any) {
      if (err.code === 'NotFound') {
          console.log("Keys not found")
          return null
      } else {
        throw err;
      }
    }
  };

  const checkHCProviderKeys = async (name: string) => {
    try {
      const body = {
        bucket: process.env.REACT_APP_BUCKET_KEYS!,
        key: `hcprovider_${name}`,
      };
      let resp = await fetch('/s3download', {
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
        key: `doctor_${name}`,
      };
      let resp = await fetch('/s3download', {
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

  const checkReencryptRes = async (name: string) => {
    try {
      const body = {
        bucket: process.env.REACT_APP_BUCKET_REENCRYPT,
        key: `hcprovider_${name}`,
      };
      let resp = await fetch('/s3download', {
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

  const downloadFile = async (filename?: string, doctorname?: string) => {
    try {
      if (!filename) {
        throw new Error('File name is required');
      }
    
      if (!doctorname) {
        throw new Error('Doctor name is required');
      }

      const docKeys = await checkDoctorKeys(doctorname);
      console.log("Doctor keys:")
      console.log(docKeys)

      const hcProviderKeys = await checkHCProviderKeys(user!.name);
      console.log("HCProvider keys")
      console.log(hcProviderKeys)
      
      const encryptedData =await checkEncryptRes(doctorname);
      console.log("Encrypt Response Data")
      console.log(encryptedData)
      
      const reencryptedData=await checkReencryptRes(user!.name);
      console.log("Reencrypt Response Data")
      console.log(reencryptedData)

      const response_decryptReencrypt = await fetch('/proxy-reencryption/decryptReencrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          private_key: hcProviderKeys.data.private_key,
          public_key: docKeys.data.public_key,
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
      let resp = await fetch('/download', {
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
    (async () => {
      const userinfo =  await fetchHealthCareProviderContract?.();
      if(userinfo!== undefined) {
        const id = await userinfo.id
        setProviderId(id);
        fetchRequests?.(id);
      }
    })();
  }, []);
  const _renderManageDoctorsSection = () => {
    return (
      <div className='bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg shadow-lg p-6 flex justify-center w-400 h-300"'>
        <button
          onClick={() => navigate('/manage-doctors-request')}
          className='bg-white text-gray-800 py-2 px-6 rounded-full font-medium'
        >
          Appointments
        </button>
      </div>
    );
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      {_renderManageDoctorsSection()}

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
                              if (typeof request.fileName === 'string' && typeof request.doctorName === 'string') {
                                downloadFile(request.fileName, request.doctorName);
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
