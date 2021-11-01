import { Contract, ContractFactory } from "ethers";
import SeaweedIDOJson from "../artifacts/contracts/IDO/SeaweedIDO.sol/SeaweedIDO.json";
import IERC20Json from "../abis/erc20.abi.json";

export const SeaweedIDO = ContractFactory.fromSolidity(SeaweedIDOJson);
export const IIDO = (address: string, signer?: any) => new Contract(address, SeaweedIDOJson.abi, signer);
export const IERC20 = (address: string) => new Contract(address, IERC20Json);
