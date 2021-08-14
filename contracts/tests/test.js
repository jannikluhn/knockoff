const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC721KnockOffs", function () {
  let ERC721KnockOffs;
  let TestEmptyContract;
  let TestERC721;

  let c;
  let emptyContract;
  let erc721;

  let signers;
  let addresses;
  let a;

  beforeEach(async () => {
    signers = await ethers.getSigners();

    addresses = [];
    for (const s of signers) {
      addresses.push(await s.getAddress());
    }

    a = addresses[0];
    a0 = addresses[0];
    a1 = addresses[1];
  });

  beforeEach(async () => {
    ERC721KnockOffs = await ethers.getContractFactory("ERC721KnockOffs");
    TestEmptyContract = await ethers.getContractFactory("TestEmptyContract");
    TestERC721 = await ethers.getContractFactory("TestERC721");

    [c, emptyContract, erc721] = await Promise.all([
      ERC721KnockOffs.deploy(),
      TestEmptyContract.deploy(),
      TestERC721.deploy(),
    ]);
    await c.deployed();
    await emptyContract.deployed();
    await erc721.deployed();
  });

  it("Should have zero tokens after deployment", async () => {
    expect(await c.totalSupply()).to.be.equal(0);
  });

  it("Should refuse to mint token for nonexistant original contract", async () => {
    await expect(c.mint(a, ethers.constants.AddressZero, 0)).to.be.reverted;
  });

  it("Should refuse to mint token for non erc721 original contract", async () => {
    await expect(c.mint(a, emptyContract.address, 0)).to.be.reverted;
  });

  it("Should refuse to mint token for nonexistant original", async () => {
    await expect(c.mint(a, erc721.address, 0)).to.be.reverted;
  });

  it("Should allow minting token", async () => {
    await erc721.mint(a, 0);
    const tx = await c.mint(a, erc721.address, 0);
    const expectedTokenID = await c.originalID(erc721.address, 0);
    expect(tx)
      .to.emit(c, "Minted")
      .withArgs(erc721.address, 0, a, expectedTokenID, 0);
    expect(await c.serialNumbers(expectedTokenID)).to.equal(0);
    expect(await c.exists(expectedTokenID)).to.be.true;

    const original = await c.originalForToken(expectedTokenID);
    expect(original[0]).to.equal(0);
    expect(original[1]).to.equal(erc721.address);
    expect(original[2]).to.equal(1);
  });

  it("Should allow copying token twice", async () => {
    await erc721.mint(a, 0);
    await c.mint(a, erc721.address, 0);
    await c.mint(a, erc721.address, 0);

    expect(await c.totalSupply()).to.equal(2);
    const t1 = await c.tokenByIndex(0);
    const t2 = await c.tokenByIndex(1);
    expect(t2).to.equal(t1.add(1));

    expect(await c.serialNumbers(t1)).to.equal(0);
    expect(await c.serialNumbers(t2)).to.equal(1);

    const oid1 = await c.originalIDForToken(t1);
    const oid2 = await c.originalIDForToken(t2);
    expect(oid1).to.equal(oid2);
    const o1 = await c.originalForToken(t1);
    const o2 = await c.originalForToken(t2);
    expect(o1.contractAddress).to.equal(o2.contractAddress);
    expect(o1.tokenID).to.equal(o2.tokenID);
    expect(o1.serialNumber).to.equal(o2.serialNumber);
  });

  it("Should proxy token URI", async () => {
    await erc721.mint(a, 30);
    const tokenURI = await erc721.tokenURI(30);
    await c.mint(a, erc721.address, 30);
    const tokenID = await c.tokenByIndex(0);
    expect(await c.tokenURI(tokenID)).to.equal(tokenURI);
  });
});
