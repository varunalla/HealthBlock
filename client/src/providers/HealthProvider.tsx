import { ethers } from 'ethers';
import React, { useState } from 'react';

import { healthBlockABI, healthBlockAddress, providerBlockAddress } from '../config/constants';
import Web3Modal from 'web3modal';
import { HealthBlock__factory } from '../contracts/factories/HealthBlock__factory';
import { HealthBlock } from '../contracts/HealthBlock';
import { PatientProvider, PatientProvider__factory } from '../contracts';

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
interface DoctorToProviderRequest {
  name: string;
  address: string;
  status: string;
}

interface HealthAppContextInterface {
  checkIfWalletIsConnected?: () => Promise<void>;
  connectWallet?: () => Promise<void>;
  healthBlockContract?: () => Promise<void>;
  registerHealthBlockContract?: (name: string, age: number, email: string) => Promise<void>;
  updateProfile?: (hcAddress: string, docAddress: string, status: string) => Promise<void>;
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
  handleApproveRequest?: (requestId: number, hcpAddress: string) => Promise<void>;
  handleRejectRequest?: (requestId: number, hcpAddress: string) => Promise<void>;
  fetchDoctorContract?: () => Promise<Doctor | undefined>;
  fetchPatientContract?: () => Promise<Patient | undefined>;
  fetchHealthCareProviderContract?: () => Promise<hcProvider | undefined>;
  fetchPatientInfoContract?: (address: string) => Promise<void>;
  fetchRequests?: (hcpAddress: string) => Promise<void>;
  fetchHealthCareProviders?: () => Promise<void>;
  registerWithProvider?: (providerAddress: string) => Promise<void>;
  fetchPatientProviderRequests?: () => Promise<string[] | undefined>;
  fetchProviderPatientRequests?: () => Promise<string[] | undefined>;
  fetchPatients?: () => Promise<string[] | undefined>;
  fetchProviders?: () => Promise<string[] | undefined>;
  approveProviderPatientRequest?: (address: string) => Promise<void>;
  rejectProviderPatientRequest?: (address: string) => Promise<void>;
  fetchAllDoctors?: (provider: string) => Promise<void>;
  fetchAllDoctorToProviderRequests?: (provider: string) => Promise<void>;
  raiseDoctorToHCRequest?: (provider: string, doctor: string, name: string) => Promise<void>;
  currentAccount?: string;
  verificationRequests?: Request[];
  providers?: hcProvider[];
  doctorList?: Doctor[];
  doctorToProviderReqList?: DoctorToProviderRequest[];
}

const fetchContract = (signerOrProvider: ethers.Signer | ethers.providers.Provider) =>
  HealthBlock__factory.connect(healthBlockAddress, signerOrProvider);
const fetchProviderContract = (signerOrProvider: ethers.Signer | ethers.providers.Provider) =>
  PatientProvider__factory.connect(providerBlockAddress, signerOrProvider);

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
  const [doctorToProviderReqList, setDocToProviderList] = useState<DoctorToProviderRequest[]>([]);

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
      const [name,  email, providerAddress, phone, id] = await contract.getHCProviderInfo();
      return { name, email, providerAddress, phone, id } as hcProvider;
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
    console.log("hcpid", hcpId);
    if (hcpId !== null) {
      const tx = await contract.raiseRequest(doctorName, file, hcpId);
      console.log("hcpid", hcpId);
      await tx.wait();
    }
    setDoctorName('');
    setFile(null);
    fetchRequests(hcpId);
  };

  const handleApproveRequest = async (requestId: number, hcpId: string | null) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);
      if (hcpId !== null) {
        const tx = await contract.approveRequest(requestId, hcpId);
        await tx.wait();
        fetchRequests(hcpId);
      }
    } catch (error) {
      throw('Error Loading Health Contract');
    }
  };

  const handleRejectRequest = async (requestId: number, hcpId: string | null) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);
      if (hcpId !== null) {
        const tx = await contract.rejectRequest(requestId, hcpId);
        await tx.wait();
        fetchRequests(hcpId);
      }
    } catch (error) {
      throw('Error Loading Health Contract');
    }
  };

  const fetchRequests = async (hcpId: string | null) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);
      if (hcpId !== null) {
        const requestsStruct = await contract.getRequests(hcpId);
        const requests = requestsStruct.map((request) => ({
          doctor: request[0],
          doctorName: request[1],
          fileName: request[2],
          status: request[3],
        }));
        setVerificationRequests(requests);
      }
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
  
