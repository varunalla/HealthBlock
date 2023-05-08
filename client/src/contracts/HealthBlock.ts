/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export declare namespace HealthBlock {
  export type RequestStruct = {
    doctor: PromiseOrValue<string>;
    doctorName: PromiseOrValue<string>;
    credentialsHash: PromiseOrValue<string>;
    status: PromiseOrValue<string>;
  };

  export type RequestStructOutput = [string, string, string, string] & {
    doctor: string;
    doctorName: string;
    credentialsHash: string;
    status: string;
  };
}

export interface HealthBlockInterface extends utils.Interface {
  functions: {
    "patients(address)": FunctionFragment;
    "raiseRequest(string,string)": FunctionFragment;
    "getRequests()": FunctionFragment;
    "rejectRequest(uint256)": FunctionFragment;
    "approveRequest(uint256)": FunctionFragment;
    "getPatientInfo()": FunctionFragment;
    "getPatientInfoAll(address)": FunctionFragment;
    "registerPatient(string,uint8,string)": FunctionFragment;
    "getDoctorInfo()": FunctionFragment;
    "getDoctorInfoAll(address)": FunctionFragment;
    "registerDoctor(string,uint8,string,string)": FunctionFragment;
    "getHCProviderInfo()": FunctionFragment;
    "getHCProviderInfoAll(address)": FunctionFragment;
    "registerHCProvider(string,string,string,string)": FunctionFragment;
    "requestProvider(address)": FunctionFragment;
    "approvePatientProviderRequest(address)": FunctionFragment;
    "rejectPatientProviderRequest(address)": FunctionFragment;
    "getPatientRequests()": FunctionFragment;
    "getProviderRequests()": FunctionFragment;
    "getPatientProviders()": FunctionFragment;
    "getProviderPatients()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "patients"
      | "raiseRequest"
      | "getRequests"
      | "rejectRequest"
      | "approveRequest"
      | "getPatientInfo"
      | "getPatientInfoAll"
      | "registerPatient"
      | "getDoctorInfo"
      | "getDoctorInfoAll"
      | "registerDoctor"
      | "getHCProviderInfo"
      | "getHCProviderInfoAll"
      | "registerHCProvider"
      | "requestProvider"
      | "approvePatientProviderRequest"
      | "rejectPatientProviderRequest"
      | "getPatientRequests"
      | "getProviderRequests"
      | "getPatientProviders"
      | "getProviderPatients"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "patients",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "raiseRequest",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getRequests",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rejectRequest",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "approveRequest",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getPatientInfo",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPatientInfoAll",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "registerPatient",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getDoctorInfo",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getDoctorInfoAll",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "registerDoctor",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getHCProviderInfo",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getHCProviderInfoAll",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "registerHCProvider",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "requestProvider",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "approvePatientProviderRequest",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "rejectPatientProviderRequest",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getPatientRequests",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getProviderRequests",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPatientProviders",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getProviderPatients",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "patients", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "raiseRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRequests",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rejectRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "approveRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPatientInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPatientInfoAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerPatient",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDoctorInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDoctorInfoAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerDoctor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getHCProviderInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getHCProviderInfoAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerHCProvider",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "requestProvider",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "approvePatientProviderRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rejectPatientProviderRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPatientRequests",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getProviderRequests",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPatientProviders",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getProviderPatients",
    data: BytesLike
  ): Result;

  events: {
    "DoctorRequestRaised(address,string,string)": EventFragment;
    "NDoctor(address,string)": EventFragment;
    "NHCProvider(address,string)": EventFragment;
    "NPatient(address,string)": EventFragment;
    "RequestApproved(address,address,uint256)": EventFragment;
    "RequestRejected(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DoctorRequestRaised"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NDoctor"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NHCProvider"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NPatient"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RequestApproved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RequestRejected"): EventFragment;
}

export interface DoctorRequestRaisedEventObject {
  doctor: string;
  doctorName: string;
  credentialsHash: string;
}
export type DoctorRequestRaisedEvent = TypedEvent<
  [string, string, string],
  DoctorRequestRaisedEventObject
>;

