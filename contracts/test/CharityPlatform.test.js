const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CharityPlatform", function () {
  let CharityPlatform, charityPlatform;
  let DonationToken, donationToken;
  let CharityNFT, charityNFT;
  let owner, donor, charity;

  before(async function () {
    [owner, donor, charity] = await ethers.getSigners();

    // Deploy DonationToken
    DonationToken = await ethers.getContractFactory("DonationToken");
    donationToken = await DonationToken.deploy();
    await donationToken.deployed();

    // Deploy CharityNFT
    CharityNFT = await ethers.getContractFactory("CharityNFT");
    charityNFT = await CharityNFT.deploy();
    await charityNFT.deployed();

    // Deploy CharityPlatform
    CharityPlatform = await ethers.getContractFactory("CharityPlatform");
    charityPlatform = await CharityPlatform.deploy(charityNFT.address, donationToken.address);
    await charityPlatform.deployed();

    // Set platform addresses
    await charityNFT.setPlatformAddress(charityPlatform.address);
    await donationToken.setPlatformAddress(charityPlatform.address);

    // Fund donor with tokens
    await donationToken.transfer(donor.address, ethers.utils.parseEther("1000"));
  });

  it("Should create a new campaign", async function () {
    const title = "Test Campaign";
    const description = "This is a test campaign";
    const targetAmount = ethers.utils.parseEther("10");
    const durationDays = 30;
    const imageHash = "QmXYZ123";

    await expect(
      charityPlatform.connect(charity).createCampaign(
        title,
        description,
        targetAmount,
        durationDays,
        imageHash,
        []
      )
    ).to.emit(charityPlatform, "CampaignCreated");
  });

  it("Should allow donations to verified campaigns", async function () {
    // Verify the campaign first
    await charityPlatform.connect(owner).verifyCampaign(0);

    // Approve token transfer
    await donationToken.connect(donor).approve(
      charityPlatform.address,
      ethers.utils.parseEther("5")
    );

    // Make donation
    await expect(
      charityPlatform.connect(donor).donate(0, ethers.utils.parseEther("1"))
    ).to.emit(charityPlatform, "DonationMade");
  });

  it("Should mint NFT for significant donations", async function () {
    await donationToken.connect(donor).approve(
      charityPlatform.address,
      ethers.utils.parseEther("5")
    );

    await charityPlatform.connect(donor).donate(0, ethers.utils.parseEther("1.5"));
    expect(await charityNFT.balanceOf(donor.address)).to.equal(1);
  });
});