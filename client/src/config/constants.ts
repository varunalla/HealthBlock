import HealthBlock from '../contracts/HealthBlock.json';

//export const healthBlockAddress = "0x2c1d88575485Cc7745Eb38CD95FC3818e928476c";

export const healthBlockAddress = process.env.REACT_APP_HEALTHBLOCK_ADDRESS||"Test";
export const healthBlockABI = HealthBlock.abi;