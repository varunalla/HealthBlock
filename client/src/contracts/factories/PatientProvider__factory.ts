/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type {
  PatientProvider,
  PatientProviderInterface,
} from "../PatientProvider";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_provider",
        type: "address",
      },
    ],
    name: "requestProvider",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_patient",
        type: "address",
      },
    ],
    name: "approvePatientProviderRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_patient",
        type: "address",
      },
    ],
    name: "rejectPatientProviderRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getPatientRequests",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getProviderRequests",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getPatientProviders",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getProviderPatients",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50600080546001600160a01b03191633179055610b3b806100326000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063386a5a7a1161005b578063386a5a7a146100bd578063a31d3cc2146100d0578063bb0c115a146100d8578063e42315e8146100eb57600080fd5b806315c9d3da1461008257806318dbb76f146100a05780632c2715f4146100b5575b600080fd5b61008a6100f3565b6040516100979190610a35565b60405180910390f35b6100b36100ae366004610a82565b6101c6565b005b61008a610313565b6100b36100cb366004610a82565b6103df565b61008a61054a565b6100b36100e6366004610a82565b6106f7565b61008a6108b6565b3360009081526001602052604090205460609060ff1661015a5760405162461bcd60e51b815260206004820152601f60248201527f596f752068617665206e6f74206d61646520616e792072657175657374732e0060448201526064015b60405180910390fd5b33600090815260016020908152604091829020600301805483518184028101840190945280845290918301828280156101bc57602002820191906000526020600020905b81546001600160a01b0316815260019091019060200180831161019e575b5050505050905090565b3360009081526001602081815260408084206001600160a01b0386168552909201905290205460ff16156102625760405162461bcd60e51b815260206004820152602d60248201527f596f7520616c726561647920686176652061207265717565737420666f72207460448201527f6869732070726f76696465722e000000000000000000000000000000000000006064820152608401610151565b336000818152600160208181526040808420805460ff19908116851782556001600160a01b03979097168086528185018452828620805489168617905560029182018054808701825590875284872001805473ffffffffffffffffffffffffffffffffffffffff199081168317909155908652818452828620805489168617815587875280860185529286208054909816851790975580835201805492830181558352909120018054909216179055565b3360009081526002602052604090205460609060ff166103755760405162461bcd60e51b815260206004820152601c60248201527f596f7520646f206e6f74206861766520616e792070617469656e7473000000006044820152606401610151565b33600090815260026020908152604091829020600301805483518184028101840190945280845290918301828280156101bc576020028201919060005260206000209081546001600160a01b0316815260019091019060200180831161019e575050505050905090565b3360009081526002602090815260408083206001600160a01b038516845260010190915290205460ff166104705760405162461bcd60e51b815260206004820152603260248201527f596f752068617665206e6f742072656365697665642061207265717565737420604482015271333937b6903a3434b9903830ba34b2b73a1760711b6064820152608401610151565b6001600160a01b0381166000908152600160208181526040808420338552909201905290205460ff166105005760405162461bcd60e51b815260206004820152603260248201527f596f752068617665206e6f742072656365697665642061207265717565737420604482015271333937b6903a3434b9903830ba34b2b73a1760711b6064820152608401610151565b6001600160a01b0316600081815260016020818152604080842033855283018252808420805460ff1990811690915560028352818520958552949092019052902080549091169055565b3360009081526002602052604090205460609060ff166105d25760405162461bcd60e51b815260206004820152602260248201527f596f7520617265206e6f74206120726567697374657265642070726f7669646560448201527f722e0000000000000000000000000000000000000000000000000000000000006064820152608401610151565b3360009081526002602081905260408220015467ffffffffffffffff8111156105fd576105fd610ab2565b604051908082528060200260200182016040528015610626578160200160208202803683370190505b50905060005b33600090815260026020819052604090912001548110156106f15733600090815260026020819052604082200180548390811061066b5761066b610ac8565b60009182526020808320909101543383526002825260408084206001600160a01b0390921680855260019290920190925291205490915060ff16156106de57808383815181106106bd576106bd610ac8565b60200260200101906001600160a01b031690816001600160a01b0316815250505b50806106e981610ade565b91505061062c565b50919050565b3360009081526002602090815260408083206001600160a01b038516845260010190915290205460ff166107885760405162461bcd60e51b815260206004820152603260248201527f596f752068617665206e6f742072656365697665642061207265717565737420604482015271333937b6903a3434b9903830ba34b2b73a1760711b6064820152608401610151565b6001600160a01b0381166000908152600160208181526040808420338552909201905290205460ff166108185760405162461bcd60e51b815260206004820152603260248201527f596f752068617665206e6f742072656365697665642061207265717565737420604482015271333937b6903a3434b9903830ba34b2b73a1760711b6064820152608401610151565b6001600160a01b03166000818152600160208181526040808420338086528185018452828620805460ff1990811690915560039283018054808801825590885285882001805473ffffffffffffffffffffffffffffffffffffffff1990811684179091559187526002808652848820898952808801875294882080549092169091558452910180549384018155845292200180549091169091179055565b3360009081526001602052604090205460609060ff166109185760405162461bcd60e51b815260206004820152601f60248201527f596f752068617665206e6f74206d61646520616e792072657175657374732e006044820152606401610151565b3360009081526001602052604081206002015467ffffffffffffffff81111561094357610943610ab2565b60405190808252806020026020018201604052801561096c578160200160208202803683370190505b50905060005b336000908152600160205260409020600201548110156106f1573360009081526001602052604081206002018054839081106109b0576109b0610ac8565b6000918252602080832090910154338352600180835260408085206001600160a01b039093168086529290910190925291205490915060ff1615610a225780838381518110610a0157610a01610ac8565b60200260200101906001600160a01b031690816001600160a01b0316815250505b5080610a2d81610ade565b915050610972565b6020808252825182820181905260009190848201906040850190845b81811015610a765783516001600160a01b031683529284019291840191600101610a51565b50909695505050505050565b600060208284031215610a9457600080fd5b81356001600160a01b0381168114610aab57600080fd5b9392505050565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b600060018201610afe57634e487b7160e01b600052601160045260246000fd5b506001019056fea264697066735822122040e49b05e827cef4daf2b73d3962fb87f7e11e6b4f8cb80c69fd6478385c290864736f6c63430008110033";

type PatientProviderConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PatientProviderConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PatientProvider__factory extends ContractFactory {
  constructor(...args: PatientProviderConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<PatientProvider> {
    return super.deploy(overrides || {}) as Promise<PatientProvider>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): PatientProvider {
    return super.attach(address) as PatientProvider;
  }
  override connect(signer: Signer): PatientProvider__factory {
    return super.connect(signer) as PatientProvider__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PatientProviderInterface {
    return new utils.Interface(_abi) as PatientProviderInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PatientProvider {
    return new Contract(address, _abi, signerOrProvider) as PatientProvider;
  }
}
