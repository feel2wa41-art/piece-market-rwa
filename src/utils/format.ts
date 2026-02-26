export function formatCurrency(
  amount: number,
  currency: string = 'USD',
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'USD' ? 2 : 0,
  }).format(amount);
}

/** Format as USDC token amount (e.g. "1,234.56 USDC") */
export function formatUSDC(amount: number): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)} USDC`;
}

/** Format gas fee in ETH (Base L2 - very small amounts) */
export function formatGasFee(ethAmount: number = 0.000008): string {
  return `~${ethAmount.toFixed(6)} ETH`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function shortenAddress(address: string, chars: number = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
