import {
  createWallet,
  generateMnemonic,
  generateWalletFromMnemonic,
  generateWalletFromMnemonicAndIndex,
  getAddressFromPrivateKey,
  getTokenBalance,
  getTokenInfo,
  getTransaction,
  smartContractCall,
  transfer,
} from '../src';
import { convertToEthers } from '../src/utils';
import { Constants } from '../src/utils/constant';
describe('Konnadex ethereum test', () => {
  const derivationPath = "m/44'/60'/0'/0/1";
  const network = Constants.NETWORK.ETHEREUM;

  it('Generate mnemonic', () => {
    const mnemonic = generateMnemonic(12);
    expect(mnemonic.split(' ').length).toEqual(12);
  });

  it('Create wallet', () => {
    const wallet = createWallet({
      derivationPath,
      network,
    });

    expect(wallet).toEqual(
      expect.objectContaining({
        address: expect.any(String),
        privateKey: expect.any(String),
        mnemonic: expect.any(String),
        path: derivationPath,
        network,
      })
    );
  });

  it('Generate wallet from mnemonics', () => {
    const mnemonic =
      'brisk stereo flee capable tobacco nice brush ribbon giant dust face habit';
    const wallet = generateWalletFromMnemonic({
      mnemonic,
      derivationPath, // Leave empty to use default
      network,
    });

    expect(wallet).toEqual(
      expect.objectContaining({
        address: expect.any(String),
        privateKey: expect.any(String),
        mnemonic,
        path: derivationPath,
        network,
      })
    );
  });

  it('Generate wallet using index and mnemonics', () => {
    const mnemonic =
      'brisk stereo flee capable tobacco nice brush ribbon giant dust face habit';
    const wallet = generateWalletFromMnemonicAndIndex({
      mnemonic,
      index: 0,
      network,
    });

    expect(wallet).toEqual(
      expect.objectContaining({
        address: expect.any(String),
        privateKey: expect.any(String),
        mnemonic,
        path: expect.any(String),
        network,
      })
    );
  });

  it('Get address from private key', () => {
    let resultAddress = '0x3f5d53EB3cD50D4eFD9Cc9ae1f73097C4072f6f0';
    const address = getAddressFromPrivateKey({
      privateKey:
        '452833df01d8c11df506adcba330264c60673df43e3ecdd60ffc5ecfcbcac52f',
      network,
    });
    expect(address).toEqual(
      expect.objectContaining({
        address: resultAddress,
        network,
      })
    );
  });

  it('Get user ETH balance', async () => {
    const data = await getTokenBalance({
      address: '0x3f5d53EB3cD50D4eFD9Cc9ae1f73097C4072f6f0',
      network,
      rpcUrl: 'https://rpc.ankr.com/eth_goerli',
    });
    expect(data).toEqual(
      expect.objectContaining({
        balance: expect.any(Number),
      })
    );
  });

  it('getBalance ERC20 token balance', async () => {
    const data = await getTokenBalance({
      address: '0x3f5d53EB3cD50D4eFD9Cc9ae1f73097C4072f6f0',
      network,
      rpcUrl: 'https://rpc.ankr.com/eth_goerli',
      tokenAddress: '0x3c0c365b434a57132b2888e3e6021733d64a760c',
    });
    expect(data).toEqual(
      expect.objectContaining({
        balance: expect.any(Number),
      })
    );
  });

  it('Get transaction', async () => {
    const transaction = await getTransaction({
      rpcUrl: 'https://rpc-mumbai.maticvigil.com',
      hash:
        '0x458d676595a594c445298d7954c210fb15daae5ba01f62bbd36debad4d642d16',
      network: Constants.NETWORK.ETHEREUM,
    });

    expect(typeof transaction).toBe('object');
  });

  it('Transfer native token', async () => {
    const payload = {
      recipientAddress: '0x3f5d53EB3cD50D4eFD9Cc9ae1f73097C4072f6f0',
      amount: 0.0001,
      network: Constants.NETWORK.ETHEREUM,
      rpcUrl: 'https://rpc.ankr.com/eth_goerli',
      privateKey:
        '09bfd4eb31ffab0aed530d069abd1b19b89154833be3898bb7808f25e265331c',
    };
    const data = await transfer(payload);
    expect(typeof data).toBe('object');
    expect(convertToEthers(data.value, 18)).toEqual(payload.amount);
    expect(data).toEqual(
      expect.objectContaining({
        to: payload.recipientAddress,
      })
    );
  });

  it('Transfer ERC20 Token', async () => {
    const payload = {
      recipientAddress: '0x971aC8d3bc175391f83315f3464e028755061AA2',
      amount: 1,
      network: Constants.NETWORK.ETHEREUM,
      rpcUrl: 'https://rpc-mumbai.maticvigil.com',
      blockConfirmation: 10,
      privateKey:
        '452833df01d8c11df506adcba330264c60673df43e3ecdd60ffc5ecfcbcac52f',
      tokenAddress: '0xDf4537FFB40B3DDAA527c359f59039cE87716b0c',
    };

    const data = await transfer(payload);
    expect(typeof data).toBe('object');
    expect(data).toEqual(
      expect.objectContaining({
        to: payload.tokenAddress,
      })
    );
  });

  it('get ERC20 token info', async () => {
    const data = await getTokenInfo({
      address: '0xeD59FD52E192A829E653F44c7d6C812b485998F1',
      network,
      rpcUrl: 'https://rpc.ankr.com/eth_goerli',
    });
    expect(typeof data).toBe('object');
    expect(data).toEqual(
      expect.objectContaining({
        address: data?.address,
      })
    );
  });

  it('smart contract call (get token Balance)', async () => {
    const data = await smartContractCall({
      rpcUrl: 'https://rpc.ankr.com/eth_goerli',
      network,
      contractAddress: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
      method: 'balanceOf',
      methodType: 'read',
      params: ['0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22'],
    });

    expect(typeof data).toBe('object');
  });

  it('smart contract call (ERC20 token transfer)', async () => {
    const data = await smartContractCall({
      rpcUrl: 'https://rpc.ankr.com/eth_goerli',
      network,
      contractAddress: '0xeD59FD52E192A829E653F44c7d6C812b485998F1',
      method: 'transfer',
      methodType: 'write',
      params: [
        '0x3f5d53EB3cD50D4eFD9Cc9ae1f73097C4072f6f0',
        '1000000000000000000',
      ],
      contractAbi: [
        {
          constant: false,
          inputs: [
            { name: '_to', type: 'address' },
            { name: '_value', type: 'uint256' },
          ],
          name: 'transfer',
          outputs: [{ name: '', type: 'bool' }],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      privateKey:
        '452833df01d8c11df506adcba330264c60673df43e3ecdd60ffc5ecfcbcac52f',
      gasLimit: 60000,
    });

    expect(typeof data).toBe('object');
  });

  it('smart contract call (get factory Uniswap)', async () => {
    const data = await smartContractCall({
      rpcUrl: 'https://rpc.ankr.com/eth_goerli',
      network,
      contractAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      method: 'factory',
      methodType: 'read',
      params: [],
      contractAbi: [
        {
          inputs: [],
          name: 'factory',
          outputs: [{ internalType: 'address', name: '', type: 'address' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
    });

    expect(typeof data).toBe('object');
  });
});
