import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { HealthContext } from '../../../providers/HealthProvider';
import { useAuthFetch } from '../../../hooks/api';

const PatientList: FunctionComponent<{}> = () => {
  //load the current patients
  // show add button
  const { fetch } = useAuthFetch();
  const { fetchPatients } = useContext(HealthContext);
  const [patients, setPatients] = useState<string[]>([]);
  const [patientDetails, setPatientDetails] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const result = await fetchPatients?.();
        setPatients(result ?? []);
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
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default PatientList;
