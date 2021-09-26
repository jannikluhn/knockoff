import { ethers } from "ethers";
import IERC165ABI from "./assets/IERC165ABI.json";
import IERC721ABI from "./assets/IERC721ABI.json";
import IERC721MetadataABI from "./assets/IERC721MetadataABI.json";
import ERC721KnockOffsABI from "./assets/ERC721KnockOffsABI.json";

const interfaceIDs = {
  IERC165: "0x01ffc9a7",
  NotIERC165: "0xffffffff",
  IERC721: "0x80ac58cd",
  IERC721Metadata: "0x5b5e139f",
};

const contractFactories = {
  IERC165: new ethers.ContractFactory(IERC165ABI, ""),
  IERC721: new ethers.ContractFactory(IERC721ABI, ""),
  IERC721Metadata: new ethers.ContractFactory(IERC721MetadataABI, ""),
  ERC721KnockOffs: new ethers.ContractFactory(ERC721KnockOffsABI, ""),
};

export { interfaceIDs, contractFactories };
