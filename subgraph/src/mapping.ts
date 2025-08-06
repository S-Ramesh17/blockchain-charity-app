import {
  CampaignCreated as CampaignCreatedEvent,
  DonationMade as DonationMadeEvent,
  MilestoneReached as MilestoneReachedEvent,
  CharityPlatform
} from "../CharityPlatform/CharityPlatform";
import {
  Campaign,
  Donation,
  Milestone,
  Donor,
  NFT
} from "../generated/schema";
import { Transfer as TransferEvent, CharityNFT } from "../generated/CharityNFT/CharityNFT";
import { BigInt, Address } from "@graphprotocol/graph-ts";

export function handleCampaignCreated(event: CampaignCreatedEvent): void {
  let campaign = new Campaign(event.params.campaignId.toString());
  let platformContract = CharityPlatform.bind(event.address);
  
  let campaignData = platformContract.campaigns(event.params.campaignId);
  
  campaign.creator = event.params.creator;
  campaign.title = campaignData.title;
  campaign.description = campaignData.description;
  campaign.targetAmount = campaignData.targetAmount;
  campaign.raisedAmount = BigInt.fromI32(0);
  campaign.deadline = campaignData.deadline;
  campaign.imageHash = campaignData.imageHash;
  campaign.verified = campaignData.verified;
  campaign.completed = campaignData.completed;
  
  // Save campaign milestones
  let milestoneCount = platformContract.getMilestoneCount(event.params.campaignId);
  for (let i = 0; i < milestoneCount.toI32(); i++) {
    let milestoneData = platformContract.campaignMilestones(event.params.campaignId, BigInt.fromI32(i));
    let milestoneId = event.params.campaignId.toString() + "-" + i.toString();
    
    let milestone = new Milestone(milestoneId);
    milestone.description = milestoneData.description;
    milestone.targetAmount = milestoneData.targetAmount;
    milestone.reached = milestoneData.reached;
    milestone.campaign = campaign.id;
    milestone.save();
  }
  
  campaign.save();
}

export function handleDonationMade(event: DonationMadeEvent): void {
  let donationId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let donation = new Donation(donationId);
  
  donation.donor = event.params.donor.toHex();
  donation.amount = event.params.amount;
  donation.timestamp = event.block.timestamp;
  donation.campaign = event.params.campaignId.toString();
  donation.save();
  
  // Update donor
  let donor = Donor.load(event.params.donor.toHex());
  if (donor == null) {
    donor = new Donor(event.params.donor.toHex());
    donor.address = event.params.donor;
    donor.totalDonated = BigInt.fromI32(0);
  }
  donor.totalDonated = donor.totalDonated.plus(event.params.amount);
  donor.save();
  
  // Update campaign
  let campaign = Campaign.load(event.params.campaignId.toString());
  if (campaign != null) {
    campaign.raisedAmount = campaign.raisedAmount.plus(event.params.amount);
    campaign.save();
  }
}

export function handleMilestoneReached(event: MilestoneReachedEvent): void {
  let milestoneId = event.params.campaignId.toString() + "-" + event.params.milestoneIndex.toString();
  let milestone = Milestone.load(milestoneId);
  
  if (milestone != null) {
    milestone.reached = true;
    milestone.save();
  }
}

export function handleNFTTransfer(event: TransferEvent): void {
  // Mint event
  if (event.params.from.equals(Address.fromString("0x0000000000000000000000000000000000000000"))) {
    let nft = new NFT(event.params.tokenId.toString());
    nft.tokenId = event.params.tokenId;
    nft.owner = event.params.to.toHex();
    
    // Get NFT data from contract
    let nftContract = CharityNFT.bind(event.address);
    let tokenData = nftContract.tokenData(event.params.tokenId);
    
    nft.campaign = tokenData.campaignId.toString();
    nft.donationAmount = tokenData.donationAmount;
    nft.mintDate = tokenData.mintDate;
    nft.save();
    
    // Update donor's NFT count
    let donor = Donor.load(event.params.to.toHex());
    if (donor == null) {
      donor = new Donor(event.params.to.toHex());
      donor.address = event.params.to;
      donor.totalDonated = BigInt.fromI32(0);
      donor.save();
    }
  } 
  // Transfer event
  else {
    let nft = NFT.load(event.params.tokenId.toString());
    if (nft != null) {
      nft.owner = event.params.to.toHex();
      nft.save();
    }
  }
}