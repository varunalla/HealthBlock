import { FunctionComponent, useCallback, useContext, useEffect, useState } from 'react';
import { HealthContext } from '../../../providers/HealthProvider';
import { useAuthFetch } from '../../../hooks/api';

const PatientRequests: FunctionComponent<{}> = () => {
  //load the current patient requests
  // show add button
  const { fetch } = useAuthFetch();
  const {
    fetchProviderPatientRequests,
    approveProviderPatientRequest,
    rejectProviderPatientRequest,
  } = useContext(HealthContext);
  const [patients, setPatients] = useState<string[]>([]);
  const [patientDetails, setPatientDetails] = useState<any[]>([]);
  const isValid = (provider: string) => {
    return provider != `0x0000000000000000000000000000000000000000`;
  };
  useEffect(() => {
    (async () => {
      try {
        const result = await fetchProviderPatientRequests?.();
        const temp = [];
        if (result) {
          for (let i = 0; i < result.length; i++) {
            if (isValid(result[i])) temp.push(result[i]);
          }
        }
        console.log('patient requests', temp);
        setPatients(temp);
      } catch (err) {
        console.log('fetching requests', err);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const patientDetails: any[] = [];
      const promises = patients.map((patient) =>
        (async () => {
          try {
            const response = await fetch(`GET`, `/patients/${patient}`);
            console.log('patient', response);
            const result = {
              address: patient,
              name: response.data.profile[0],
              email: response.data.profile[2],
            };
            patientDetails.push(result);
          } catch (err) {
            console.log('fetching patient details', err);
            patientDetails.push({
              address: patient,
              name: 'Errored',
              email: 'Errored',
            });
          }
        })(),
      );
      await Promise.all(promises);
      console.log(patientDetails);
      setPatientDetails(patientDetails);
    })();
  }, [patients]);
  const acceptPatient = useCallback(async (patient: string) => {
    console.log('Approve ', patient);
    try {
      await approveProviderPatientRequest?.(patient);
      const result = await fetchProviderPatientRequests?.();
      setPatients(result ?? []);
    } catch (err) {
      console.log(err);
    }
  }, []);
  const rejectPatient = useCallback(async (patient: string) => {
    console.log('reject ', patient);
    try {
      await rejectProviderPatientRequest?.(patient);
      const result = await fetchProviderPatientRequests?.();
      setPatients(result ?? []);
    } catch (err) {
      console.log(err);
    }
  }, []);
  return (
    <>
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
                    Patient Address
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Patient Name
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Patient Email
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Approve
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Reject
                  </th>
                </tr>
              </thead>

              {patientDetails.map((patient) => (
                <tr key={patient.address}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>{patient.address}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>{patient.name}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>{patient.email}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      <button
                        id='request-btn'
                        className='bg-blue-500 text-white font-bold rounded-md px-4 py-2 ml-2'
                        onClick={() => acceptPatient(patient.address)}
                      >
                        Accept
                      </button>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      <button
                        id='request-btn'
                        className='bg-blue-500 text-white font-bold rounded-md px-4 py-2 ml-2'
                        onClick={() => rejectPatient(patient.address)}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default PatientRequests;
