import HealthBlock from '../contracts/HealthBlock.json';

<<<<<<< HEAD
export const healthBlockAddress = "0xBBB785C8BB3FF9c59f13422fEb68f674b1E1a707";
=======
export const healthBlockAddress = process.env.REACT_APP_HEALTHBLOCK_ADDRESS||"Test";
>>>>>>> main
export const healthBlockABI = HealthBlock.abi;