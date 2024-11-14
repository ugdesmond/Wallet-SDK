export interface BalancePayload {
  address: string;
  network: string;
  rpcUrl?: string;
  tokenAddress?: string;
}

export interface ContractPayload {
  rpcUrl: string;
  privateKey: string;
  contractAddress: string;
  abi?: any[];
}

export interface SignerPayload {
  rpcUrl: string;
  privateKey: string;
}

export interface TransferPayload {
  recipientAddress: string;
  amount: number;
  network: string;
  rpcUrl: string;
  privateKey: string;
  gasPrice?: string;
  tokenAddress?: string;
  nonce?: number;
  data?: string;
  gasLimit?: number;
  blockConfirmation?: number;
  fee?: number; // defaults to 10000
  subtractFee?: boolean; // defaults to false
}

export interface TransferTokenPayload {
  recipientAddress: string;
  amount: number;
  network: string;
  rpcUrl: string;
  tokenAddress?: string;
  privateKey: string;
  gasPrice?: string;
  nonce?: number;
  blockConfirmation?: number;
  data?: string;
  gasLimit?: number;
  fee?: number; // defaults to 10000
  subtractFee?: boolean; // defaults to false
}
export interface GetTransactionPayload {
  rpcUrl?: string;
  hash: string;
  network: string;
}
export interface GetTokenInfoPayload {
  network: string;
  rpcUrl: string;
  address: string;
  cluster?: 'mainnet-beta' | 'testnet' | 'devnet';
}

export interface TokenInfo {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  totalSupply: number;
  logoUrl?: string;
}

export interface SmartContractCallPayload {
  rpcUrl: string;
  network: string;
  contractAddress: string;
  method: string;
  methodType: 'read' | 'write';
  params: any[];
  payment?: any[];
  value?: number;
  contractAbi?: any[];
  gasPrice?: string;
  gasLimit?: number;
  nonce?: number;
  privateKey?: string;
}
