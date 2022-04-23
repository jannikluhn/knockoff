import { log, Address, BigInt } from "@graphprotocol/graph-ts";
import { KnockOffToken, OriginalContract } from "../generated/schema";
import { Minted, Transfer } from "../generated/ERC721KnockOffs/ERC721KnockOffs";
import {
  OriginalContract,
  OriginalToken,
  KnockOffToken,
  KnockOffContract,
} from "../generated/schema";
import { OriginalContract } from "../generated/schema";
import { OriginalToken } from "../generated/schema";

export function handleMinted1(event: Minted): void {
  handleMinted(1, event);
}

export function handleMinted5(event: Minted): void {
  handleMinted(5, event);
}

export function handleMinted100(event: Minted): void {
  handleMinted(100, event);
}

export function handleMinted137(event: Minted): void {
  handleMinted(137, event);
}

export function handleMinted42161(event: Minted): void {
  handleMinted(42161, event);
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

function getKnockOffContractID(chainID: i32, contractAddress: Address): string {
  return getContractID("knockoff", chainID, contractAddress);
}

function getTokenID(contractID: string, tokenID: BigInt): string {
  return contractID + "-" + tokenID.toString();
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

function updateKnockOffContract(chainID: i32, event: Minted): KnockOffContract {
  let knockOffContractID = getKnockOffContractID(chainID, event.address);
  log.debug("updating knockoff contract with id {}", [knockOffContractID]);
  let knockOffContract = KnockOffContract.load(knockOffContractID);

  if (knockOffContract == null) {
    log.info("creating new knockoff contract with id {}", [knockOffContractID]);
    knockOffContract = new KnockOffContract(knockOffContractID);
    knockOffContract.type = "ERC721";
    knockOffContract.address = event.address;
    knockOffContract.chainID = chainID;
    knockOffContract.totalNumTokens = 0;
  }

  knockOffContract.totalNumTokens += 1;
  knockOffContract.save();

  return knockOffContract as KnockOffContract;
}

function getAncestorSerialNumbers(
  knockOffContract: KnockOffContract,
  originalContract: OriginalContract,
  originalToken: OriginalToken
): Array<i32> {
  let originalAsKnockOffContractID = getKnockOffContractID(
    knockOffContract.chainID,
    originalContract.address as Address
  );
  let originalAsKnockOffContract = KnockOffContract.load(
    originalAsKnockOffContractID
  );

  let serials: Array<i32> = [];
  if (originalAsKnockOffContract != null) {
    let originalAsKnockOffTokenID = getTokenID(
      originalAsKnockOffContract.id,
      originalToken.tokenID
    );
    let originalAsKnockOffToken = KnockOffToken.load(originalAsKnockOffTokenID);
    if (originalAsKnockOffToken == null) {
      log.critical("original {} is knockoff, but not indexed", [
        originalAsKnockOffToken.id,
      ]);
    }

    let originalAncestorSerials: Array<i32> =
      originalAsKnockOffToken.ancestorSerialNumbers;
    for (let i = 0; i < originalAncestorSerials.length; i++) {
      serials.push(originalAncestorSerials[i]);
    }
    serials.push(originalAsKnockOffToken.serialNumber);
  }

  return serials;
}

function createKnockOffToken(
  knockOffContract: KnockOffContract,
  originalContract: OriginalContract,
  originalToken: OriginalToken,
  event: Minted
): KnockOffToken | null {
  let knockOffTokenID = getTokenID(knockOffContract.id, event.params.tokenID);
  let knockOffToken = KnockOffToken.load(knockOffTokenID);
  if (knockOffToken != null) {
    log.error("tried to create duplicate knockoff with id {}", [
      knockOffTokenID,
    ]);
    return null;
  }
  log.info("creating knockoff token with id {}", [knockOffTokenID]);

  knockOffToken = new KnockOffToken(knockOffTokenID);
  knockOffToken.contract = knockOffContract.id;
  knockOffToken.tokenID = event.params.tokenID;

  knockOffToken.original = originalToken.id;
  knockOffToken.serialNumber = event.params.serialNumber.toI32();
  knockOffToken.ancestorSerialNumbers = getAncestorSerialNumbers(
    knockOffContract,
    originalContract,
    originalToken
  );

  knockOffToken.mintTimestamp = event.block.timestamp.toI32();
  knockOffToken.owner = event.params.receiver;

  knockOffToken.save();

  return knockOffToken;
}

export function handleMinted(chainID: i32, event: Minted): void {
  let originalContract = updateOriginalContract(chainID, event);
  let originalToken = updateOriginalToken(originalContract, event);
  let knockOffContract = updateKnockOffContract(chainID, event);
  createKnockOffToken(knockOffContract, originalContract, originalToken, event);
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
