import { log } from '@graphprotocol/graph-ts'
import { Minted } from "../generated/ERC721KnockOffs/ERC721KnockOffs"
import { OriginalContract, OriginalToken, KnockOffToken } from "../generated/schema"

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

    // create/update original token
    log.debug("updating original token", []);
    let originalTokenID = event.params.originalContract.toHex() + "-" + event.params.originalTokenID.toHex();
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

    log.debug("updating knock off token", []);
    let knockOffTokenID = event.params.tokenID.toHex();
    let knockOffToken = KnockOffToken.load(knockOffTokenID);
    if (knockOffToken != null) {
        log.error("tried to insert duplicate knock off {}", [knockOffTokenID]);
        return;
    }

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
    knockOffToken.save();
}
