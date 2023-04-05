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

export interface HealthBlockInterface extends utils.Interface {
  functions: {
    "patients(address)": FunctionFragment;
    "getPatientInfo()": FunctionFragment;
    "getPatientInfoAll(address)": FunctionFragment;
    "registerPatient(string,uint8,string)": FunctionFragment;
    "getDoctorInfo()": FunctionFragment;
    "getDoctorInfoAll(address)": FunctionFragment;
    "registerDoctor(string,uint8,string,string)": FunctionFragment;
    "getHCProviderInfo()": FunctionFragment;
    "getHCProviderInfoAll(address)": FunctionFragment;
    "registerHCProvider(string,string,string,string)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "patients"
      | "getPatientInfo"
      | "getPatientInfoAll"
      | "registerPatient"
      | "getDoctorInfo"
      | "getDoctorInfoAll"
      | "registerDoctor"
      | "getHCProviderInfo"
      | "getHCProviderInfoAll"
      | "registerHCProvider"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "patients",
    values: [PromiseOrValue<string>]
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

  decodeFunctionResult(functionFragment: "patients", data: BytesLike): Result;
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

  events: {
    "NDoctor(address,string)": EventFragment;
    "NHCProvider(address,string)": EventFragment;
    "NPatient(address,string)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "NDoctor"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NHCProvider"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NPatient"): EventFragment;
}

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
  };

  filters: {
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
  };

  estimateGas: {
    patients(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
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
  };

  populateTransaction: {
    patients(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
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
  };
}
