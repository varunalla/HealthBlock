import React, { FunctionComponent } from "react";
import { Routes, Route } from 'react-router-dom'
import DoctorLanding from "../Doctor/DoctorLanding";
import PatientLanding from "../Patient/PatientLanding";
import TopNav from "../TopNav";

const RoutesComponent: FunctionComponent<{}> = () => {
    return (
        <>
            <TopNav />
            <Routes>
                <Route path="/" element={<PatientLanding />} />
                <Route path="/doctor" element={<DoctorLanding />} />
            </Routes>
        </>

    )
}

export default RoutesComponent;


