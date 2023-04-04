import { ethers } from "ethers";
import React, { useState } from "react";

import { healthBlockABI, healthBlockAddress } from "../config/constants";
import Web3Modal from 'web3modal';
import { HealthBlock__factory } from '../contracts/factories/HealthBlock__factory';
import { HealthBlock } from '../contracts/HealthBlock';

interface Request {
    doctor: string;
    doctorName: string;
    credentialsHash: string;
    approved: boolean;
 }

interface HealthAppContextInterface {
    checkIfWalletIsConnected?: () => Promise<void>,
    connectWallet?: () => Promise<void>,
    healthBlockContract?: () => Promise<void>,
    registerHealthBlockContract?: (name: string, age: number, email: string) => Promise<void>,
    registerDoctorHealthBlockContract?: (name: string, age: number, email: string, specialization: string) => Promise<void>,
    registerHCProviderHealthBlockContract?: (name: string, email: string, address: string, phone: string) => Promise<void>,
    handleRaiseRequest?:(doctorName: string, file: File | null) => Promise<void>,
    handleApproveRequest?: (requestId: number) => Promise<void>,
    handleRejectRequest?: (requestId: number) => Promise<void>,
    handleVerifyDoctor?:() => Promise<void>,
    fetchPatientContract?: () => Promise<void>,
    fetchPatientInfoContract?: (address: string) => Promise<void>,
    fetchRequests?:()  => Promise<void>,
    currentAccount?: string
    verificationRequests?: Request[]
}

const fetchContract = (signerOrProvider: ethers.Signer | ethers.providers.Provider) => HealthBlock__factory.connect(healthBlockAddress, signerOrProvider);

export const HealthContext = React.createContext<HealthAppContextInterface>({});

interface Props {
    children?: React.ReactNode
}

export const HealthProvider: React.FC<Props> = ({ children, ...props }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [error, setError] = useState('');
    const [verificationRequests, setVerificationRequests] = useState<Request[]>([]);
    const [doctorName, setDoctorName] = useState("");
    const [file, setFile] = useState<File | null>(null);

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

    const handleRaiseRequest = async (doctorName: string, file: File | null) => {
        if (!file) return;
        console.log("doctor name", doctorName)
        const credentialsHash: string = "3423dg43";
        console.log("credentialsHash", credentialsHash)
        //const credentialsHash: Promise<string>  = getFileHash(file);
        setDoctorName(doctorName);
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = await fetchContract(signer);
        
        const tx = await contract.raiseRequest(doctorName, credentialsHash);
        await tx.wait();
        setDoctorName("");
        setFile(null);
        fetchRequests();
    };

    const handleApproveRequest = async (requestId: number) => {
        try {
          const web3modal = new Web3Modal();
          const connection = await web3modal.connect();
          const provider = new ethers.providers.Web3Provider(connection);
          const signer = provider.getSigner();
          const contract = await fetchContract(signer);
          const tx = await contract.approveRequest(requestId);
          await tx.wait();
          fetchRequests();
        } catch (error) {
          console.error(error);
        }
    };

    const handleRejectRequest = async (requestId: number) => {
        try {
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = await fetchContract(signer);
            const tx = await contract.rejectRequest(requestId);
            await tx.wait();
            fetchRequests();
        } catch (error) {
            console.error(error);
        }
    };

    const handleVerifyDoctor = async () => {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const admin = accounts[0];
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = await fetchContract(signer);
            const tx = await contract.verifyDoctor(admin);
            await tx.wait();
        } catch (error) {
          console.error(error);
        }
    };

    const fetchRequests = async () => {
        try {
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = await fetchContract(signer);
            const requests = await contract.getRequests();
            setVerificationRequests(requests);
        } catch (error) {
            console.error(error);
        }
    };
    
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
    return (<HealthContext.Provider value={{ checkIfWalletIsConnected, connectWallet, currentAccount, healthBlockContract, registerHealthBlockContract, fetchPatientContract, fetchPatientInfoContract, 
        registerDoctorHealthBlockContract, registerHCProviderHealthBlockContract, handleRaiseRequest, handleApproveRequest, 
        handleRejectRequest, handleVerifyDoctor, verificationRequests, fetchRequests}}>{children}</HealthContext.Provider>)
}