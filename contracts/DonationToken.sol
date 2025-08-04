// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DonationToken is ERC20, Ownable {
    address public charityPlatform;

    constructor() ERC20("CharityToken", "CHT") {
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function setPlatformAddress(address _platform) external onlyOwner {
        charityPlatform = _platform;
    }

    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
    }
}