import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { HealthContext } from '../../../providers/HealthProvider';

const ListProviderComponent: FunctionComponent<{}> = () => {
  //load the current providers
  // show add button
  const { fetchPatientProviderRequests } = useContext(HealthContext);
  const [providers, setProviders] = useState<string[]>([]);
  const isValid = (provider: string) => {
    return provider != `0x0000000000000000000000000000000000000000`;
  };
  useEffect(() => {
    (async () => {
      const result = await fetchPatientProviderRequests?.();
      const temp = [];
      if (result) {
        for (let i = 0; i < result.length; i++) {
          if (isValid(result[i])) temp.push(result[i]);
        }
        setProviders(temp);
      }
    })();
  });
  return (
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
                  Provider Address
                </th>
              </tr>
            </thead>

            {providers.map((provider) => (
              <tr key={provider}>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>{provider}</div>
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
};
export default ListProviderComponent;
