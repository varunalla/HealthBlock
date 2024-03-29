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
      console.log("req id", requestId);
      console.log("providerid", providerId);
      await handleApproveRequest?.(requestId, providerId);
    } catch (err) {
      console.log(err);
    }
  };

  const rejectRequest = async (requestId: number) => {
    try {
      console.log("req id", requestId);
      console.log("providerid", providerId);
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
      console.log(userinfo!.id)
      if(userinfo!== undefined) {
        const id = userinfo.id
        console.log("id", id)
         setProviderId(id);
         fetchRequests?.(id);
      }
    })();
  }, []);

  return (
    <div className='flex flex-col h-screen'>
      <div className='flex justify-end items-center h-50 pr-11'>
      <div className='ml-auto mr-4'>
        <span className='text-gray-600'>Hello, {user?.name}</span>
        <button className='ml-4 bg-red-500 text-white px-4 py-2 rounded' onClick={() => logouthandler()}>
          Logout
        </button>
      </div>
    </div>
    <div>
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
                            className='mt-4 ml-2 px-3 py-1 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
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
    </div>
  );
};

export default HCProviderDashboard;
