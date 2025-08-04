export const donateToCampaign = async (web3, campaignId, amount) => {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contractABI = require('../lib/contracts/CharityPlatform.json');
  
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  
  // First approve the token transfer
  const tokenAddress = await contract.methods.donationToken().call();
  const tokenABI = require('../lib/contracts/DonationToken.json');
  const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
  
  await tokenContract.methods
    .approve(contractAddress, amount)
    .send({ from: web3.eth.defaultAccount });
  
  // Then make the donation
  return contract.methods
    .donate(campaignId, amount)
    .send({ from: web3.eth.defaultAccount });
};

export const createCampaign = async (web3, campaignData, milestones) => {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contractABI = require('../lib/contracts/CharityPlatform.json');
  
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  
  return contract.methods
    .createCampaign(
      campaignData.title,
      campaignData.description,
      web3.utils.toWei(campaignData.targetAmount, 'ether'),
      campaignData.durationDays,
      campaignData.imageHash,
      milestones
    )
    .send({ from: web3.eth.defaultAccount });
};

export const getCampaignDetails = async (web3, campaignId) => {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contractABI = require('../lib/contracts/CharityPlatform.json');
  
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  
  return contract.methods.campaigns(campaignId).call();
};

export const getDonorNFTs = async (web3, address) => {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contractABI = require('../lib/contracts/CharityPlatform.json');
  
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const nftAddress = await contract.methods.charityNFT().call();
  
  const nftABI = require('../lib/contracts/CharityNFT.json');
  const nftContract = new web3.eth.Contract(nftABI, nftAddress);
  
  const balance = await nftContract.methods.balanceOf(address).call();
  const nfts = [];
  
  for (let i = 0; i < balance; i++) {
    const tokenId = await nftContract.methods.tokenOfOwnerByIndex(address, i).call();
    const tokenData = await nftContract.methods.tokenData(tokenId).call();
    nfts.push({
      tokenId,
      campaignId: tokenData.campaignId,
      donationAmount: web3.utils.fromWei(tokenData.donationAmount, 'ether'),
      mintDate: new Date(tokenData.mintDate * 1000),
    });
  }
  
  return nfts;
};