import { ethers } from 'ethers';
import { successResponse } from '../utils';
import { Constants } from '../utils/constant';
import provider from '../utils/crypt/ethers';
import {
  BalancePayload,
  ContractPayload,
  GetTokenInfoPayload,
  GetTransactionPayload,
  SignerPayload,
  SmartContractCallPayload,
  TokenInfo,
  TransferPayload,
  TransferTokenPayload,
} from './_types';
import erc20Abi from '../abis/erc20.json';

const createWalletLogic = (derivationPath?: string) => {
  const path = derivationPath || "m/44'/60'/0'/0/0";
  const wallet = ethers.Wallet.createRandom({
    path,
  });

  return successResponse({
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
    path: wallet.mnemonic.path,
    network: Constants.NETWORK.ETHEREUM,
  });
};

const generateWalletFromMnemonicLogic = (
  mnemonic: string,
  derivationPath?: string
) => {
  const path = derivationPath || Constants.DERIVATION_PATH.DEFAULT;
  const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);

  return successResponse({
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
    path: wallet.mnemonic.path,
    network: Constants.NETWORK.ETHEREUM,
  });
};

const getAddressFromPrivateKeyLogic = (privateKey: string, network: string) => {
  const wallet = new ethers.Wallet(privateKey);

  return successResponse({
    address: wallet.address,
    network,
  });
};

const getContractLogic = async ({
  contractAddress,
  rpcUrl,
  privateKey,
  abi,
}: ContractPayload) => {
  const providerInstance = provider(rpcUrl);
  const gasPrice = await providerInstance.getGasPrice();
  const gas = ethers.BigNumber.from(Constants.ETH_GAS_PRICE);

  const contractAbi = abi || erc20Abi;
  const signer = new ethers.Wallet(privateKey, providerInstance);
  const nonce = providerInstance.getTransactionCount(signer.getAddress());
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);

  return {
    contract,
    signer,
    gasPrice,
    gas,
    nonce,
    providerInstance,
  };
};

const getUserTokenBalanceLogic = async ({
  rpcUrl,
  tokenAddress,
  address,
}: BalancePayload) => {
  const providerInstance = provider(rpcUrl);
  let contract = null;
  if (tokenAddress)
    contract = new ethers.Contract(tokenAddress, erc20Abi, providerInstance);
  try {
    let userTokenbalance;
    if (contract) {
      const decimals = await contract.decimals();
      userTokenbalance = await contract.balanceOf(address);
      return successResponse({
        balance: parseFloat(
          ethers.utils.formatUnits(userTokenbalance, decimals)
        ),
      });
    }
    userTokenbalance = await providerInstance.getBalance(address);
    return successResponse({
      balance: parseFloat(ethers.utils.formatEther(userTokenbalance)),
    });
  } catch (error) {
    throw error;
  }
};

const getSignerDetail = async ({ rpcUrl, privateKey }: SignerPayload) => {
  const providerInstance = provider(rpcUrl);
  const gasPrice = await providerInstance.getGasPrice();
  const gas = ethers.BigNumber.from(Constants.ETH_GAS_PRICE);
  const signer = new ethers.Wallet(privateKey, providerInstance);
  const nonce = providerInstance.getTransactionCount(signer.getAddress());

  return {
    signer,
    gasPrice,
    gas,
    nonce,
    providerInstance,
  };
};

const transferNativeToken = async ({
  privateKey,
  rpcUrl,
  ...args
}: TransferTokenPayload) => {
  const { gasPrice, nonce, signer } = await getSignerDetail({
    rpcUrl,
    privateKey,
  });

  try {
    const tx = await signer.sendTransaction({
      to: args.recipientAddress,
      value: ethers.utils.parseEther(args.amount.toString()),
      gasPrice: args.gasPrice
        ? ethers.utils.parseUnits(args.gasPrice.toString(), Constants.GWEI)
        : gasPrice,
      nonce: args.nonce || nonce,
      data: args.data
        ? ethers.utils.hexlify(ethers.utils.toUtf8Bytes(args.data as string))
        : '0x',
    });
    if (args.blockConfirmation) tx.wait(args.blockConfirmation);
    return successResponse({
      ...tx,
    });
  } catch (error) {
    throw error;
  }
};

