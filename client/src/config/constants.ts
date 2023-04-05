import HealthBlock from '../contracts/HealthBlock.json';

export const healthBlockAddress = process.env.REACT_APP_HEALTHBLOCK_ADDRESS||"Test";
export const healthBlockABI = HealthBlock.abi;