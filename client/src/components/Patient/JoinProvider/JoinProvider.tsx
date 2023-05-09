import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { HealthContext } from '../../../providers/HealthProvider';
import AddProvider from './AddProvider';
import CustomProviderList from './ListProvider';

const JoinProviderComponent: FunctionComponent<{}> = () => {
  //load the current providers
  // show add button
  const { fetchProviders, fetchPatientProviderRequests } = useContext(HealthContext);
  const [providers, setProviders] = useState<string[]>([]);
  const [providersRequests, setProvidersRequests] = useState<string[]>([]);

  const isValid = (provider: string) => {
    return provider != `0x0000000000000000000000000000000000000000`;
  };

  useEffect(() => {
    (async () => {
      try {
        const result = await fetchProviders?.();
        setProviders(result ?? []);
      } catch (err) {
        console.log('fetching requests', err);
      }
    })();
    (async () => {
      const result = await fetchPatientProviderRequests?.();
      const temp = [];
      if (result) {
        for (let i = 0; i < result.length; i++) {
          if (isValid(result[i])) temp.push(result[i]);
        }
        setProvidersRequests(temp);
      }
    })();
  }, []);
  return (
    <>
      <CustomProviderList name='Provider Requests' providers={providersRequests} />
      <AddProvider />
      <CustomProviderList name='My Provider Address' providers={providers} />
    </>
  );
};
export default JoinProviderComponent;
