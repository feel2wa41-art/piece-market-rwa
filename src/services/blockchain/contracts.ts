import {getContract} from 'viem';
import {publicClient} from './client';
import RWAFractionABI from './abi/RWAFraction.json';
import {CONTRACT_ADDRESSES} from '../../constants/contracts';

export const rwaFractionContract = getContract({
  address: CONTRACT_ADDRESSES.RWA_FRACTION as `0x${string}`,
  abi: RWAFractionABI,
  client: publicClient,
});
