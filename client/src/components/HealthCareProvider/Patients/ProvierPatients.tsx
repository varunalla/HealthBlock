import { FunctionComponent } from 'react';
import PatientRequests from './PatientRequest';
import PatientList from './PatientList';

const ProvierPatients: FunctionComponent<{}> = () => {
  //load the current providers
  // show add button

  return (
    <>
      <PatientRequests />
      <PatientList />
    </>
  );
};
export default ProvierPatients;
