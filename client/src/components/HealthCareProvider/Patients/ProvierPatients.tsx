import { FunctionComponent } from 'react';
import PatientRequests from './PatientRequest';
import PatientList from './PatientList';

const ProvierPatients: FunctionComponent<{}> = () => {
  //load the current providers
  // show add button

  return (
    <>
      <h1>Patient Requests</h1>
      <PatientRequests />
      <h1>My Patients</h1>
      <PatientList />
    </>
  );
};
export default ProvierPatients;
