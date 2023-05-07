import React, { FunctionComponent, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { HealthContext } from '../../providers/HealthProvider';

const HCProviderDashboard: FunctionComponent<{}> = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useContext(AuthContext);
  const { handleApproveRequest, handleRejectRequest, verificationRequests, fetchRequests } =
    useContext(HealthContext);
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

  useEffect(() => {
    (() => {
      fetchRequests?.();
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
              <th className='px-6 py-3 text-center'>Credentials Hash</th>
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
                    credentialsHash:
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
                    <td className='px-6 py-4 text-center'>{request.credentialsHash}</td>
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
