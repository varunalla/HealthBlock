import { ethers } from 'ethers';
import React, { useState } from 'react';

import { healthBlockABI, healthBlockAddress } from '../config/constants';
import Web3Modal from 'web3modal';
import { HealthBlock__factory } from '../contracts/factories/HealthBlock__factory';
import { HealthBlock } from '../contracts/HealthBlock';

interface Request {
  doctor: string;
  doctorName: string;
  credentialsHash: string;
  status: string;
}

interface MedicalRecordRequest {
  doctorAddress: string;
  patientAddress: string;
  docName: string;
  docEmail: string;
  patientName: string;
  patientEmail: string;
  reqStatus: string;
}

export type Patient = {
  name: string;
  age: number;
  email: string;
};

interface HealthAppContextInterface {
  checkIfWalletIsConnected?: () => Promise<void>;
  connectWallet?: () => Promise<void>;
  healthBlockContract?: () => Promise<void>;
  registerHealthBlockContract?: (name: string, age: number, email: string) => Promise<void>;
  registerDoctorHealthBlockContract?: (
    name: string,
    age: number,
    email: string,
    specialization: string,
  ) => Promise<void>;
  registerHCProviderHealthBlockContract?: (
    name: string,
    email: string,
    address: string,
    phone: string,
  ) => Promise<void>;
  requestMedicalRecordHealthBlockContract?: (
    patientAddress: string,
    docName: string,
    patientName: string,
    docEmail: string,
    patientEmail: string,
  ) => Promise<void>;
  approveMedicalRecordsRequestHealthBlockContract?: (requestID: number) => Promise<void>;
  rejectMedicalRecordsRequestHealthBlockContract?: (requestID: number) => Promise<void>;
  handleRaiseRequest?: (doctorName: string, file: File | null) => Promise<void>;
  handleApproveRequest?: (requestId: number) => Promise<void>;
  handleRejectRequest?: (requestId: number) => Promise<void>;
  fetchPatientContract?: () => Promise<Patient | undefined>;
  fetchPatientInfoContract?: (address: string) => Promise<void>;
  fetchRequests?: () => Promise<void>;
  fetchMedicalRecordRequests?: () => Promise<void>;
  currentAccount?: string;
  verificationRequests?: Request[];
  medicalRecordRequests?: MedicalRecordRequest[];
}

const fetchContract = (signerOrProvider: ethers.Signer | ethers.providers.Provider) =>
  HealthBlock__factory.connect(healthBlockAddress, signerOrProvider);

export const HealthContext = React.createContext<HealthAppContextInterface>({});

interface Props {
  children?: React.ReactNode;
}

