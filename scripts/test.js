const { ethers } = require("hardhat");
const { expect } = require("chai");

async function main() {
  // Compile contracts
  await hre.run('compile');

  // Deploy test contracts
  const DonationToken = await ethers.getContractFactory("DonationToken");
  const donationToken = await DonationToken.deploy();
  await donationToken.deployed();

  const CharityNFT = await ethers.getContractFactory("CharityNFT");
  const charityNFT = await CharityNFT.deploy();
  await charityNFT.deployed();

  const CharityPlatform = await ethers.getContractFactory("CharityPlatform");
  const charityPlatform = await CharityPlatform.deploy(
    charityNFT.address,
    donationToken.address
  );
  await charityPlatform.deployed();

  // Set platform addresses
  await charityNFT.setPlatformAddress(charityPlatform.address);
  await donationToken.setPlatformAddress(charityPlatform.address);

  console.log("Contracts deployed for testing:");
  console.log("- DonationToken:", donationToken.address);
  console.log("- CharityNFT:", charityNFT.address);
  console.log("- CharityPlatform:", charityPlatform.address);

  // Run tests
  console.log("\nRunning tests...");

  // Test 1: Create a campaign
  const [owner, donor] = await ethers.getSigners();
  const campaignTx = await charityPlatform.connect(owner).createCampaign(
    "Test Campaign",
    "This is a test campaign",
    ethers.utils.parseEther("10"),
    30,
    "QmXYZ123",
    []
  );
  await campaignTx.wait();

  const campaign = await charityPlatform.campaigns(0);
  expect(campaign.title).to.equal("Test Campaign");
  console.log("✓ Campaign creation test passed");

  // Test 2: Make a donation
  await donationToken.connect(donor).approve(
    charityPlatform.address,
    ethers.utils.parseEther("5")
  );
  
  const donateTx = await charityPlatform.connect(donor).donate(
    0,
    ethers.utils.parseEther("1")
  );
  await donateTx.wait();

  const updatedCampaign = await charityPlatform.campaigns(0);
  expect(updatedCampaign.raisedAmount).to.equal(ethers.utils.parseEther("1"));
  console.log("✓ Donation test passed");

  // Test 3: NFT minting
  const donorBalance = await charityNFT.balanceOf(donor.address);
  expect(donorBalance).to.equal(0); // Shouldn't mint for small donations

  await donationToken.connect(donor).approve(
    charityPlatform.address,
    ethers.utils.parseEther("5")
  );
  
  await charityPlatform.connect(donor).donate(
    0,
    ethers.utils.parseEther("1.5") // Above threshold for NFT
  );

  const newDonorBalance = await charityNFT.balanceOf(donor.address);
  expect(newDonorBalance).to.equal(1);
  console.log("✓ NFT minting test passed");

  console.log("\nAll tests passed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });