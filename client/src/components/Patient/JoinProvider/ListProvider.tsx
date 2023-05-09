import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { HealthContext } from '../../../providers/HealthProvider';
import { useAuthFetch } from '../../../hooks/api';

const CustomProviderList: FunctionComponent<{ name: string; providers: string[] }> = ({
  name,
  providers,
}) => {
  //load the current patients
  // show add button
  const { fetch } = useAuthFetch();

  const [providerDetails, setProviderDetails] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      console.log(providers);
      const providerDetails: any[] = [];
      const promises = providers.map((provider) =>
        (async () => {
          try {
            const response = await fetch(`GET`, `/providers/${provider}`);
            console.log('provider', response);
            const result = {
              address: provider,
              name: response.data.profile[0],
              email: response.data.profile[1],
            };
            providerDetails.push(result);
          } catch (err) {
            console.log('fetching provider details', err);
            providerDetails.push({
              address: provider,
              name: 'Errored',
              email: 'Errored',
            });
          }
        })(),
      );
      await Promise.all(promises);
      console.log(providerDetails);
      setProviderDetails(providerDetails);
    })();
  }, [providers]);
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
                    {name}
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Provider Name
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Provider Email
                  </th>
                </tr>
              </thead>

              {providerDetails.map((provider) => (
                <tr key={provider}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>{provider.address}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>{provider.name}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>{provider.email}</div>
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
export default CustomProviderList;