export type DoctorRequestRaisedEventFilter =
  TypedEventFilter<DoctorRequestRaisedEvent>;

export interface NDoctorEventObject {
  _from: string;
  _name: string;
}
export type NDoctorEvent = TypedEvent<[string, string], NDoctorEventObject>;

export type NDoctorEventFilter = TypedEventFilter<NDoctorEvent>;

export interface NHCProviderEventObject {
  _from: string;
  _name: string;
}
export type NHCProviderEvent = TypedEvent<
  [string, string],
  NHCProviderEventObject
>;

export type NHCProviderEventFilter = TypedEventFilter<NHCProviderEvent>;

export interface NPatientEventObject {
  _from: string;
  _name: string;
}
export type NPatientEvent = TypedEvent<[string, string], NPatientEventObject>;

export type NPatientEventFilter = TypedEventFilter<NPatientEvent>;

export interface RequestApprovedEventObject {
  doctor: string;
  provider: string;
  requestId: BigNumber;
}
export type RequestApprovedEvent = TypedEvent<
  [string, string, BigNumber],
  RequestApprovedEventObject
>;

export type RequestApprovedEventFilter = TypedEventFilter<RequestApprovedEvent>;

export interface RequestRejectedEventObject {
  doctor: string;
  provider: string;
  requestId: BigNumber;
}
export type RequestRejectedEvent = TypedEvent<
  [string, string, BigNumber],
  RequestRejectedEventObject
>;

export type RequestRejectedEventFilter = TypedEventFilter<RequestRejectedEvent>;

