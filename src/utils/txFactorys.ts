
import { Provider } from '@reef-defi/evm-provider';
import { AccountSigner, PublishValues } from '../utils/types';
import { ensure, ratioToMulDiv } from './utils';
import BN from "bn.js"
import { utils } from "ethers";

export enum FieldType {
  Address,
  Amount,
  Text
}

interface Field {
  type: FieldType,
  name: string
}

export interface TxType {
  title: string
  fields: Field[]
  action: (params: TxDeploy) => Promise<any>
}

export interface TxParams {
  type: TxType,
  args: any
}

export interface TxFactory extends TxParams {
  provider: Provider,
  signer: AccountSigner
}

interface TxDeploy extends TxFactory {
  params: any
}

export const ClaimEvmTx: TxType = {
  title: "Claim Evm",
  fields: [],
  action: async ({ signer }) => {
    const hasEvmAddress = await signer.signer.isClaimed();
    ensure(!hasEvmAddress, 'Account already has EVM address!');
    await signer.signer.claimDefaultAccount();
  }
}

export const TransferTx: TxType = {
  title: "Transfer REEF",
  fields: [
    {
      name: "address",
      type: FieldType.Address
    },
    {
      name: "quantity",
      type: FieldType.Amount
    }
  ],
  action: async ({ signer, provider, params: { quantity, address } }) => {
    let q = new BN((parseFloat(quantity) * 1e5).toFixed(0)).mul(new BN("10000000000000"));
    let unsub = await provider.api.tx.balances
      .transfer(address, q)
      .signAndSend(signer.address, ({ events = [], status }) => {
        console.log(`Current status is ${status.type}`);
        if (status.isFinalized) {
          console.log(`Transaction included at blockHash ${status.asFinalized}`);
          events.forEach(({ phase, event: { data, method, section } }) => {
            console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
          });

          unsub();
        }
      });
  }
}

export const SendERC20TX: TxType = {
  title: "Send ERC20 Tokens",
  fields: [
    {
      name: "address",
      type: FieldType.Address
    },
    {
      name: "quantity",
      type: FieldType.Amount
    }
  ],
  action: async ({ params: { quantity, address }, args: { contract } }) => {
    await contract.transfer(address, utils.parseEther(quantity));
  }
}

export const ApproveERC20TX: TxType = {
  title: "Approve ERC20 Tokens Usage",
  fields: [
    {
      name: "address",
      type: FieldType.Address
    },
    {
      name: "quantity",
      type: FieldType.Amount
    }
  ],
  action: async ({ params: { quantity, address }, args: { contract } }) => {
    await contract.approve(address, utils.parseEther(quantity));
  }
}

export const ContractStackingMockTX: TxType = {
  title: "Deploy Mock Stacking Contract",
  fields: [
    {
      name: "address",
      type: FieldType.Address
    }
  ],
  action: async ({ params: { address }, args: { contract } }) => {
    console.log(await contract.deploy(address));
  }
}

export const ContractERC20TX: TxType = {
  title: "Deploy ERC20 Contract",
  fields: [
    {
      name: "name",
      type: FieldType.Address
    },
    {
      name: "symbol",
      type: FieldType.Address
    },
    {
      name: "balance",
      type: FieldType.Address
    }
  ],
  action: async ({ params: { name, symbol, balance }, args: { contract } }) => {
    console.log(await contract.deploy(name, symbol, utils.parseEther(balance)));
  }
}

/*
  address tokenAddress,
  uint32 multiplier,
  uint32 divider,
  uint256 ipfs,
  uint256 startTimestamp,
  uint256 endTimestamp,
  uint256 maxSoldBaseAmount
*/

export const ContractBasicIDOTX: TxType = {
  title: "Deploy Basic IDO Contract",
  fields: [
    {
      name: "tokenAddress",
      type: FieldType.Address
    },
    {
      name: "ratio",
      type: FieldType.Amount
    },
    {
      name: "start",
      type: FieldType.Amount
    },
    {
      name: "end",
      type: FieldType.Amount
    },
    {
      name: "baseAmount",
      type: FieldType.Amount
    }
  ],
  action: async ({ params: { tokenAddress, ratio, start, end, baseAmount }, args: { contract, onSuccess } }) => {
    let [mul, div] = ratioToMulDiv(parseFloat(ratio));
    let timestampNow = Math.floor(Date.now() / 1000);
    let { address } = await contract.deploy(tokenAddress, mul, div, 1, timestampNow + parseInt(start), timestampNow + parseInt(end), utils.parseEther(baseAmount));
    onSuccess(address);
  }
}

export const StakeTX: TxType = {
  title: "Stack",
  fields: [
    {
      name: "quantity",
      type: FieldType.Amount
    }
  ],
  action: async ({ params: { quantity }, args: { contract } }) => {
    console.log(await contract.enterStaking(utils.parseEther(quantity)));
  }
}

export const WithdrawTX: TxType = {
  title: "Withdraw",
  fields: [
    {
      name: "quantity",
      type: FieldType.Amount
    }
  ],
  action: async ({ params: { quantity }, args: { contract } }) => {
    console.log(await contract.leaveStaking(utils.parseEther(quantity)));
  }
}

let timestampFromDate = (date: Date) => Math.floor(date.valueOf() / 1000);

export const ContractBasicIDOAction = async (contract: any, { tokenName, tokenSymbol, reefAmount, reefMultiplier, start, end }: PublishValues) => {
  let [mul, div] = ratioToMulDiv(reefMultiplier);
  let { address } = await contract.deploy(tokenName, tokenSymbol, mul, div, timestampFromDate(new Date(start)), timestampFromDate(new Date(end)), utils.parseEther(reefAmount.toString()));
  return address;
}