import React, { FunctionComponent, useContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { Dashboard } from '../Dashboard';
import DoctorAppointments from '../Doctor/DoctorAppointments';
import DoctorDashboard from '../Doctor/DoctorDashboard';
import DoctorLanding from '../Doctor/DoctorLanding';
import HCProviderLanding from '../HealthCareProvider/HCProviderLanding';
import HCProviderDashboard from '../HealthCareProvider/HCProviderDashboard';
import PatientDashboard from '../Patient/PatientDashboard';
import PatientLanding from '../Patient/PatientLanding';
import TopNav from '../TopNav';
import ProtectedRoute, { ProtectedRouteProps } from './ProtectedRoute';

const RoutesComponent: FunctionComponent<{}> = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role, user } = useContext(AuthContext);

  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'> = {
    isAuthenticated: !!isLoggedIn,
    authenticationPath: '/',
  };
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/' + role);
    }
  }, [isLoggedIn]);
  return (
    <>
      <TopNav />
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/patientlogin' element={<PatientLanding />} />
        <Route path='/doctorlogin' element={<DoctorLanding />} />
        <Route path='/hcproviderlogin' element={<HCProviderLanding />} />
        <Route
          path='/patient'
          element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<PatientDashboard />} />}
        />
        <Route
          path='/doctor'
          element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<DoctorDashboard />} />}
        />
        <Route path='/provider' element={<Dashboard />} />
        <Route
          path='/doctorappointments'
          element={
            <ProtectedRoute {...defaultProtectedRouteProps} outlet={<DoctorAppointments />} />
          }
        />
        <Route
          path='/hcprovider'
          element={
            <ProtectedRoute {...defaultProtectedRouteProps} outlet={<HCProviderDashboard />} />
          }
        />
      </Routes>
    </>
  );
};
export default RoutesComponent;
