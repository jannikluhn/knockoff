import { log, Address, BigInt } from "@graphprotocol/graph-ts";
import { KnockOffToken, OriginalContract } from "../generated/schema";
import { Minted, Transfer } from "../generated/ERC721KnockOffs/ERC721KnockOffs";
import {
  OriginalContract,
  OriginalToken,
  KnockOffToken,
} from "../generated/schema";
import { OriginalContract } from "../generated/schema";

export function handleMinted4(event: Minted): void {
  handleMinted(4, event);
}

export function handleMinted5(event: Minted): void {
  handleMinted(5, event);
}

function getContractID(
  prefix: string,
  chainID: i32,
  contractAddress: Address
): string {
  return prefix + "-" + chainID.toString() + "-" + contractAddress.toHex();
}

function getOriginalContractID(chainID: i32, contractAddress: Address): string {
  return getContractID("original", chainID, contractAddress);
}

function getTokenID(contractID: string, tokenID: BigInt): string {
  return contractID + "-" + tokenID.toHex();
}

function updateOriginalContract(chainID: i32, event: Minted): OriginalContract {
  let originalContractID = getOriginalContractID(
    chainID,
    event.params.originalContract
  );
  log.debug("updating original contract with id {}", [originalContractID]);
  let originalContract = OriginalContract.load(originalContractID);

  if (originalContract == null) {
    log.info("creating new original contract with id {}", [originalContractID]);
    originalContract = new OriginalContract(originalContractID);
    originalContract.type = "ERC721";
    originalContract.address = event.params.originalContract;
    originalContract.totalNumKnockOffs = 0;
    originalContract.chainID = chainID;
  }

  originalContract.totalNumKnockOffs += 1;
  originalContract.save();

  return originalContract as OriginalContract;
}

function updateOriginalToken(
  originalContract: OriginalContract,
  event: Minted
): OriginalToken {
  let originalTokenID = getTokenID(
    originalContract.id,
    event.params.originalTokenID
  );
  log.debug("updating original token with id {}", [originalTokenID]);
  let originalToken = OriginalToken.load(originalTokenID);

  if (originalToken == null) {
    log.info("creating new original token with id {}", [originalTokenID]);
    originalToken = new OriginalToken(originalTokenID);
    originalToken.contract = originalContract.id;
    originalToken.tokenID = event.params.originalTokenID;
    originalToken.numKnockOffs = 0;
  }

  originalToken.numKnockOffs += 1;
  originalToken.save();

  return originalToken as OriginalToken;
}

function createKnockOffToken(
  originalToken: OriginalToken,
  event: Minted
): KnockOffToken | null {
  let knockOffTokenID = event.params.tokenID.toHex();
  let knockOffToken = KnockOffToken.load(knockOffTokenID);
  if (knockOffToken != null) {
    log.error("tried to create duplicate knock off with id {}", [
      knockOffTokenID,
    ]);
    return null;
  }
  log.info("creating knockoff token with id {}", [knockOffTokenID]);

  let order = 1;
  let originalAsKnockOffID = event.params.originalTokenID.toHex();
  let originalAsKnockOff = KnockOffToken.load(originalAsKnockOffID);
  if (originalAsKnockOff != null) {
    order = originalAsKnockOff.order + 1;
  }

  log.info("creating new knock off with id {}", [knockOffTokenID]);
  knockOffToken = new KnockOffToken(knockOffTokenID);
  knockOffToken.tokenID = event.params.tokenID;
  knockOffToken.original = originalToken.id;
  knockOffToken.serialNumber = event.params.serialNumber.toI32();
  knockOffToken.mintTimestamp = event.block.timestamp.toI32();
  knockOffToken.order = order;
  knockOffToken.owner = event.params.receiver;
  knockOffToken.save();

  return knockOffToken;
}

export function handleMinted(chainID: i32, event: Minted): void {
  let originalContract = updateOriginalContract(chainID, event);
  let originalToken = updateOriginalToken(originalContract, event);
  createKnockOffToken(originalToken, event);
}

export function handleTransfer(event: Transfer): void {
  let id = event.params.tokenId.toHex();
  let token = KnockOffToken.load(id);
  if (token == null) {
    // For newly minted tokens, a Transfer event is emitted first, and only second a Minted
    // event. We only index the token in the Minted event handler which also sets the first
    // owner, so we don't have to do anything here.
    log.debug("ignoring transfer event for unknown token ", [id]);
    return;
  }

  log.info("transferring token [] from [] to []", [
    event.params.tokenId.toString(),
    token.owner.toHex(),
    event.params.to.toHex(),
  ]);
  token.owner = event.params.to;
  token.save();
}
