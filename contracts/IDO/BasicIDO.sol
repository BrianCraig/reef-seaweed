// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IIDO.sol";

contract BasicIdo is IIDO {
    bool private _fulfilled = false;
    IERC20 private _tokenAddress;
    uint32 private _multiplier;
    uint32 private _divider;
    uint256 private _ipfs;
    uint256 private _startTimestamp;
    uint256 private _endTimestamp;
    uint256 private _maxSoldBaseAmount;
    uint256 private _boughtCounter = 0;
    mapping(address => uint256) private _bought;

    constructor(
        address tokenAddress,
        uint32 multiplier,
        uint32 divider,
        uint256 ipfs,
        uint256 startTimestamp,
        uint256 endTimestamp,
        uint256 maxSoldBaseAmount
    ) {
        _tokenAddress = IERC20(tokenAddress);
        _multiplier = multiplier;
        _divider = divider;
        _ipfs = ipfs;
        _startTimestamp = startTimestamp;
        _endTimestamp = endTimestamp;
        _maxSoldBaseAmount = maxSoldBaseAmount;
    }

    function information()
        public
        view
        override
        returns (
            address tokenAddress,
            uint32 multiplier,
            uint32 divider,
            uint256 ipfs,
            uint256 startingTimestamp,
            uint256 endTimestamp,
            uint256 maxSoldBaseAmount,
            bool fulfilled
        )
    {
        require(_endTimestamp < block.timestamp);
        require(_startTimestamp < _endTimestamp);
        return (
            address(_tokenAddress),
            _multiplier,
            _divider,
            _ipfs,
            _startTimestamp,
            _endTimestamp,
            _maxSoldBaseAmount,
            _fulfilled
        );
    }

    /**
     * @dev Returns if the selected address can buy.
     */
    function canBuy(address account)
        public
        view
        override
        returns (bool status)
    {
        return
            _fulfilled &&
            (block.timestamp >= _startTimestamp) &&
            (block.timestamp < _endTimestamp) &&
            (_boughtCounter < _maxSoldBaseAmount);
    }

    function _availableToBuy() private view returns (uint256 quantity) {
        return _boughtCounter - _maxSoldBaseAmount;
    }

    /**
     * @dev Buys the base amount in gwei, Fails on unsuccessful tx.
     */
    function buy(uint256 amount) public payable override {
        require(msg.value == amount, "Non matching gwei");
        require(canBuy(msg.sender), "Can't buy");
        require(amount >= _availableToBuy(), "Not enough available to buy");
        _bought[msg.sender] += amount;
        _boughtCounter += amount;
        emit Bought(msg.sender, amount);
    }

    /**
     * @dev Withdraws the amount, Fails on unsuccessful tx.
     */
    function withdraw(uint256 amount) public override {
        require(_bought[msg.sender] >= amount, "Not enough bought");
        _bought[msg.sender] -= amount;
        _boughtCounter -= amount;
        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @dev Get's the payout, Fails on unsuccessful tx.
     */
    function getPayout() public override {
        getPayoutOn(msg.sender);
    }

    /**
     * @dev Get's the payout, but in a specific address.
     */
    function getPayoutOn(address otherAddress) public override {
        uint256 amount = _bought[otherAddress];
        require(amount > 0, "Nothing to pay");
        require(block.timestamp >= _endTimestamp, "IDO still open");
        _tokenAddress.transfer(otherAddress, amount);
        _bought[otherAddress] = 0;
    }

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) public view override returns (uint256) {
        return _bought[account];
    }

    /**
     * @dev Fulfills the contract, Fails on unsuccessful tx.
     */
    function fulfill() public override {
        _tokenAddress.transferFrom(
            msg.sender,
            address(this),
            _maxSoldBaseAmount
        );
    }
}