const fetchPatientProviderRequests = async () => {
  try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchProviderContract(signer);
      const requests = await contract.getPatientRequests();
      return requests;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const fetchProviderPatientRequests = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchProviderContract(signer);
      const requests = await contract.getProviderRequests();
      return requests;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const fetchPatients = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchProviderContract(signer);
      const requests = await contract.getProviderPatients();
      return requests;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const fetchProviders = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchProviderContract(signer);
      const requests = await contract.getPatientProviders();
      return requests;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const approveProviderPatientRequest = async (patientAddress: string) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchProviderContract(signer);
      const tx = await contract.approvePatientProviderRequest(patientAddress);
      await tx.wait();
    } catch (error) {
      throw error;
    }
  };
  const rejectProviderPatientRequest = async (patientAddress: string) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchProviderContract(signer);
      const tx = await contract.rejectPatientProviderRequest(patientAddress);
      await tx.wait();
    } catch (error) {
      throw error;
    }
  };
  //connect contract
  const registerWithProvider = async (providerAddress: string) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract: PatientProvider = fetchProviderContract(signer);
      const register = await contract.requestProvider(providerAddress);
      register.wait();
    } catch (err: any) {
      throw err;
    }
  };

  const fetchAllDoctors = async (provider: string) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const contract = await fetchProviderContract(signer);
      //const docArr = [];
      /*
      const doctors = await contract.getAllDoctorsForProvider(
        '0xB3CC507e752Dcc3DA1cEf955B58e97Ae77160103',
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
      */
      setDoctorList([]);
    } catch (error) {
      setError('Error Loading Health Contract');
    }
  };

  const updateProfile = async (hcAddress: string, docAddress: string, status: string) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract: HealthBlock = fetchContract(signer);
      let update;
      if (status == 'confirmed') {
        update = await contract.mapDoctorToProvider(hcAddress, docAddress);
      } else {
        update = await contract.declineDoctorToProviderRequest(hcAddress, docAddress);
      }

      update.wait();
    } catch (err: any) {
      setError(`Error Loading Health Contract ${err}`);
    }
  };

  const fetchAllDoctorToProviderRequests = async (hcAddress: string) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract: HealthBlock = fetchContract(signer);
      const doctors = await contract.getAllDoctorToProviderRequests(
        '0xb3cc507e752dcc3da1cef955b58e97ae77160103',
      );
      let docArr = [];
      for (let i = 0; i < doctors.length; i++) {
        let obj = {
          name: doctors[i][0],
          address: doctors[i][1],
          status: doctors[i][2],
        };
        docArr.push(obj);
      }

      setDocToProviderList(docArr);
    } catch (err: any) {
      setError(`Error Loading Health Contract ${err}`);
    }
  };

  const raiseDoctorToHCRequest = async (
    hcAddress: string,
    docAddress: string,
    doctorName: string,
  ) => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract: HealthBlock = fetchContract(signer);
      const update = await contract.raiseDoctorToProviderRequest(hcAddress, docAddress, doctorName);
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
        fetchPatientProviderRequests,
        fetchProviderPatientRequests,
        registerWithProvider,
        fetchPatients,
        fetchProviders,
        approveProviderPatientRequest,
        rejectProviderPatientRequest,
        fetchAllDoctors,
        doctorList,
        updateProfile,
        fetchAllDoctorToProviderRequests,
        raiseDoctorToHCRequest,
        doctorToProviderReqList,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};
