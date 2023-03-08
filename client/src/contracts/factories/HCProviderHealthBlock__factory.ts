/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type {
  HCProviderHealthBlock,
  HCProviderHealthBlockInterface,
} from "../HCProviderHealthBlock";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "getHCProviderInfo",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_email",
        type: "string",
      },
      {
        internalType: "string",
        name: "_address",
        type: "string",
      },
      {
        internalType: "string",
        name: "_phone",
        type: "string",
      },
    ],
    name: "registerHCProvider",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610d8e806100606000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063916922c41461003b578063bc4fe4021461005c575b600080fd5b610043610078565b6040516100539493929190610761565b60405180910390f35b6100766004803603810190610071919061090b565b6103b3565b005b606080606080336000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209050600073ffffffffffffffffffffffffffffffffffffffff168160040160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161161011f57600080fd5b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090508060000181600101826002018360030183805461017e90610a11565b80601f01602080910402602001604051908101604052809291908181526020018280546101aa90610a11565b80156101f75780601f106101cc576101008083540402835291602001916101f7565b820191906000526020600020905b8154815290600101906020018083116101da57829003601f168201915b5050505050935082805461020a90610a11565b80601f016020809104026020016040519081016040528092919081815260200182805461023690610a11565b80156102835780601f1061025857610100808354040283529160200191610283565b820191906000526020600020905b81548152906001019060200180831161026657829003601f168201915b5050505050925081805461029690610a11565b80601f01602080910402602001604051908101604052809291908181526020018280546102c290610a11565b801561030f5780601f106102e45761010080835404028352916020019161030f565b820191906000526020600020905b8154815290600101906020018083116102f257829003601f168201915b5050505050915080805461032290610a11565b80601f016020809104026020016040519081016040528092919081815260200182805461034e90610a11565b801561039b5780601f106103705761010080835404028352916020019161039b565b820191906000526020600020905b81548152906001019060200180831161037e57829003601f168201915b50505050509050965096509650965050505090919293565b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020905060405160200161040590610a73565b604051602081830303815290604052805190602001208560405160200161042c9190610ab9565b604051602081830303815290604052805190602001200361044c57600080fd5b60405160200161045b90610a73565b60405160208183030381529060405280519060200120846040516020016104829190610ab9565b60405160208183030381529060405280519060200120036104a257600080fd5b6040516020016104b190610a73565b60405160208183030381529060405280519060200120836040516020016104d89190610ab9565b60405160208183030381529060405280519060200120036104f857600080fd5b60405160200161050790610a73565b604051602081830303815290604052805190602001208260405160200161052e9190610ab9565b604051602081830303815290604052805190602001200361054e57600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168160040160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1611156105ac57600080fd5b6040518060a001604052808681526020018581526020018481526020018381526020013373ffffffffffffffffffffffffffffffffffffffff16815250600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082015181600001908161063d9190610c86565b5060208201518160010190816106539190610c86565b5060408201518160020190816106699190610c86565b50606082015181600301908161067f9190610c86565b5060808201518160040160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509050505050505050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561070b5780820151818401526020810190506106f0565b60008484015250505050565b6000601f19601f8301169050919050565b6000610733826106d1565b61073d81856106dc565b935061074d8185602086016106ed565b61075681610717565b840191505092915050565b6000608082019050818103600083015261077b8187610728565b9050818103602083015261078f8186610728565b905081810360408301526107a38185610728565b905081810360608301526107b78184610728565b905095945050505050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61081882610717565b810181811067ffffffffffffffff82111715610837576108366107e0565b5b80604052505050565b600061084a6107c2565b9050610856828261080f565b919050565b600067ffffffffffffffff821115610876576108756107e0565b5b61087f82610717565b9050602081019050919050565b82818337600083830152505050565b60006108ae6108a98461085b565b610840565b9050828152602081018484840111156108ca576108c96107db565b5b6108d584828561088c565b509392505050565b600082601f8301126108f2576108f16107d6565b5b813561090284826020860161089b565b91505092915050565b60008060008060808587031215610925576109246107cc565b5b600085013567ffffffffffffffff811115610943576109426107d1565b5b61094f878288016108dd565b945050602085013567ffffffffffffffff8111156109705761096f6107d1565b5b61097c878288016108dd565b935050604085013567ffffffffffffffff81111561099d5761099c6107d1565b5b6109a9878288016108dd565b925050606085013567ffffffffffffffff8111156109ca576109c96107d1565b5b6109d6878288016108dd565b91505092959194509250565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610a2957607f821691505b602082108103610a3c57610a3b6109e2565b5b50919050565b600081905092915050565b50565b6000610a5d600083610a42565b9150610a6882610a4d565b600082019050919050565b6000610a7e82610a50565b9150819050919050565b6000610a93826106d1565b610a9d8185610a42565b9350610aad8185602086016106ed565b80840191505092915050565b6000610ac58284610a88565b915081905092915050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302610b327fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610af5565b610b3c8683610af5565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000610b83610b7e610b7984610b54565b610b5e565b610b54565b9050919050565b6000819050919050565b610b9d83610b68565b610bb1610ba982610b8a565b848454610b02565b825550505050565b600090565b610bc6610bb9565b610bd1818484610b94565b505050565b5b81811015610bf557610bea600082610bbe565b600181019050610bd7565b5050565b601f821115610c3a57610c0b81610ad0565b610c1484610ae5565b81016020851015610c23578190505b610c37610c2f85610ae5565b830182610bd6565b50505b505050565b600082821c905092915050565b6000610c5d60001984600802610c3f565b1980831691505092915050565b6000610c768383610c4c565b9150826002028217905092915050565b610c8f826106d1565b67ffffffffffffffff811115610ca857610ca76107e0565b5b610cb28254610a11565b610cbd828285610bf9565b600060209050601f831160018114610cf05760008415610cde578287015190505b610ce88582610c6a565b865550610d50565b601f198416610cfe86610ad0565b60005b82811015610d2657848901518255600182019150602085019450602081019050610d01565b86831015610d435784890151610d3f601f891682610c4c565b8355505b6001600288020188555050505b50505050505056fea26469706673582212205e4f09def0ea6124f780f84d9a2d5dbd6b15732d6bfeea350748aa56fa31bd5264736f6c63430008110033";

type HCProviderHealthBlockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: HCProviderHealthBlockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class HCProviderHealthBlock__factory extends ContractFactory {
  constructor(...args: HCProviderHealthBlockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<HCProviderHealthBlock> {
    return super.deploy(overrides || {}) as Promise<HCProviderHealthBlock>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): HCProviderHealthBlock {
    return super.attach(address) as HCProviderHealthBlock;
  }
  override connect(signer: Signer): HCProviderHealthBlock__factory {
    return super.connect(signer) as HCProviderHealthBlock__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): HCProviderHealthBlockInterface {
    return new utils.Interface(_abi) as HCProviderHealthBlockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): HCProviderHealthBlock {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as HCProviderHealthBlock;
  }
}