export interface HealthBlock extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: HealthBlockInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    patients(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [string, number, string, string] & {
        name: string;
        age: number;
        email: string;
        id: string;
      }
    >;

    raiseRequest(
      doctorName: PromiseOrValue<string>,
      credentialsHash: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getRequests(
      overrides?: CallOverrides
    ): Promise<[HealthBlock.RequestStructOutput[]]>;

    rejectRequest(
      requestId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    approveRequest(
      requestId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getPatientInfo(
      overrides?: CallOverrides
    ): Promise<[string, number, string]>;

    getPatientInfoAll(
      _address: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string, number, string]>;

    registerPatient(
      _name: PromiseOrValue<string>,
      _age: PromiseOrValue<BigNumberish>,
      _email: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getDoctorInfo(
      overrides?: CallOverrides
    ): Promise<[string, number, string, string]>;

    getDoctorInfoAll(
      _address: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string, number, string, string]>;

    registerDoctor(
      _name: PromiseOrValue<string>,
      _age: PromiseOrValue<BigNumberish>,
      _email: PromiseOrValue<string>,
      _specialization: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getHCProviderInfo(
      overrides?: CallOverrides
    ): Promise<[string, string, string, string]>;

    getHCProviderInfoAll(
      _address: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string, string, string, string]>;

    registerHCProvider(
      _name: PromiseOrValue<string>,
      _email: PromiseOrValue<string>,
      _address: PromiseOrValue<string>,
      _phone: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    requestProvider(
      _provider: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    approvePatientProviderRequest(
      _patient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    rejectPatientProviderRequest(
      _patient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getPatientRequests(overrides?: CallOverrides): Promise<[string[]]>;

    getProviderRequests(overrides?: CallOverrides): Promise<[string[]]>;

    getPatientProviders(overrides?: CallOverrides): Promise<[string[]]>;

    getProviderPatients(overrides?: CallOverrides): Promise<[string[]]>;
  };

  patients(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<
    [string, number, string, string] & {
      name: string;
      age: number;
      email: string;
      id: string;
    }
  >;

  raiseRequest(
    doctorName: PromiseOrValue<string>,
    credentialsHash: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getRequests(
    overrides?: CallOverrides
  ): Promise<HealthBlock.RequestStructOutput[]>;

  rejectRequest(
    requestId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  approveRequest(
    requestId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getPatientInfo(overrides?: CallOverrides): Promise<[string, number, string]>;

  getPatientInfoAll(
    _address: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<[string, number, string]>;

  registerPatient(
    _name: PromiseOrValue<string>,
    _age: PromiseOrValue<BigNumberish>,
    _email: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getDoctorInfo(
    overrides?: CallOverrides
  ): Promise<[string, number, string, string]>;

  getDoctorInfoAll(
    _address: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<[string, number, string, string]>;

  registerDoctor(
    _name: PromiseOrValue<string>,
    _age: PromiseOrValue<BigNumberish>,
    _email: PromiseOrValue<string>,
    _specialization: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getHCProviderInfo(
    overrides?: CallOverrides
  ): Promise<[string, string, string, string]>;

  getHCProviderInfoAll(
    _address: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<[string, string, string, string]>;

  registerHCProvider(
    _name: PromiseOrValue<string>,
    _email: PromiseOrValue<string>,
    _address: PromiseOrValue<string>,
    _phone: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  requestProvider(
    _provider: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  approvePatientProviderRequest(
    _patient: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  rejectPatientProviderRequest(
    _patient: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getPatientRequests(overrides?: CallOverrides): Promise<string[]>;

  getProviderRequests(overrides?: CallOverrides): Promise<string[]>;

  getPatientProviders(overrides?: CallOverrides): Promise<string[]>;

  getProviderPatients(overrides?: CallOverrides): Promise<string[]>;

  callStatic: {
    patients(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [string, number, string, string] & {
        name: string;
        age: number;
        email: string;
        id: string;
      }
    >;

    raiseRequest(
      doctorName: PromiseOrValue<string>,
      credentialsHash: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    getRequests(
      overrides?: CallOverrides
    ): Promise<HealthBlock.RequestStructOutput[]>;

    rejectRequest(
      requestId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    approveRequest(
      requestId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getPatientInfo(
      overrides?: CallOverrides
    ): Promise<[string, number, string]>;

    getPatientInfoAll(
      _address: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string, number, string]>;

    registerPatient(
      _name: PromiseOrValue<string>,
      _age: PromiseOrValue<BigNumberish>,
      _email: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    getDoctorInfo(
      overrides?: CallOverrides
    ): Promise<[string, number, string, string]>;

    getDoctorInfoAll(
      _address: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string, number, string, string]>;

    registerDoctor(
      _name: PromiseOrValue<string>,
      _age: PromiseOrValue<BigNumberish>,
      _email: PromiseOrValue<string>,
      _specialization: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    getHCProviderInfo(
      overrides?: CallOverrides
    ): Promise<[string, string, string, string]>;

    getHCProviderInfoAll(
      _address: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string, string, string, string]>;

    registerHCProvider(
      _name: PromiseOrValue<string>,
      _email: PromiseOrValue<string>,
      _address: PromiseOrValue<string>,
      _phone: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    requestProvider(
      _provider: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    approvePatientProviderRequest(
      _patient: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    rejectPatientProviderRequest(
      _patient: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    getPatientRequests(overrides?: CallOverrides): Promise<string[]>;

    getProviderRequests(overrides?: CallOverrides): Promise<string[]>;

    getPatientProviders(overrides?: CallOverrides): Promise<string[]>;

    getProviderPatients(overrides?: CallOverrides): Promise<string[]>;
  };

  filters: {
    "DoctorRequestRaised(address,string,string)"(
      doctor?: PromiseOrValue<string> | null,
      doctorName?: PromiseOrValue<string> | null,
      credentialsHash?: null
    ): DoctorRequestRaisedEventFilter;
    DoctorRequestRaised(
      doctor?: PromiseOrValue<string> | null,
      doctorName?: PromiseOrValue<string> | null,
      credentialsHash?: null
    ): DoctorRequestRaisedEventFilter;

    "NDoctor(address,string)"(
      _from?: PromiseOrValue<string> | null,
      _name?: PromiseOrValue<string> | null
    ): NDoctorEventFilter;
    NDoctor(
      _from?: PromiseOrValue<string> | null,
      _name?: PromiseOrValue<string> | null
    ): NDoctorEventFilter;

    "NHCProvider(address,string)"(
      _from?: PromiseOrValue<string> | null,
      _name?: PromiseOrValue<string> | null
    ): NHCProviderEventFilter;
    NHCProvider(
      _from?: PromiseOrValue<string> | null,
      _name?: PromiseOrValue<string> | null
    ): NHCProviderEventFilter;

    "NPatient(address,string)"(
      _from?: PromiseOrValue<string> | null,
      _name?: PromiseOrValue<string> | null
    ): NPatientEventFilter;
    NPatient(
      _from?: PromiseOrValue<string> | null,
      _name?: PromiseOrValue<string> | null
    ): NPatientEventFilter;

    "RequestApproved(address,address,uint256)"(
      doctor?: PromiseOrValue<string> | null,
      provider?: PromiseOrValue<string> | null,
      requestId?: PromiseOrValue<BigNumberish> | null
    ): RequestApprovedEventFilter;
    RequestApproved(
      doctor?: PromiseOrValue<string> | null,
      provider?: PromiseOrValue<string> | null,
      requestId?: PromiseOrValue<BigNumberish> | null
    ): RequestApprovedEventFilter;

    "RequestRejected(address,address,uint256)"(
      doctor?: PromiseOrValue<string> | null,
      provider?: PromiseOrValue<string> | null,
      requestId?: PromiseOrValue<BigNumberish> | null
    ): RequestRejectedEventFilter;
    RequestRejected(
      doctor?: PromiseOrValue<string> | null,
      provider?: PromiseOrValue<string> | null,
      requestId?: PromiseOrValue<BigNumberish> | null
    ): RequestRejectedEventFilter;
  };

  estimateGas: {
    patients(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    raiseRequest(
      doctorName: PromiseOrValue<string>,
      credentialsHash: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getRequests(overrides?: CallOverrides): Promise<BigNumber>;

    rejectRequest(
      requestId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    approveRequest(
      requestId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getPatientInfo(overrides?: CallOverrides): Promise<BigNumber>;

    getPatientInfoAll(
      _address: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    registerPatient(
      _name: PromiseOrValue<string>,
      _age: PromiseOrValue<BigNumberish>,
      _email: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getDoctorInfo(overrides?: CallOverrides): Promise<BigNumber>;

    getDoctorInfoAll(
      _address: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    registerDoctor(
      _name: PromiseOrValue<string>,
      _age: PromiseOrValue<BigNumberish>,
      _email: PromiseOrValue<string>,
      _specialization: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getHCProviderInfo(overrides?: CallOverrides): Promise<BigNumber>;

    getHCProviderInfoAll(
      _address: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    registerHCProvider(
      _name: PromiseOrValue<string>,
      _email: PromiseOrValue<string>,
      _address: PromiseOrValue<string>,
      _phone: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    requestProvider(
      _provider: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    approvePatientProviderRequest(
      _patient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    rejectPatientProviderRequest(
      _patient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getPatientRequests(overrides?: CallOverrides): Promise<BigNumber>;

    getProviderRequests(overrides?: CallOverrides): Promise<BigNumber>;

    getPatientProviders(overrides?: CallOverrides): Promise<BigNumber>;

    getProviderPatients(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    patients(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    raiseRequest(
      doctorName: PromiseOrValue<string>,
      credentialsHash: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getRequests(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rejectRequest(
      requestId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    approveRequest(
      requestId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getPatientInfo(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPatientInfoAll(
      _address: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    registerPatient(
      _name: PromiseOrValue<string>,
      _age: PromiseOrValue<BigNumberish>,
      _email: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getDoctorInfo(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getDoctorInfoAll(
      _address: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    registerDoctor(
      _name: PromiseOrValue<string>,
      _age: PromiseOrValue<BigNumberish>,
      _email: PromiseOrValue<string>,
      _specialization: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getHCProviderInfo(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getHCProviderInfoAll(
      _address: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    registerHCProvider(
      _name: PromiseOrValue<string>,
      _email: PromiseOrValue<string>,
      _address: PromiseOrValue<string>,
      _phone: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    requestProvider(
      _provider: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    approvePatientProviderRequest(
      _patient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    rejectPatientProviderRequest(
      _patient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getPatientRequests(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getProviderRequests(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPatientProviders(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getProviderPatients(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
