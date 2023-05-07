import { ethers } from 'ethers';
import React, { useState } from 'react';

import { healthBlockABI, healthBlockAddress } from '../config/constants';
import Web3Modal from 'web3modal';
import { HealthBlock__factory } from '../contracts/factories/HealthBlock__factory';
import { HealthBlock } from '../contracts/HealthBlock';
import { Address } from 'cluster';

interface Request {
  doctor: string;
  doctorName: string;
  fileName: string;
  status: string;
}

interface hcProvider {
  name: string;
  email: string;
  providerAddress: string;
  phone: string;
  id: string;
}

interface Request {
  doctor: string;
  doctorName: string;
  fileName: string;
  status: string;
}

export type Patient = {
  name: string;
  age: number;
  email: string;
};
interface Doctor {
  name: string;
  age: number;
  email: string;
  specialization: string;
}

interface HealthAppContextInterface {
  checkIfWalletIsConnected?: () => Promise<void>;
  connectWallet?: () => Promise<void>;
  healthBlockContract?: () => Promise<void>;
  registerHealthBlockContract?: (name: string, age: number, email: string) => Promise<void>;
  updateProfile?: (hcAddress: string, docAddress: string) => Promise<void>;
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
  handleRaiseRequest?: (doctorName: string, file: string | null, hcpAddress: string) => Promise<void>;
  handleApproveRequest?: (requestId: number) => Promise<void>;
  handleRejectRequest?: (requestId: number) => Promise<void>;
  fetchDoctorContract?: () => Promise<Doctor | undefined>;
  fetchPatientContract?: () => Promise<Patient | undefined>;
  fetchHealthCareProviderContract?: () => Promise<hcProvider | undefined>;
  fetchPatientInfoContract?: (address: string) => Promise<void>;
  fetchRequests?: () => Promise<void>;
  fetchHealthCareProviders?: () => Promise<void>;
  fetchAllDoctors?: (provider: string) => Promise<void>;
  currentAccount?: string;
  verificationRequests?: Request[];
  providers?: hcProvider[];
  doctorList?: Doctor[];
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
  const [providers, setProviders] = useState<hcProvider[]>([]);
  const [doctorName, setDoctorName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [doctorList, setDoctorList] = useState<Doctor[]>([]);

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

  const fetchDoctorContract = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract: HealthBlock = fetchContract(signer);
      const [name, age, email, specialization] = await contract.getDoctorInfo();
      return { name, age, email, specialization } as Doctor;
    } catch (err) {
      throw(`Error Loading Health Contract ${err}`);
    }
  };
  
  const fetchHealthCareProviderContract = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract: HealthBlock = fetchContract(signer);
      const [name,  email, providerAddress, phone] = await contract.getHCProviderInfo();
      return { name, email, providerAddress, phone } as hcProvider;
    } catch (err) {
      throw(`Error Loading Health Contract ${err}`);
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
      throw('Error Loading Health Contract');
    }
  };


  const handleRaiseRequest = async (doctorName: string, file: string | null, hcpId: string | null) => {
    if (!file) return;
    setDoctorName(doctorName);
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = await fetchContract(signer);
    if (hcpId !== null) {
      const tx = await contract.raiseRequest(doctorName, file, hcpId);
      await tx.wait();
    }
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
      throw('Error Loading Health Contract');
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
      throw('Error Loading Health Contract');
    }
  };

  const fetchRequests = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);

      const requestsStruct = await contract.getRequests();
      const requests = requestsStruct.map((request) => ({
        doctor: request[0],
        doctorName: request[1],
        fileName: request[2],
        status: request[3],
      }));
      setVerificationRequests(requests);
    } catch (error) {
      throw('Error Loading Health Contract');
    }
  };

  const fetchHealthCareProviders = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);
      const hcProviders = await contract.getAllProviders();
      setProviders(hcProviders);
    } catch (error) {
      throw('Error Loading Health Contract');
    }
  };
  
  const fetchAllDoctors = async (provider: string) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);

      const hcProviders = await contract.getAllProviders();
      setProviders(hcProviders);

      const doctors = await contract.getAllDoctorsForProvider(
        '0x8eda1014b9177d464306935e8fcf9fd27c20aa08',
      );

      let docArr = [];
      for (let i = 0; i < doctors.length; i++) {
        let obj = {
          name: doctors[i][0],
          specialization: doctors[i][3],
          email: doctors[i][2],
          age: doctors[i][1],
        };
        docArr.push(obj);
      }

      setDoctorList(docArr);

    } catch (error) {
      setError('Error Loading Health Contract');
    }
  };

  const updateProfile = async (hcAddress: string, docAddress: string) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract: HealthBlock = fetchContract(signer);
      const update = await contract.mapDoctorToProvider(hcAddress, docAddress);

      update.wait();
    } catch (err: any) {
      setError(`Error Loading Health Contract ${err}`);
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
        fetchDoctorContract,
        fetchHealthCareProviderContract,
        fetchPatientInfoContract,
        registerDoctorHealthBlockContract,
        registerHCProviderHealthBlockContract,
        handleRaiseRequest,
        handleApproveRequest,
        handleRejectRequest,
        verificationRequests,
        fetchRequests,
        providers,
        fetchHealthCareProviders,
        fetchAllDoctors,
        doctorList,
        updateProfile,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};
