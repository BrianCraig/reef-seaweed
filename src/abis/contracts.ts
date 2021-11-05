import { Contract, ContractFactory, utils } from "ethers";
import SeaweedIDOJson from "../artifacts/contracts/IDO/SeaweedIDO.sol/SeaweedIDO.json";
import LockingJson from "../artifacts/contracts/locking/Locking.sol/Locking.json";
import IERC20Json from "../abis/erc20.abi.json";

export const MAX_VESTING_OCURRENCES = 16;

export const SeaweedIDO = ContractFactory.fromSolidity(SeaweedIDOJson);
export const LockingContract = ContractFactory.fromSolidity(LockingJson);
export const ILocking = (address: string, signer?: any) => new Contract(address, LockingJson.abi, signer);
export const IIDO = (address: string, signer?: any) => new Contract(address, SeaweedIDOJson.abi, signer);
export const IIDOInterface = new utils.Interface(SeaweedIDOJson.abi);
export const IERC20 = (address: string, signer?: any) => new Contract(address, IERC20Json, signer);