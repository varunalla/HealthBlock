import React, { FunctionComponent, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { HealthContext } from '../../providers/HealthProvider';

const HCDoctorRequest: FunctionComponent<{}> = () => {
  const { fetchDocToProviderRequests, reqArr, updateProfile } = useContext(HealthContext);
  useEffect(() => {
    fetchDocToProviderRequests?.('0xb3cc507e752dcc3da1cef955b58e97ae77160103');
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
  console.log('reqArr-->', reqArr);

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
                    Doctor Name
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Doctor Address
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
                {reqArr &&
                  reqArr.length > 0 &&
                  reqArr.map((req) => (
                    <tr>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{req.doctorName}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{req.doctor}</div>
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
                                // onClick={() => }
                              >
                                Reject
                              </button>
                              <div className='w-4'></div>
                              <button
                                className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded'
                                onClick={() =>
                                  updateProfile?.(
                                    '0xb3cc507e752dcc3da1cef955b58e97ae77160103',
                                    '0xEE619586e0826CA2F00772701eADc2065E5D5A47',
                                    'confirm',
                                  )
                                }
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
export default HCDoctorRequest;
