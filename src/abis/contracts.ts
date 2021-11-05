import { Contract, ContractFactory, utils } from "ethers";
import SeaweedIDOJson from "../artifacts/contracts/IDO/SeaweedIDO.sol/SeaweedIDO.json";
import LockingJson from "../artifacts/contracts/locking/Locking.sol/Locking.json";
import IERC20Json from "../abis/erc20.abi.json";

export const SeaweedIDOAddress = "0x9Ec67d3E0bd0B83C4C5b7eab6edb16fE394E7Efd"
export const MAX_VESTING_OCURRENCES = 16;

export const SeaweedIDO = ContractFactory.fromSolidity(SeaweedIDOJson);
export const LockingContract = ContractFactory.fromSolidity(LockingJson);
export const ILocking = (address: string, signer?: any) => new Contract(address, LockingJson.abi, signer);
export const IIDO = (signer?: any) => new Contract(SeaweedIDOAddress, SeaweedIDOJson.abi, signer);
export const IIDOInterface = new utils.Interface(SeaweedIDOJson.abi);
export const IERC20 = (address: string, signer?: any) => new Contract(address, IERC20Json, signer);