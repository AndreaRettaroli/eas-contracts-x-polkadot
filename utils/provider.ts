import { JsonRpcProvider } from 'ethers';
import { config } from './config';

export const provider = new JsonRpcProvider(config.network.rpc, {
  chainId: config.network.chainId,
  name: config.network.name,
});