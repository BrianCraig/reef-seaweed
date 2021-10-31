// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../erc20/ERC20Entangled.sol";
import "./IIDO.sol";
import "./IPFSMultihash.sol";

contract BasicIdo is IIDO, Ownable {
    ERC20Entangled private _tokenAddress;
    uint32 private _multiplier;
    uint32 private _divider;
    IPFSMultihash private _ipfs =
        IPFSMultihash(
            0x65b57eb7111c51b539ee694a5dd5f893e3f1ae4f7d47b6c31fb5903c9c8e7141,
            18,
            32
        );
    uint256 private _startTimestamp;
    uint256 private _endTimestamp;
    uint256 private _maxSoldBaseAmount;
    uint256 private _boughtCounter = 0;
    mapping(address => uint256) private _bought;
    mapping(address => bool) private _beenPaid;

    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        uint32 multiplier,
        uint32 divider,
        uint256 startTimestamp,
        uint256 endTimestamp,
        uint256 maxSoldBaseAmount
    ) {
        require(block.timestamp < endTimestamp, "would already ended");
        require(
            startTimestamp < endTimestamp,
            "start time should be before end time"
        );
        _tokenAddress = new ERC20Entangled(tokenName, tokenSymbol);
        _multiplier = multiplier;
        _divider = divider;
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
            uint256 startingTimestamp,
            uint256 endTimestamp,
            uint256 maxSoldBaseAmount,
            bytes32 ipfsDigest,
            uint8 ipfsHashFunction,
            uint8 ipfsSize
        )
    {
        return (
            address(_tokenAddress),
            _multiplier,
            _divider,
            _startTimestamp,
            _endTimestamp,
            _maxSoldBaseAmount,
            _ipfs.digest,
            _ipfs.hashFunction,
            _ipfs.size
        );
    }

    /**
     * @dev Change IPFS hash
     */
    function setIPFS()
        external
        override
        onlyOwner
        returns (
            bytes32 ipfsDigest,
            uint8 ipfsHashFunction,
            uint8 ipfsSize
        )
    {
        require(block.timestamp <= _startTimestamp, "IDO not on pre-sale");
        _ipfs = IPFSMultihash(ipfsDigest, ipfsHashFunction, ipfsSize);
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
            (block.timestamp >= _startTimestamp) &&
            (block.timestamp < _endTimestamp) &&
            (_boughtCounter < _maxSoldBaseAmount);
    }

    function _availableToBuy() private view returns (uint256 quantity) {
        return _maxSoldBaseAmount - _boughtCounter;
    }

    /**
     * @dev Buys the base amount in wei, Fails on unsuccessful tx.
     */
    function buy(uint256 amount) public payable override {
        require(msg.value == amount, "Non matching wei");
        require(canBuy(msg.sender), "Can't buy");
        require(amount <= _availableToBuy(), "Not enough available to buy");
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
        payable(msg.sender).transfer(amount);
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
        uint256 amount = _bought[msg.sender];
        require(amount > 0, "Nothing to pay");
        require(!_beenPaid[msg.sender], "Already paid");
        require(block.timestamp >= _endTimestamp, "Crowdsale still open");
        _tokenAddress.mint(otherAddress, (amount * _multiplier) / _divider);
        _beenPaid[msg.sender] = true;
    }

    /**
     * @dev Get's the payout, but in a specific address.
     */
    function beenPaid(address otherAddress)
        public
        view
        override
        returns (bool paid)
    {
        return _beenPaid[msg.sender];
    }

    /**
     * @dev Empties the contract wei and sends it to the owner
     */
    function getRaised() public override onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function boughtAmount(address account)
        public
        view
        override
        returns (uint256)
    {
        return _bought[account];
    }
}
