import { Contract, ContractFactory } from "ethers";
import SeaweedIDOJson from "../artifacts/contracts/IDO/SeaweedIDO.sol/SeaweedIDO.json";
import IERC20Json from "../abis/erc20.abi.json";

export const SeaweedIDOAddress = "0xc5f3584Fb6541Bd541D3326e89D82cD4FF4180A1"

export const SeaweedIDO = ContractFactory.fromSolidity(SeaweedIDOJson);
export const IIDO = (signer?: any) => new Contract(SeaweedIDOAddress, SeaweedIDOJson.abi, signer);
export const IERC20 = (address: string) => new Contract(address, IERC20Json);
