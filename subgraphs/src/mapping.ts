import { log } from '@graphprotocol/graph-ts'
import { Minted } from "../generated/ERC721KnockOffs/ERC721KnockOffs"
import { ERC721OriginalContract, ERC721OriginalToken, ERC721KnockOffToken } from "../generated/schema"

export function handleMinted4(event: Minted): void {
    handleMinted(event, 4);
}

export function handleMinted5(event: Minted): void {
    handleMinted(event, 5);
}

export function handleMinted(event: Minted, chainID: i32): void {
    // create/update original contract
    log.debug("updating original contract", []);
    let originalContractID = chainID.toString() + "-" + event.params.originalContract.toHex();
    let originalContract = ERC721OriginalContract.load(originalContractID);
    if (originalContract == null) {
        log.info("creating new original contract with id {}", [originalContractID]);
        originalContract = new ERC721OriginalContract(originalContractID);
        originalContract.address = event.params.originalContract;
        originalContract.totalNumKnockOffs = 0;
        originalContract.chainID = chainID;
    }
    originalContract.totalNumKnockOffs += 1;
    originalContract.save();

    // create/update original token
    log.debug("updating original token", []);
    let originalTokenID = event.params.originalContract.toHex() + "-" + event.params.originalTokenID.toHex();
    let originalToken = ERC721OriginalToken.load(originalTokenID);
    if (originalToken == null) {
        log.info("creating new original token with id {}", [originalTokenID]);
        originalToken = new ERC721OriginalToken(originalTokenID);
        originalToken.contract = originalContract.id;
        originalToken.tokenID = event.params.originalTokenID;
        originalToken.numKnockOffs = 0;
    }
    originalToken.numKnockOffs += 1;
    originalToken.save();

    log.debug("updating knock off token", []);
    let knockOffTokenID = event.params.tokenID.toHex();
    let knockOffToken = ERC721KnockOffToken.load(knockOffTokenID);
    if (knockOffToken != null) {
        log.error("tried to insert duplicate knock off {}", [knockOffTokenID]);
        return;
    }

    log.info("creating new knock off with id {}", [knockOffTokenID]);
    knockOffToken = new ERC721KnockOffToken(knockOffTokenID);
    knockOffToken.tokenID = event.params.tokenID;
    knockOffToken.original = originalToken.id;
    knockOffToken.serialNumber = event.params.serialNumber.toI32();
    knockOffToken.timestamp = event.block.timestamp.toI32();
    knockOffToken.save();
}
