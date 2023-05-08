import { FunctionComponent, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthFetch } from '../../hooks/api';
import { AuthContext } from '../../providers/AuthProvider';
import JoinProvider from './JoinProvider/JoinProvider';

const PatientProvider: FunctionComponent<{}> = () => {
  const navigate = useNavigate();
  const { fetch } = useAuthFetch();
  const { user, role, logout } = useContext(AuthContext);
  const logouthandler = async () => {
    logout?.();
    navigate('/patientlogin');
  };
  return (
    <>
      <JoinProvider />
    </>
  );
};

export default PatientProvider;
