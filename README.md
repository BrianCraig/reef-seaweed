# SeaWeed

Open Source IDO Launcher for the REEF Platform.

## Try

run `yarn compile && yarn start`

## Build

run `yarn build`

## Contracts

The following are the Contracts that are used in the project and their intended needs.

### SeaweedAdmin

The role of this contract is to manage the approved Crowdsales to show on this platform. This doesn't interact with the IDO's, but ensures a curated list of them are available. This instance may be unique to the platform.

extends: 
  - [Ownable](https://docs.openzeppelin.com/contracts/4.x/api/access#Ownable)
  - [AccessControl](https://docs.openzeppelin.com/contracts/4.x/api/access#AccessControl)
  - [ApprovedEnnumerableCrowdsale](#approvedennumerablecrowdsale)

### ERC20Entangled

This is a [ERC20](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20) Token, which only the owner can mint tokens, it's intended to be Owned solely by the Crowdsale contract.

extends: 
  - [Ownable](https://docs.openzeppelin.com/contracts/4.x/api/access#Ownable)
  - [ERC20Burnable](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Burnable)
  - [ERC20OwnerMint](#erc20ownermint)

### WhitelistPublicStrategy

This is a whitelist strategy which always permits the buying.

implements: 
  - [IWhitelistStrategy](#iwhiteliststrategy)

## Solidity extensions

### ApprovedEnnumerableCrowdsale

Maintains a list of approved Crowdsale contracts. Anyone can `publish` but only `APPROVER` role can modify `approved` public list.

### ERC20OwnerMint

Makes the `owner` able to mint tokens.

## Solidity interfaces

### IWhitelistStrategy

Defines an algorithm for defining if an address is whitelisted.
