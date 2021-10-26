import { Contract, ContractFactory } from "ethers";
import BasicIDOJson from "../artifacts/contracts/IDO/BasicIDO.sol/BasicIdo.json";
import IIDOJson from "../artifacts/contracts/IDO/BasicIDO.sol/BasicIdo.json";
import IERC20Json from "../abis/erc20.abi.json";

export const BasicIDO = ContractFactory.fromSolidity(BasicIDOJson);
export const IIDO = (address: string) => new Contract(address, IIDOJson.abi);
export const IERC20 = (address: string) => new Contract(address, IERC20Json);
