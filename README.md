# Konnadex Crypto Wallet

Konnadex multichain crypto wallet library that supports ETHEREUM other EVM compatible blockchains E.g. Binance Smart Chain, Polygon, Avalanche etc.

[![Build](https://img.shields.io/github/workflow/status/konnadex/crypto-wallet/CI)](https://github.com/konnadex/crypto-wallet)
[![Version](https://img.shields.io/npm/v/konnadex-crypto-wallet)](https://github.com/konnadex/crypto-wallet)
[![GitHub issues](https://img.shields.io/github/issues/konnadex/crypto-wallet)](https://github.com/konnadex/crypto-wallet)
[![GitHub stars](https://img.shields.io/github/stars/konnadex/crypto-wallet)](https://github.com/konnadex/crypto-wallet)
[![GitHub license](https://img.shields.io/github/license/konnadex/crypto-wallet)](https://github.com/konnadex/crypto-wallet)
[![Total Downloads](https://img.shields.io/npm/dm/konnadex-crypto-wallet)](https://github.com/konnadex/crypto-wallet)

## Installation

```bash
npm install konnadex-crypto-wallet
```

Using yarn,

```bash
yarn add konnadex-crypto-wallet
```

## Usage

### Javascript

```javascript
const konnadexWallet = require('konnadex-crypto-wallet');
```

### TypeScript

```typescript
import konnadexWallet from 'konnadex-crypto-wallet';
```

## Methods

The following methods are available with this SDK:

- [Konnadex Crypto Wallet](#konnadex-crypto-wallet)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Javascript](#javascript)
    - [TypeScript](#typescript)
  - [Methods](#methods)
    - [Generate mnemonic](#generate-mnemonic)
      - [Response](#response)
    - [Create Wallet](#create-wallet)
      - [Response](#response)
    - [Get Balance](#get-balance)
      - [Native coins](#native-coins)
      - [Tokens](#tokens)
      - [Response](#response-1)
    - [Generate Wallet from Mnemonic](#generate-wallet-from-mnemonic)
      - [Response](#response-2)
    - [Get Address from Private Key](#get-address-from-private-key)
      - [Response](#response-3)
    - [Get Transaction](#get-transaction)
      - [Response](#response-4)
    - [Transfer](#transfer)
      - [ETHEREUM Network](#ETHEREUM-network)
      - [Response](#response-5)
    - [Token Info](#token-info)
      - [Get ERC20 Token Info](#get-erc20-token-info)
      - [Response](#response-11)
    - [Smart Contract Call](#smart-contract-call)
      - [ETHEREUM network](#ETHEREUM-network-1)

### Generate mnemonic

This method is used to generate mnemonic. Default number of words is `12` but you can pass a number param if you want to generate more or less.

```javascript
const mnemonic = konnadexWallet.generateMnemonic();

// Note: Mnemonics with less than 12 words have low entropy and may be guessed by an attacker.
```

#### Response

```javascript
net idle lava mango another capable inhale portion blossom fluid discover cruise
```

### Create Wallet

This method creates a new wallet. The method accepts a payload object as the parameter. The parameter of this payload is:

```javascript
// Creating an ETHEREUM wallet.
const wallet = konnadexWallet.createWallet({
  derivationPath: "m/44'/60'/0'/0/0", // Leave empty to use default derivation path
  network: 'ETHEREUM',
}); // NOTE - Address generated will work for EVM compatible blockchains E.g. Binance smart chain, Polygon etc
```

#### Response

```javascript
{
  address: '0xfBE11AC0258cc8288cA24E818691Eb062f7042E9',
  privateKey: '0xfdf745f45d1942feea79b4c0a3fc1ca67da366899f7e6cebaa06496806ca8127',
  mnemonic: 'net idle lava mango another capable inhale portion blossom fluid discover cruise'
}
```

### Get Balance

This gets the balance of the address passed in. The method accepts an object as the parameter.
The parameters for this object depending on the kind of balance to be gotten is in the form:

#### Native coins

```javascript
// Get the ETH balance of an address.
const data = await konnadexWallet.getTokenBalance({
  address: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
  network: 'ETHEREUM',
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
}); // NOTE - For otherEVM compatible blockchains all you have to do is change the rpcUrl.
```

#### Tokens

```javascript
// Get the balance of an ERC20 token.
const data = await konnadexWallet.getTokenBalance({
  address: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
  network: 'ETHEREUM',
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
  tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
}); // NOTE - For other EVM compatible blockchains all you have to do is change the rpcUrl
```

#### Response

```javascript
{
  balance: 2;
}
```

### Generate Wallet from Mnemonic

This generates a wallet from Mnemonic phrase. The method accepts an object as the parameter. The parameters that this object takes are:

```javascript
// Generate an ETHEREUM wallet from mnemonic.
const wallet = konnadexWallet.generateWalletFromMnemonic({
  mnemonic:
    'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
  derivationPath: "m/44'/60'/0'/0/0", // Leave empty to use default derivation path
  network: 'ETHEREUM',
}); // NOTE - Address generated will work for EVM compatible blockchains E.g. Binance smart chain, Polygon etc
```

#### Response

```javascript
{
  address: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
  privateKey: '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
  mnemonic: 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'
}
```

This generates a wallet from Mnemonic phrase and Index. The method accepts an object as the parameter. The parameters that this object takes are:

```javascript
// Generate an ETHEREUM wallet from mnemonic.
const wallet = konnadexWallet.generateWalletFromMnemonic({
  mnemonic:
    'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
  derivationPath: "m/44'/60'/0'/0/0", // Leave empty to use default derivation path
  network: 'ETHEREUM',
  index: 0,
}); // NOTE - Address generated will work for EVM compatible blockchains E.g. Binance smart chain, Polygon etc
```

#### Response

```javascript
{
  address: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
  privateKey: '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
  mnemonic: 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
  path :"m/44'/60'/0'/0/0"
}
```

This gets the address from the private key passed in. The method accepts an object as the parameter. The parameters that this object takes are:

```javascript
// Get the address from the private key on the ETHEREUM network.
const address = konnadexWallet.getAddressFromPrivateKey({
  privateKey:
    '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
  network: 'ETHEREUM',
});
```

#### Response

```javascript
{
  address: '0x1C082D1052fb44134a408651c01148aDBFcCe7Fe';
}
```

### Get Transaction

This gets the transaction receipt of a transaction from the transaction hash. The method accepts an object as the parameter. The parameters that this object takes are:

```javascript
// Get the transaction receipt on ETHEREUM network.
const receipt = await konnadexWallet.getTransaction({
  hash: '0x5a90cea37e3a5dbee6e10190ff5a3769ad27a0c6f625458682104e26e0491055',
  network: 'ETHEREUM',
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
}); // NOTE - For other EVM compatible blockchains all you have to do is change the rpcUrl.
```

#### Response

```javascript
{
  object;
}
```

### Transfer

This transfers the amount of tokens from the source address to the destination address It takes in an object as the parameter. It allows for the transfer of the following:

#### ETHEREUM Network

Allows for the transfer of ETH, and overriding of transactions.

```javascript
// Transferring ETH from one address to another.
const transfer = await konnadexWallet.transfer({
  recipientAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
  amount: 1,
  network: 'ETHEREUM',
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
  privateKey:
    '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
  gasPrice: '10', // Gas price is in Gwei. Leave empty to use default gas price
  data: 'Money for transportation', // Send a message
}); // NOTE - For other EVM compatible blockchains all you have to do is change the rpcUrl.

// Transferring ERC20 tokens from one address to another.
const transfer = await konnadexWallet.transfer({
  recipientAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
  amount: 10,
  network: 'ETHEREUM',
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
  privateKey:
    '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
  gasPrice: '10', // Gas price is in Gwei. leave empty to use default gas price
  tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
}); // NOTE - For other EVM compatible blockchains all you have to do is change the rpcUrl.
```

The optional parameters that the object takes in are: gas price, nonce, and data.

- The gas price is the price of gas in Gwei. The higher the gas price, the faster the transaction will be. It's best to use a higher gas price than the default.
- The nonce is the number of transactions that have been sent from the source address and is used to ensure that the transaction is unique. The transaction is unique because the nonce is incremented each time a transaction is sent.
- The data is a string parameter used to pass across a message through the transaction. Can only be used on transfer of ETH.

```javascript
// Overriding pending ETH transaction.
const transfer = await konnadexWallet.transfer({
  recipientAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
  amount: 0,
  network: 'ETHEREUM',
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
  privateKey:
    '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
  gasPrice: '10',
  nonce: 1, // The pending transaction nonce
  data: 'Money for feeding', // Send a message
});

// Overriding ERC20 token pending transaction.
const transfer = await konnadexWallet.transfer({
  recipientAddress: '0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22',
  amount: 0,
  network: 'ETHEREUM',
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
  privateKey:
    '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
  gasPrice: '10',
  tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  nonce: 1, // The pending transaction nonce
});
```

#### Response

```javascript
{
  hash: '3nGq2yczqCpm8bF2dyvdPtXpnFLJ1oGWkDfD6neLbRay8SjNqYNhWQBKE1ZFunxvFhJ47FyT6igNpYPP293jXCZk';
}
```

### Token Info

#### Get ERC20 Token Info

Allows for fetching ERC20 tokens info from compatible blockchains by the token address

```javascript
// getting token info.

const info = await konnadexWallet.getTokenInfo({
  address: '0xeD59FD52E192A829E653F44c7d6C812b485998F1',
  network: 'ETHEREUM',
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
}); // NOTE - For other EVM compatible blockchains all you have to do is change the rpcUrl.
```

#### Response

```javascript
{
  name: 'WUSDT',
  symbol: 'Wrapped USDT',
  decimals: 18,
  address: '0xeD59FD52E192A829E653F44c7d6C812b485998F1',
  totalSupply: 5000
}
```

## Smart Contract Call

This can be used to make custom smart contract interaction by specifying the contract ABI and function types.

#### ETHEREUM network

```javascript
// Calling a write smart contract function.
const data = await konnadexWallet.smartContractCall({
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
  network: 'ETHEREUM',
  contractAddress: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
  method: 'transfer',
  methodType: 'write',
  params: ['0x2455eC6700092991Ce0782365A89d5Cd89c8Fa22', '1000000000000000000'],
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
    '0f9e5c0bee6c7d06b95204ca22dea8d7f89bb04e8527a2c59e134d185d9af8ad',
}); // NOTE - For other EVM compatible blockchains all you have to do is change the rpcUrl.

// calling a read smart contract function.
const data = await konnadexWallet.smartContractCall({
  rpcUrl: 'https://rpc.ankr.com/eth_goerli',
  network: 'ETHEREUM',
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
}); // NOTE - For other EVM compatible blockchains all you have to do is change the rpcUrl.
```

#### Response

```javascript
{
  data: object;
}
```

## Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Jest

Jest tests are set up to run with `npm test` or `yarn test`.

### Bundle Analysis

[`size-limit`](https://github.com/ai/size-limit) is set up to calculate the real cost of your library with `npm run size` and visualize the bundle with `npm run analyze`.

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant) and [warning](https://github.com/palmerhq/tsdx#warning) functions.
