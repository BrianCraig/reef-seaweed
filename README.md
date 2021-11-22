# SeaWeed
<img src="./public/seaweed-purple.svg" alt="drawing" height="192"/>  

Open Source IDO Launcher for the REEF Platform.

See it live on [https://reefseaweed.netlify.app/](https://reefseaweed.netlify.app/)  

Check [features and tasks](./documentation/DEVELOPMENT.md) for this repository.  

## Try

run `yarn compile && yarn start`

## Build

run `yarn build`

## Stack

This project contains two parts:   
User interface:  
  - React Application
  - Typescript typings
  - [Chakra UI](https://chakra-ui.com/) design system
  - [@reef-defi/evm-provider.js](@reef-defi/evm-provider.js) web3 Provider
  - [Ethers.js](https://github.com/ethers-io/ethers.js) web3 interaction

Contracts:  
  - Solidity
  - Hardhat

## Services used

This projects uses the following services: 
  - Reef nodes, for storing and interacting with IDOs, Tokens and other contracts.
  - Reef graphql, for listening to events on contracts.
  - IPFS for storing and retrieving information like projects images and texts.

## Contracts

### SeaweedIDO

Contract for publishing IDO's, creating, minting and managing each respective Tokens, buying and paying to investors and owners.

### ERC20Entangled

mintable and burnable ERC20 Token, made for being deployed by the `SeaweedIDO` contract.

## Locking

Contract for locking an ERC20 Token, used mainly for whitelisting.