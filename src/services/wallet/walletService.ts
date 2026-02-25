import {encodeFunctionData} from 'viem';
import RWAFractionABI from '../blockchain/abi/RWAFraction.json';
import {CONTRACT_ADDRESSES, PAYMASTER_ADDRESS} from '../../constants/contracts';

export function encodePurchaseFraction(
  assetTokenId: bigint,
  quantity: bigint,
) {
  const data = encodeFunctionData({
    abi: RWAFractionABI,
    functionName: 'buy',
    args: [assetTokenId, quantity],
  });

  return {
    to: CONTRACT_ADDRESSES.RWA_FRACTION as `0x${string}`,
    data,
    paymaster: PAYMASTER_ADDRESS as `0x${string}`,
  };
}
