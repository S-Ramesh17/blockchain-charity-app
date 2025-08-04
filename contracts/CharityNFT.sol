// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CharityNFT is ERC721, Ownable {
    struct NFTData {
        uint256 campaignId;
        uint256 donationAmount;
        uint256 mintDate;
    }

    uint256 public tokenCounter;
    mapping(uint256 => NFTData) public tokenData;
    mapping(address => mapping(uint256 => bool)) public hasReceivedNFT;

    address public charityPlatform;

    modifier onlyPlatform() {
        require(msg.sender == charityPlatform, "Only CharityPlatform can call this");
        _;
    }

    constructor() ERC721("CharityDonorBadge", "CDB") {
        tokenCounter = 1;
    }

    function setPlatformAddress(address _platform) external onlyOwner {
        charityPlatform = _platform;
    }

    function mint(address _donor, uint256 _campaignId, uint256 _amount) external onlyPlatform {
        require(!hasReceivedNFT[_donor][_campaignId], "Already received NFT for this campaign");
        
        uint256 tokenId = tokenCounter;
        _safeMint(_donor, tokenId);
        
        tokenData[tokenId] = NFTData({
            campaignId: _campaignId,
            donationAmount: _amount,
            mintDate: block.timestamp
        });
        
        hasReceivedNFT[_donor][_campaignId] = true;
        tokenCounter++;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        NFTData memory data = tokenData[tokenId];
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            base64Encode(bytes(abi.encodePacked(
                '{"name":"Charity Donor Badge #', toString(tokenId), '",',
                '"description":"This NFT represents a donation to charity campaign #', toString(data.campaignId), '",',
                '"image":"ipfs://QmXYZ/charity-badge.png",',
                '"attributes":[',
                '{"trait_type":"Campaign ID","value":', toString(data.campaignId), '},',
                '{"trait_type":"Donation Amount","value":', toString(data.donationAmount), '},',
                '{"trait_type":"Date","value":', toString(data.mintDate), '}',
                ']}'
            )))
        ));
    }

    // Helper functions for base64 encoding and uint to string conversion
    function base64Encode(bytes memory data) internal pure returns (string memory) {
        // Implementation omitted for brevity
    }
    
    function toString(uint256 value) internal pure returns (string memory) {
        // Implementation omitted for brevity
    }
}