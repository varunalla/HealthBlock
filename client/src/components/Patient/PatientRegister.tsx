import { useContractFunction } from "@usedapp/core";
import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import React, { FunctionComponent, useState } from "react";
import HealthBlock from '../../contracts/HealthBlock.json';

const PatientRegister: FunctionComponent<{}> = ({ }) => {
    const [name, setName] = useState<string>("");
    const [age, setAge] = useState<number>(0);
    const [email, setEmail] = useState<string>("");
    const healthInterface = new utils.Interface(HealthBlock.abi);
    const healthContractAddress = '0xD856665CAb728cd2C5Cdc99E0D16d2CBe7Ff8399';
    const contract = new Contract(healthContractAddress, healthInterface)
    const { state, send } = useContractFunction(contract, 'registerPatient', { transactionName: 'Wrap' })

    const registerPatient = () => {
        console.log(name, age, email);
        send(name, age, email);
    }
    return (
        <div className="flex items-center justify-center h-screen">
            <form className="w-full max-w-sm" onSubmit={e => e.preventDefault()}>
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
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
                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
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
                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                            Email
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="email" value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)} />
                    </div>
                </div>
                <div className="md:flex md:items-center mb-6">
                    <button onClick={() => registerPatient()}>Register Patient</button>
                </div>
            </form>
        </div>)
}

export default PatientRegister