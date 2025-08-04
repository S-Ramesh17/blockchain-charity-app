const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CharityNFT", function () {
  let CharityNFT, charityNFT;
  let owner, donor;

  before(async function () {
    [owner, donor] = await ethers.getSigners();
    CharityNFT = await ethers.getContractFactory("CharityNFT");
    charityNFT = await CharityNFT.deploy();
    await charityNFT.deployed();
  });

  it("Should set platform address correctly", async function () {
    const platformAddress = ethers.Wallet.createRandom().address;
    await charityNFT.setPlatformAddress(platformAddress);
    expect(await charityNFT.charityPlatform()).to.equal(platformAddress);
  });

  it("Should mint NFTs only from platform", async function () {
    const platformAddress = ethers.Wallet.createRandom().address;
    await charityNFT.setPlatformAddress(platformAddress);

    await expect(
      charityNFT.connect(owner).mint(donor.address, 1, ethers.utils.parseEther("1"))
    ).to.be.revertedWith("Only CharityPlatform can call this");

    // Simulate platform call
    await charityNFT.connect(await ethers.getImpersonatedSigner(platformAddress)).mint(
      donor.address,
      1,
      ethers.utils.parseEther("1")
    );

    expect(await charityNFT.balanceOf(donor.address)).to.equal(1);
  });

  it("Should return valid token URI", async function () {
    const tokenId = 1;
    const uri = await charityNFT.tokenURI(tokenId);
    expect(uri).to.include("data:application/json;base64");
  });
});