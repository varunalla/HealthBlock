import { ethers } from "ethers";
import React, { useState } from "react";

import { healthBlockABI, healthBlockAddress } from "../config/constants";
import Web3Modal from 'web3modal';
import { HealthBlock__factory } from '../contracts/factories/HealthBlock__factory';
import { HealthBlock } from '../contracts/HealthBlock';

interface HealthAppContextInterface {
    checkIfWalletIsConnected?: () => Promise<void>,
    connectWallet?: () => Promise<void>,
    healthBlockContract?: () => Promise<void>,
    registerHealthBlockContract?: (name: string, age: number, email: string) => Promise<void>,
    registerDoctorHealthBlockContract?: (name: string, age: number, email: string, specialization: string) => Promise<void>,
    registerHCProviderHealthBlockContract?: (name: string, email: string, address: string, phone: string) => Promise<void>,
    fetchPatientContract?: () => Promise<void>,
    fetchPatientInfoContract?: (address: string) => Promise<void>,
    currentAccount?: string
}

const fetchContract = (signerOrProvider: ethers.Signer | ethers.providers.Provider) => HealthBlock__factory.connect(healthBlockAddress, signerOrProvider);


export const HealthContext = React.createContext<HealthAppContextInterface>({});

interface Props {
    children?: React.ReactNode
}

export const HealthProvider: React.FC<Props> = ({ children, ...props }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [error, setError] = useState('');

    //fetch metamask accounts
    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) return setError("Please Install Metamask");
        const account = await window.ethereum.request?.({ method: "eth_accounts" });
        if (account?.length) {
            setCurrentAccount(account[0]);
            console.log(account[0]);
        }
        else {
            console.log("error")
            return setError("Please Install Metamask& connect, reload");
        }
    }
    //connect metamask wallet
    const connectWallet = async () => {
        if (!window.ethereum) return setError("Please Install Metamask");
        const account = await window.ethereum.request?.({ method: "eth_requestAccounts" });
        setCurrentAccount(account[0]);
    }
    //connect contract 
    const healthBlockContract = async () => {
        try {
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = await fetchContract(signer);
            console.log(contract);

        }
        catch (err) {
            setError("Error Loading Health Contract")
        }
    }
    //connect contract 
    const registerHealthBlockContract = async (name: string, age: number, email: string) => {
        try {
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            console.log(connection);
            const provider = new ethers.providers.Web3Provider(connection);
            console.log(provider);
            const signer = provider.getSigner();
            const contract: HealthBlock = await fetchContract(signer);

            console.log(contract);
            const register = await contract.registerPatient(name, age, email);
            register.wait();
            console.log(register);
        }
        catch (err) {
            console.log(err)
            setError("Error Loading Health Contract")
        }
    }
    const registerDoctorHealthBlockContract = async (name: string, age: number, email: string, specialization: string) => {
        try {
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            console.log(connection);
            const provider = new ethers.providers.Web3Provider(connection);
            console.log(provider);
            const signer = provider.getSigner();
            const contract: HealthBlock = await fetchContract(signer);

            console.log(contract);
            const register = await contract.registerDoctor(name, age, email, specialization);
            register.wait();
            console.log(register);
        }
        catch (err) {
            console.log(err)
            setError("Error Loading Health Contract")
        }
    }

    const registerHCProviderHealthBlockContract = async (name: string, email: string, address: string, phone: string) => {
        try {
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            console.log(connection);
            const provider = new ethers.providers.Web3Provider(connection);
            console.log(provider);
            const signer = provider.getSigner();
            const contract: HealthBlock = await fetchContract(signer);

            console.log(contract);
            const register = await contract.registerHCProvider(name, email, address, phone);
            register.wait();
            console.log(register);
        }
        catch (err) {
            console.log(err)
            setError("Error Loading Health Contract")
        }
    }
    const fetchPatientContract = async () => {
        try {
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            console.log(connection);
            const provider = new ethers.providers.Web3Provider(connection);
            console.log(provider);
            const signer = provider.getSigner();
            const contract: HealthBlock = await fetchContract(signer);
            console.log(contract);
            const info = await contract.getPatientInfo();
            console.log(info);
        }
        catch (err) {
            console.log(err);
            setError("Error Fetching User Information");
        }
    }
    const fetchPatientInfoContract = async (address: string) => {
        try {
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            console.log(connection);
            const provider = new ethers.providers.Web3Provider(connection);
            console.log(provider);
            const signer = provider.getSigner();
            const contract: HealthBlock = await fetchContract(signer);
            console.log(contract);
            const info = await contract.getPatientInfoAll(address);
            console.log(info);
        }
        catch (err) {
            console.log(err);
            setError("Error Fetching User Information");
        }
    }
    return (<HealthContext.Provider value={{ checkIfWalletIsConnected, connectWallet, currentAccount, healthBlockContract, registerHealthBlockContract, fetchPatientContract, fetchPatientInfoContract, registerDoctorHealthBlockContract, registerHCProviderHealthBlockContract}}>{children}</HealthContext.Provider>)
}