// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Interface of the Initial Dex Offering
 */
interface IIDO {
    /**
     * @dev Returns the main IDO information.
     *
     */
    function information()
        external
        view
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
        );

    /**
     * @dev Change IPFS hash
     */
    function setIPFS()
        external
        returns (
            bytes32 ipfsDigest,
            uint8 ipfsHashFunction,
            uint8 ipfsSize
        );

    /**
     * @dev Returns if the selected address can buy.
     */
    function canBuy(address account) external view returns (bool status);

    /**
     * @dev Buys the base amount in gwei, Fails on unsuccessful tx.
     */
    function buy(uint256 amount) external payable;

    /**
     * @dev Withdraws the amount, Fails on unsuccessful tx.
     */
    function withdraw(uint256 amount) external;

    /**
     * @dev Get's the payout, Fails on unsuccessful tx.
     */
    function getPayout() external;

    /**
     * @dev Get's the payout, but in a specific address.
     */
    function getPayoutOn(address otherAddress) external;

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function boughtAmount(address account) external view returns (uint256);

    /**
     * @dev Get's the payout, but in a specific address.
     */
    function beenPaid(address otherAddress) external view returns (bool paid);

    function getRaised() external;

    /**
     * @dev Emitted when a user buys
     */
    event Bought(address owner, uint256 quantity);

    /**
     * @dev Emitted when a user withdraws
     */
    event Withdrawn(address owner, uint256 quantity);
}
