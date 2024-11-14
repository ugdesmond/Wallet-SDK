export interface CreateWalletPayload {
  derivationPath?: string;
  cluster?: string;
  network: string;
}

export interface WalletFromMnemonicPayload {
  mnemonic: string;
  derivationPath?: string;
  cluster?: string;
  index?: number;
  network: string;
}

export interface MnemonicIndexPayload {
  mnemonic: string;
  cluster?: string;
  index: number;
  network: string;
}

export interface GetAddressFromPrivateKeyPayload {
  privateKey: string;
  network: string;
}
export interface GetTransactionPayload {
  rpcUrl?: string;
  hash: string;
  network: string;
}