const getTransactionLogic = async ({ hash, rpcUrl }: GetTransactionPayload) => {
  const providerInstance = provider(rpcUrl);

  try {
    const tx = await providerInstance.getTransaction(hash);
    return successResponse({
      ...tx,
    });
  } catch (error) {
    throw error;
  }
};

const transferToken = async ({
  privateKey,
  rpcUrl,
  tokenAddress,
  ...args
}: TransferPayload) => {
  if (!tokenAddress) throw new Error('Token address required');
  const { contract, gasPrice, nonce } = await getContractLogic({
    rpcUrl,
    privateKey,
    contractAddress: tokenAddress,
  });

  try {
    const decimals = await contract.decimals();

    const estimatedGas = await contract.estimateGas.transfer(
      args.recipientAddress,
      ethers.utils.parseUnits(args.amount.toString(), decimals)
    );
    const tx = await contract.transfer(
      args.recipientAddress,
      ethers.utils.parseUnits(args.amount.toString(), decimals),
      {
        gasPrice: args.gasPrice
          ? ethers.utils.parseUnits(args.gasPrice.toString(), Constants.GWEI)
          : gasPrice,
        nonce: args.nonce || nonce,
        gasLimit: args.gasLimit || estimatedGas,
      }
    );
    if (args.blockConfirmation) {
      tx.wait(args.blockConfirmation);
    }

    return successResponse({
      ...tx,
    });
  } catch (error) {
    throw error;
  }
};

const getTokenInfoLogic = async ({ address, rpcUrl }: GetTokenInfoPayload) => {
  const providerInstance = provider(rpcUrl);
  const contract = new ethers.Contract(address, erc20Abi, providerInstance);

  if (contract) {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply(),
    ]);

    const data: TokenInfo = {
      name,
      symbol,
      decimals,
      address: contract.address,
      totalSupply: parseInt(ethers.utils.formatUnits(totalSupply, decimals)),
    };
    return successResponse({ ...data });
  }
  return;
};

const smartContractCallGetLogic = async (args: SmartContractCallPayload) => {
  try {
    const providerInstance = provider(args.rpcUrl);
    const contractAbi = args.contractAbi || erc20Abi;
    const { contract } = new ethers.Contract(
      args.contractAddress,
      contractAbi,
      providerInstance
    );
    let tx;
    let overrides = {} as any;

    if (args.gasLimit) {
      overrides.gasLimit = args.gasLimit;
    }

    if (args.params.length > 0) {
      tx = await contract?.[args.method](...args.params, overrides);
    } else {
      tx = await contract?.[args.method](overrides);
    }

    return successResponse({
      data: tx,
    });
  } catch (error) {
    throw error;
  }
};

const smartContractCallPostLogic = async (args: SmartContractCallPayload) => {
  if (!args.privateKey) throw new Error('Private key required');
  const { contract, gasPrice, nonce } = await getContractLogic({
    rpcUrl: args.rpcUrl,
    contractAddress: args.contractAddress,
    abi: args.contractAbi,
    privateKey: args.privateKey,
  });

  try {
    let tx;
    let overrides = {} as any;
    overrides = {
      gasPrice: args.gasPrice
        ? ethers.utils.parseUnits(args.gasPrice, Constants.GWEI)
        : gasPrice,
      nonce: args.nonce || nonce,
      value: args.value ? ethers.utils.parseEther(args.value.toString()) : 0,
    };

    if (args.gasLimit) {
      overrides.gasLimit = args.gasLimit;
    }

    if (args.params.length > 0) {
      tx = await contract?.[args.method](...args.params, overrides);
    } else {
      tx = await contract?.[args.method](overrides);
    }

    return successResponse({
      data: tx,
    });
  } catch (error) {
    throw error;
  }
};

const smartContractCallLogic = async (args: SmartContractCallPayload) => {
  if (args.methodType === Constants.ACTION_TYPE.WRITE) {
    return smartContractCallPostLogic(args);
  }
  return smartContractCallGetLogic(args);
};

export default {
  createWalletLogic,
  generateWalletFromMnemonicLogic,
  getAddressFromPrivateKeyLogic,
  getUserTokenBalanceLogic,
  transferNativeToken,
  getTransactionLogic,
  transferToken,
  getTokenInfoLogic,
  smartContractCallLogic,
};
