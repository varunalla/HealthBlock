import React, { FunctionComponent, useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom'
import { AuthContext } from "../../providers/AuthProvider";
import { Dashboard } from "../Dashboard";
import DoctorDashboard from "../Doctor/DoctorDashboard";
import DoctorLanding from "../Doctor/DoctorLanding";
import PatientDashboard from "../Patient/PatientDashboard";
import PatientLanding from "../Patient/PatientLanding";
import TopNav from "../TopNav";
import ProtectedRoute, { ProtectedRouteProps } from "./ProtectedRoute";

const RoutesComponent: FunctionComponent<{}> = () => {
    const navigate = useNavigate();
    const { isLoggedIn, role, user } = useContext(AuthContext);

    const defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'> = {
        isAuthenticated: !!isLoggedIn,
        authenticationPath: '/',
    };
    useEffect(() => {
        console.log(isLoggedIn, role, user);
        if (isLoggedIn) {
            navigate('/' + role);
        }
    }, [isLoggedIn]);
    return (
        <>
            <TopNav />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/patientlogin" element={<PatientLanding />} />
                <Route path="/doctorlogin" element={<DoctorLanding />} />
                <Route path='/patient' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<PatientDashboard />} />} />
                <Route path='/doctor' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<DoctorDashboard />} />} />
            </Routes>
        </>

    )
}
/*
                <Route path="/doctor" element={<DoctorLanding />} />*/
export default RoutesComponent;


