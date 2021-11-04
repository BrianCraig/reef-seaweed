// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Interface of a Stacking
 */
interface ILockedAmount {
    /**
     * @dev Change IPFS hash
     */
    function lockedAmount(address owner)
        external
        view
        returns (uint256 quantity);
}
