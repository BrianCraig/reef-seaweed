import { Contract, ContractFactory, utils } from "ethers";
import SeaweedIDOJson from "../artifacts/contracts/IDO/SeaweedIDO.sol/SeaweedIDO.json";
import IERC20Json from "../abis/erc20.abi.json";

export const SeaweedIDOAddress = "0x570Ad58C48753340C626B106FC3721FCf85BA243"
export const MAX_VESTING_OCURRENCES = 16;

export const SeaweedIDO = ContractFactory.fromSolidity(SeaweedIDOJson);
export const IIDO = (signer?: any) => new Contract(SeaweedIDOAddress, SeaweedIDOJson.abi, signer);
export const IIDOInterface = new utils.Interface(SeaweedIDOJson.abi);
export const IERC20 = (address: string) => new Contract(address, IERC20Json);
