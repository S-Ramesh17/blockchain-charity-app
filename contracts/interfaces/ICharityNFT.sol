// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICharityNFT {
    function mint(address _donor, uint256 _campaignId, uint256 _amount) external;
    function setPlatformAddress(address _platform) external;
}