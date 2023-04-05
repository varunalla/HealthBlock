/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface HCProviderHealthBlockInterface extends utils.Interface {
  functions: {
    "getHCProviderInfo()": FunctionFragment;
    "registerHCProvider(string,string,string,string)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "getHCProviderInfo" | "registerHCProvider"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getHCProviderInfo",
    values?: undefined
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

  decodeFunctionResult(
    functionFragment: "getHCProviderInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerHCProvider",
    data: BytesLike
  ): Result;

  events: {};
}

export interface HCProviderHealthBlock extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: HCProviderHealthBlockInterface;

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
    getHCProviderInfo(
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

  getHCProviderInfo(
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
    getHCProviderInfo(
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

  filters: {};

  estimateGas: {
    getHCProviderInfo(overrides?: CallOverrides): Promise<BigNumber>;

    registerHCProvider(
      _name: PromiseOrValue<string>,
      _email: PromiseOrValue<string>,
      _address: PromiseOrValue<string>,
      _phone: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getHCProviderInfo(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    registerHCProvider(
      _name: PromiseOrValue<string>,
      _email: PromiseOrValue<string>,
      _address: PromiseOrValue<string>,
      _phone: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}