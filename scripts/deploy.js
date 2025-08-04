const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Deploy NFT contract first
  const CharityNFT = await ethers.getContractFactory("CharityNFT");
  const charityNFT = await CharityNFT.deploy();
  await charityNFT.deployed();
  
  console.log("CharityNFT deployed to:", charityNFT.address);
  
  // Deploy main platform contract
  const CharityPlatform = await ethers.getContractFactory("CharityPlatform");
  const charityPlatform = await CharityPlatform.deploy(charityNFT.address);
  await charityPlatform.deployed();
  
  console.log("CharityPlatform deployed to:", charityPlatform.address);
  
  // Set NFT's platform address
  await charityNFT.transferOwnership(charityPlatform.address);
  console.log("Ownership of CharityNFT transferred to CharityPlatform");
  
  // Save deployment info
  const fs = require("fs");
  const deployments = {
    charityNFT: charityNFT.address,
    charityPlatform: charityPlatform.address,
    network: network.name
  };
  
  fs.writeFileSync("deployments.json", JSON.stringify(deployments, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });