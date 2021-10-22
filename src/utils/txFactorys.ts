
import { Provider } from '@reef-defi/evm-provider';
import { AccountSigner } from '../utils/types';
import { ensure } from './utils';
import BN from "bn.js"

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
