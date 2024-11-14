import * as bip39 from 'bip39';
import ethereumLogic from '../../business-logic/ethereumLogic';
import {
  BalancePayload,
  GetTokenInfoPayload,
  SmartContractCallPayload,
  TransferTokenPayload,
} from '../../business-logic/_types';
import { Constants } from '../../utils/constant';
import {
  CreateWalletPayload,
  GetAddressFromPrivateKeyPayload,
  GetTransactionPayload,
  MnemonicIndexPayload,
  WalletFromMnemonicPayload,
} from '../_types';

export function generateMnemonic(numWords: number = 12): string {
  const strength = (numWords / 3) * 32;

  return bip39.generateMnemonic(strength);
}

export function createWallet(args: CreateWalletPayload) {
  try {
    if (args.network === Constants.NETWORK.ETHEREUM) {
      return ethereumLogic.createWalletLogic(args.derivationPath);
    }
    throw new Error(args.network + Constants.NOT_SUPPORTED);
  } catch (error) {
    throw error;
  }
}

export function generateWalletFromMnemonic(args: WalletFromMnemonicPayload) {
  try {
    if (args.network === Constants.NETWORK.ETHEREUM) {
      return ethereumLogic.generateWalletFromMnemonicLogic(
        args.mnemonic,
        args.derivationPath
      );
    }
    throw new Error(args.network + Constants.NOT_SUPPORTED);
  } catch (error) {
    throw error;
  }
}

export function generateWalletFromMnemonicAndIndex(args: MnemonicIndexPayload) {
  try {
    if (args.network === Constants.NETWORK.ETHEREUM) {
      let derivationPath = Constants.DERIVATION_PATH.PATH;
      derivationPath = derivationPath.concat(args.index.toString());
      return ethereumLogic.generateWalletFromMnemonicLogic(
        args.mnemonic,
        derivationPath
      );
    }
    throw new Error(args.network + Constants.NOT_SUPPORTED);
  } catch (error) {
    throw error;
  }
}

export function getAddressFromPrivateKey(
  args: GetAddressFromPrivateKeyPayload
) {
  try {
    if (args.network === Constants.NETWORK.ETHEREUM) {
      return ethereumLogic.getAddressFromPrivateKeyLogic(
        args.privateKey,
        args.network
      );
    }
    throw new Error(args.network + Constants.NOT_SUPPORTED);
  } catch (error) {
    throw error;
  }
}

export async function getTokenBalance(args: BalancePayload) {
  try {
    if (args.network === Constants.NETWORK.ETHEREUM) {
      return await ethereumLogic.getUserTokenBalanceLogic({ ...args });
    }
    throw new Error(args.network + Constants.NOT_SUPPORTED);
  } catch (error) {
    throw error;
  }
}

export async function transfer(args: TransferTokenPayload) {
  try {
    if (args.network === Constants.NETWORK.ETHEREUM) {
      if (args?.tokenAddress)
        return await ethereumLogic.transferToken({ ...args });
      return await ethereumLogic.transferNativeToken({ ...args });
    }

    throw new Error(args.network + Constants.NOT_SUPPORTED);
  } catch (error) {
    throw error;
  }
}

export async function getTransaction(args: GetTransactionPayload) {
  try {
    if (args.network === Constants.NETWORK.ETHEREUM) {
      return await ethereumLogic.getTransactionLogic({ ...args });
    }

    throw new Error(args.network + Constants.NOT_SUPPORTED);
  } catch (error) {
    throw error;
  }
}

export async function getTokenInfo(args: GetTokenInfoPayload) {
  try {
    if (args.network === Constants.NETWORK.ETHEREUM) {
      return await ethereumLogic.getTokenInfoLogic({ ...args });
    }

    throw new Error(args.network + Constants.NOT_SUPPORTED);
  } catch (error) {
    throw error;
  }
}

export async function smartContractCall(args: SmartContractCallPayload) {
  try {
    if (args.network === Constants.NETWORK.ETHEREUM) {
      return await ethereumLogic.smartContractCallLogic({ ...args });
    }
    throw new Error(args.network + Constants.NOT_SUPPORTED);
  } catch (error) {
    throw error;
  }
}
