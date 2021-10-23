// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking {
    using SafeMath for uint256;

    IERC20 public token;
    address public devaddr;
    mapping(address => uint256) public staking;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 amount);

    constructor(IERC20 _token) {
        token = _token;
        devaddr = msg.sender;
    }

    function stackingAmount(address _user) external view returns (uint256) {
        return staking[_user];
    }

    function stackingAmount() external view returns (uint256) {
        return staking[msg.sender];
    }

    function enterStaking(uint256 _amount) public {
        token.transferFrom(msg.sender, address(this), _amount);
        staking[msg.sender] = staking[msg.sender] + _amount;
        emit Deposit(msg.sender, _amount);
    }

    function leaveStaking(uint256 _amount) public {
        require(staking[msg.sender] >= _amount, "Where's your stack boy");
        token.transfer(msg.sender, _amount);
        staking[msg.sender] -= _amount;
        emit Withdraw(msg.sender, _amount);
    }

    function emergencyWithdraw() public {
        uint256 amount = staking[msg.sender];
        token.transferFrom(address(this), msg.sender, amount);
        emit EmergencyWithdraw(msg.sender, amount);
    }
}
