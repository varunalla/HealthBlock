
import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { HealthContext } from '../../providers/HealthProvider';


const PatientRegister: FunctionComponent<{}> = ({ }) => {
    const { currentAccount, healthBlockContract, registerHealthBlockContract, fetchPatientContract } = useContext(HealthContext);
    const [name, setName] = useState<string>("varun");
    const [age, setAge] = useState<number>(32);
    const [email, setEmail] = useState<string>("abc@abc.com");
    const registerPatient = async () => {
        console.log(name, age, email);
        console.log(registerHealthBlockContract);
        try {

            await registerHealthBlockContract?.(name, age, email);
        }
        catch (err) {
            console.log(err);
        }
    }
    const fetchPatient = async () => {
        console.log(name, age, email);
        console.log(fetchPatientContract);
        try {
            await fetchPatientContract?.();
        }
        catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        healthBlockContract?.();
    }, []);
    return (




        <form className="w-full max-w-sm" onSubmit={e => e.preventDefault()}>
            <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                    <label className="block text-white font-bold md:text-right mb-1 md:mb-0 pr-4">
                        Full Name
                    </label>
                </div>
                <div className="md:w-2/3">
                    <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" value={name}
                        onChange={(e) => setName(e.currentTarget.value)} />
                </div>
            </div>
            <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                    <label className="block text-white  font-bold md:text-right mb-1 md:mb-0 pr-4">
                        Age
                    </label>
                </div>
                <div className="md:w-2/3">
                    <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="number" value={age}
                        onChange={(e) => e.currentTarget.value === '' ? setAge(0) : setAge(parseInt(e.currentTarget.value))} />
                </div>
            </div>
            <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                    <label className="block text-white  font-bold md:text-right mb-1 md:mb-0 pr-4">
                        Email
                    </label>
                </div>
                <div className="md:w-2/3">
                    <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="email" value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)} />
                </div>
            </div>
            <div className="md:flex md:items-center mb-6">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={() => registerPatient()}>Register Patient</button>
                {/*<button onClick={() => fetchPatient()}>Fetch Patient</button> */}
            </div>
        </form>
    )
}

export default PatientRegister