import {publicClient} from './client';
import RWAFractionABI from './abi/RWAFraction.json';
import {CONTRACT_ADDRESSES} from '../../constants/contracts';

const contractAddress = CONTRACT_ADDRESSES.RWA_FRACTION as `0x${string}`;

export async function getFractionBalance(
  ownerAddress: `0x${string}`,
  tokenId: bigint,
): Promise<bigint> {
  const balance = await publicClient.readContract({
    address: contractAddress,
    abi: RWAFractionABI,
    functionName: 'balanceOf',
    args: [ownerAddress, tokenId],
  });
  return balance as bigint;
}

export async function getFractionTotalSupply(tokenId: bigint): Promise<bigint> {
  const supply = await publicClient.readContract({
    address: contractAddress,
    abi: RWAFractionABI,
    functionName: 'totalSupply',
    args: [tokenId],
  });
  return supply as bigint;
}

export async function getTokenURI(tokenId: bigint): Promise<string> {
  const uri = await publicClient.readContract({
    address: contractAddress,
    abi: RWAFractionABI,
    functionName: 'uri',
    args: [tokenId],
  });
  return uri as string;
}
