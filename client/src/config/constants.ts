import HealthBlock from '../contracts/HealthBlock.json';

export const healthBlockAddress = process.env.REACT_APP_HEALTHBLOCK_ADDRESS||"Test";// || "0x6Fd2B45F4Eff401654028c5097fdE9c6a8f07298";
export const healthBlockABI = HealthBlock.abi;