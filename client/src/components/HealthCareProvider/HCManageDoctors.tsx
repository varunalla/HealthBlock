import React, { FunctionComponent, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { HealthContext } from '../../providers/HealthProvider';

const HCManageDoctors: FunctionComponent<{}> = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useContext(AuthContext);

  const {
    handleApproveRequest,
    handleRejectRequest,
    verificationRequests,
    fetchRequests,
    fetchAllDoctors,
    doctorList,
    doctorToProviderReqList,
    fetchAllDoctorToProviderRequests,
    updateProfile,
    currentAccount,
  } = useContext(HealthContext);
  useEffect(() => {
    fetchAllDoctorToProviderRequests?.('0xb3cc507e752dcc3da1cef955b58e97ae77160103');
  }, []);

  const getStatusColor = (status: String) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-200';
      case 'reject':
        return 'bg-red-200';
      default:
        return '';
    }
  };
  return (
    <div>
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
                    Address
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {doctorToProviderReqList &&
                  doctorToProviderReqList.length > 0 &&
                  doctorToProviderReqList.map((req) => (
                    <tr>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{req.name}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{req.address}</div>
                      </td>

                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            req.status,
                          )}`}
                        >
                          {req.status == 'pending' ? (
                            <div className='flex justify-between'>
                              <button
                                className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded'
                                onClick={() => {
                                  if (currentAccount) {
                                    updateProfile?.(currentAccount, req.address, 'rejected');
                                  }
                                }}
                              >
                                Reject
                              </button>
                              <div className='w-4'></div>
                              <button
                                className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded'
                                onClick={() => {
                                  if (currentAccount) {
                                    updateProfile?.(currentAccount, req.address, 'confirmed');
                                  }
                                }}
                                //updateStatus('confirmed', appointment.appointment_id)
                              >
                                Confirm
                              </button>
                            </div>
                          ) : (
                            <div>{req.status}</div>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HCManageDoctors;
