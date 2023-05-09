import HealthBlock from '../contracts/HealthBlock.json';

export const healthBlockAddress = process.env.REACT_APP_HEALTHBLOCK_ADDRESS || 'Test';
export const providerBlockAddress = process.env.REACT_APP_PROVIDER_ADDRESS || 'Test';
export const blockChainAddress =
  process.env.REACT_APP_BLOCKCHAIN_ADDRESS || 'http://127.0.0.1:8545';
export const healthBlockABI = HealthBlock.abi;
