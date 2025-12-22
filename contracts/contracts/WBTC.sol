// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title WBTC (Wrapped Bitcoin)
 * @dev Wrapped version of BTC for use in AMM pools on MIDL
 */
contract WBTC is ERC20 {
    constructor() ERC20("Wrapped Bitcoin", "WBTC") {}

    function decimals() public view virtual override returns (uint8) {
        return 8; // Bitcoin decimals
    }

    /**
     * @dev Deposit BTC and receive WBTC
     */
    function deposit() public payable {
        _mint(msg.sender, msg.value);
    }

    /**
     * @dev Withdraw BTC by burning WBTC
     */
    function withdraw(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _burn(msg.sender, amount);
        payable(msg.sender).transfer(amount);
    }

    /**
     * @dev Fallback function to accept BTC
     */
    receive() external payable {
        deposit();
    }
}
