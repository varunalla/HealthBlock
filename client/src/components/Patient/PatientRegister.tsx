import { useContractFunction } from "@usedapp/core";
import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import React, { FunctionComponent, useEffect, useState } from "react";
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import HealthBlock from '../../contracts/HealthBlock.json';
import { useContractCall } from "@usedapp/core";


const PatientRegister: FunctionComponent<{}> = ({ }) => {

    const [name, setName] = useState<string>("");
    const [age, setAge] = useState<number>(0);
    const [email, setEmail] = useState<string>("");

    const healthInterface = new utils.Interface(HealthBlock.abi);
    const healthContractAddress = '0xDC060657Fc2bD456Ed640c2d61A8b7748e52aD3A';
    const contract = new Contract(healthContractAddress, healthInterface)
    const { state, send } = useContractFunction(contract, 'registerPatient', { gasLimitBufferPercentage: 99, });
    const { state: newstate, send: fetch } = useContractFunction(contract, 'getPatientInfo', { gasLimitBufferPercentage: 99, });
    const getUser = () => {
        /*   const [count]: any = useContractCall({
               abi: healthInterface,
               address: healthContractAddress,
               method: "getPatientInfo",
               args: [],
           }) ?? [];
           console.log(count);*/
    }
    const [count]: any = useContractCall({
        abi: healthInterface,
        address: healthContractAddress,
        method: "getPatientInfo",
        args: [],
    }) ?? [];
    useEffect(() => {
        console.log('status: ---------- ', state.status);
    }, [state]);
    const registerPatient = async () => {
        console.log(name, age, email);
        send(name, age, email).then((t) => {
            console.log(t);
        }).catch((err) => {
            console.error(err);
        });
    }
    useEffect(() => {
        console.log(count, '-------count----------')
    }, [count]);
    const checkPatient = async () => {
        console.log(count);
        setEmail(count);
    }
    return (
        <div className="flex items-center justify-center h-screen">

            <div>status {state.status}</div>
            <div>state new {newstate.status} </div>
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
                    <button onClick={() => getUser()}>Get Patient</button>
                </div>
            </form>
        </div>)
}

export default PatientRegister