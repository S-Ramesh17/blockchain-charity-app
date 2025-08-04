// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./CharityNFT.sol";
import "./DonationToken.sol";

contract CharityPlatform is Ownable, ReentrancyGuard {
    struct Campaign {
        address creator;
        string title;
        string description;
        uint256 targetAmount;
        uint256 raisedAmount;
        uint256 deadline;
        string imageHash;
        bool verified;
        bool completed;
    }

    struct Milestone {
        string description;
        uint256 targetAmount;
        bool reached;
    }

    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Milestone[]) public campaignMilestones;
    mapping(address => mapping(uint256 => uint256)) public donations;

    CharityNFT public charityNFT;
    DonationToken public donationToken;

    event CampaignCreated(uint256 indexed campaignId, address indexed creator);
    event DonationMade(uint256 indexed campaignId, address indexed donor, uint256 amount);
    event MilestoneReached(uint256 indexed campaignId, uint256 milestoneIndex);

    constructor(address _nftAddress, address _tokenAddress) {
        charityNFT = CharityNFT(_nftAddress);
        donationToken = DonationToken(_tokenAddress);
    }

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _targetAmount,
        uint256 _durationDays,
        string memory _imageHash,
        Milestone[] memory _milestones
    ) external {
        uint256 deadline = block.timestamp + (_durationDays * 1 days);
        campaigns[campaignCount] = Campaign({
            creator: msg.sender,
            title: _title,
            description: _description,
            targetAmount: _targetAmount,
            raisedAmount: 0,
            deadline: deadline,
            imageHash: _imageHash,
            verified: false,
            completed: false
        });

        for (uint256 i = 0; i < _milestones.length; i++) {
            campaignMilestones[campaignCount].push(_milestones[i]);
        }

        emit CampaignCreated(campaignCount, msg.sender);
        campaignCount++;
    }

    function donate(uint256 _campaignId, uint256 _amount) external nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.verified, "Campaign not verified");
        require(block.timestamp <= campaign.deadline, "Campaign expired");
        
        donationToken.transferFrom(msg.sender, address(this), _amount);
        campaign.raisedAmount += _amount;
        donations[msg.sender][_campaignId] += _amount;
        
        // Mint NFT reward if donation is significant
        if (_amount >= 1 ether) {
            charityNFT.mint(msg.sender, _campaignId, _amount);
        }
        
        emit DonationMade(_campaignId, msg.sender, _amount);
    }

    function verifyCampaign(uint256 _campaignId) external onlyOwner {
        campaigns[_campaignId].verified = true;
    }

    function checkMilestones(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.creator || msg.sender == owner(), "Not authorized");
        
        for (uint256 i = 0; i < campaignMilestones[_campaignId].length; i++) {
            Milestone storage milestone = campaignMilestones[_campaignId][i];
            if (!milestone.reached && campaign.raisedAmount >= milestone.targetAmount) {
                milestone.reached = true;
                emit MilestoneReached(_campaignId, i);
            }
        }
    }
}