export const HealthProvider: React.FC<Props> = ({ children, ...props }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [error, setError] = useState('');
  const [verificationRequests, setVerificationRequests] = useState<Request[]>([]);
  const [medicalRecordRequests, setMedicalRecordRequests] = useState<MedicalRecordRequest[]>([]);
  const [doctorName, setDoctorName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [patientAddress, setPatientAddress] = useState('');
  const [docName, setDocName] = useState('');
  const [docEmail, setDocEmail] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setpatientEmail] = useState('');

  //fetch metamask accounts
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return setError('Please Install Metamask');
    const account = await window.ethereum.request?.({ method: 'eth_accounts' });
    if (account?.length) {
      setCurrentAccount(account[0]);
    } else {
      return setError('Please Install Metamask& connect, reload');
    }
  };
  //connect metamask wallet
  const connectWallet = async () => {
    if (!window.ethereum) return setError('Please Install Metamask');
    const account = await window.ethereum.request?.({ method: 'eth_requestAccounts' });
    setCurrentAccount(account[0]);
  };
  //connect contract
  const healthBlockContract = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
    } catch (err) {
      setError(`Error Loading Health Contract ${err}`);
    }
  };
  //connect contract
  const registerHealthBlockContract = async (name: string, age: number, email: string) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract: HealthBlock = fetchContract(signer);
      const register = await contract.registerPatient(name, age, email);
      register.wait();
    } catch (err: any) {
      setError(`Error Loading Health Contract ${err}`);
    }
  };

  const registerDoctorHealthBlockContract = async (
    name: string,
    age: number,
    email: string,
    specialization: string,
  ) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract: HealthBlock = fetchContract(signer);
      const register = await contract.registerDoctor(name, age, email, specialization);
      register.wait();
    } catch (err) {
      setError(`Error Loading Health Contract ${err}`);
    }
  };

  const fetchPatientContract = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract: HealthBlock = fetchContract(signer);
      const [name, age, email] = await contract.getPatientInfo();
      return { name, age, email } as Patient;
    } catch (err) {
      setError(`Error Loading Health Contract ${err}`);
    }
  };

  const fetchHCProviders = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract: HealthBlock = fetchContract(signer);
      const [name, age, email] = await contract.getPatientInfo();
      return { name, age, email } as Patient;
    } catch (err) {
      setError(`Error Loading Health Contract ${err}`);
    }
  };

  const fetchPatientInfoContract = async (address: string) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract: HealthBlock = fetchContract(signer);
      const [name, age, email] = await contract.getPatientInfoAll(address);
    } catch (err) {
      setError(`Error Loading Health Contract ${err}`);
    }
  };

  const requestMedicalRecordHealthBlockContract = async (
    patientAddress: string,
    docName: string,
    patientName: string,
    docEmail: string,
    patientEmail: string,
  ) => {
    console.log('executing medical record request contract');
    try {
      setPatientAddress(patientAddress);
      setDocName(docName);
      setDocEmail(docEmail);
      setPatientName(patientName);
      setpatientEmail(patientEmail);
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);
      console.log(contract);
      const info = await contract.requestMedicalRecord(
        patientAddress,
        docName,
        patientName,
        docEmail,
        patientEmail,
      );
      console.log(info);
      await info.wait();
    } catch (err) {
      setError(`Error requesting medical records from patients ${err}`);
      console.log('Error from request Health Record contract');
      console.log(err);
    }
  };

  const approveMedicalRecordsRequestHealthBlockContract = async (requestID: number) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract: HealthBlock = await fetchContract(signer);
      const info = await contract.approveMedicalRecordsRequest(requestID);
      await info.wait();
    } catch (err) {
      setError(`Error approving medical records request ${err}`);
    }
  };

  const rejectMedicalRecordsRequestHealthBlockContract = async (requestID: number) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract: HealthBlock = await fetchContract(signer);
      const info = await contract.rejectMedicalRecordsRequest(requestID);
      await info.wait();
    } catch (err) {
      setError(`Error rejecting medical records request ${err}`);
    }
  };

  const fetchMedicalRecordRequests = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);
      const medicalRecordRequestsStruct = await contract.getMedicalRecordRequests();
      const recordRequests = medicalRecordRequestsStruct.map((recordRequest) => ({
        doctorAddress: recordRequest[0],
        patientAddress: recordRequest[1],
        docName: recordRequest[2],
        docEmail: recordRequest[3],
        patientName: recordRequest[4],
        patientEmail: recordRequest[5],
        reqStatus: recordRequest[6],
      }));
      setMedicalRecordRequests(recordRequests);
    } catch (error) {
      setError('Error fetching Medical Record Requests');
    }
  };

  const registerHCProviderHealthBlockContract = async (
    name: string,
    email: string,
    address: string,
    phone: string,
  ) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract: HealthBlock = await fetchContract(signer);

      const register = await contract.registerHCProvider(name, email, address, phone);
      register.wait();
    } catch (err) {
      setError('Error Loading Health Contract');
    }
  };

  const handleRaiseRequest = async (doctorName: string, file: File | null) => {
    if (!file) return;
    const credentialsHash: string = '3423dg43';
    //const credentialsHash: Promise<string>  = getFileHash(file);
    setDoctorName(doctorName);
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = await fetchContract(signer);

    const tx = await contract.raiseRequest(doctorName, credentialsHash);
    await tx.wait();
    setDoctorName('');
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
      setError('Error Loading Health Contract');
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
      setError('Error Loading Health Contract');
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
      setError('Error Loading Health Contract');
    }
  };

  return (
    <HealthContext.Provider
      value={{
        checkIfWalletIsConnected,
        connectWallet,
        currentAccount,
        healthBlockContract,
        registerHealthBlockContract,
        fetchPatientContract,
        fetchPatientInfoContract,
        requestMedicalRecordHealthBlockContract,
        approveMedicalRecordsRequestHealthBlockContract,
        rejectMedicalRecordsRequestHealthBlockContract,
        registerDoctorHealthBlockContract,
        registerHCProviderHealthBlockContract,
        handleRaiseRequest,
        handleApproveRequest,
        handleRejectRequest,
        verificationRequests,
        medicalRecordRequests,
        fetchRequests,
        fetchMedicalRecordRequests,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};
