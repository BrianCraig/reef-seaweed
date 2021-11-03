import { Contract, ContractFactory } from "ethers";
import SeaweedIDOJson from "../artifacts/contracts/IDO/SeaweedIDO.sol/SeaweedIDO.json";
import IERC20Json from "../abis/erc20.abi.json";

export const SeaweedIDOAddress = "0x751c41f7d727af4Fda71d3E14cdEeabb0E287F64"

export const SeaweedIDO = ContractFactory.fromSolidity(SeaweedIDOJson);
export const IIDO = (signer?: any) => new Contract(SeaweedIDOAddress, SeaweedIDOJson.abi, signer);
export const IERC20 = (address: string) => new Contract(address, IERC20Json);
