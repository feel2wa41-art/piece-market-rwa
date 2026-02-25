import {createPublicClient, http} from 'viem';
import {base, baseSepolia} from 'viem/chains';
import {ENV} from '../../config/env';

const activeChain = ENV.IS_PRODUCTION ? base : baseSepolia;

export const publicClient = createPublicClient({
  chain: activeChain,
  transport: http(ENV.RPC_URL),
});

export {activeChain};
