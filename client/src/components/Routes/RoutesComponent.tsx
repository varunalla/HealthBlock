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
import ManageMedicalRecords from '../Doctor/ManageMedicalrecords';
import PatientManageMedicalRecords from '../Patient/PatientManageMedicalRecords';
import TopNav from '../TopNav';
import ProtectedRoute, { ProtectedRouteProps } from './ProtectedRoute';
import PatientAppointment from '../Patient/PatientAppointment';
import ScheduleAppointment from '../Patient/ScheduleAppointment';
import UpdateProfile from '../Doctor/UpdateProfile';
import ManageSchedule from '../Doctor/ManageSchedule';
import HCManageDoctors from '../HealthCareProvider/HCManageDoctors';

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
          path='/manageMedicalRecords'
          element={
            <ProtectedRoute {...defaultProtectedRouteProps} outlet={<ManageMedicalRecords />} />
          }
        />
        <Route
          path='/patientManageMedicalRecords'
          element={
            <ProtectedRoute
              {...defaultProtectedRouteProps}
              outlet={<PatientManageMedicalRecords />}
            />
          }
        />
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
        <Route
          path='/patientappointments'
          element={
            <ProtectedRoute {...defaultProtectedRouteProps} outlet={<PatientAppointment />} />
          }
        />

        <Route
          path='/scheduleappointments'
          element={
            <ProtectedRoute {...defaultProtectedRouteProps} outlet={<ScheduleAppointment />} />
          }
        />
        <Route
          path='/update-profile'
          element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<UpdateProfile />} />}
        />
        <Route
          path='/manageschedule'
          element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<ManageSchedule />} />}
        />
        <Route
          path='/manage-doctors-request'
          element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<HCManageDoctors />} />}
        />
      </Routes>
    </>
  );
};
export default RoutesComponent;
