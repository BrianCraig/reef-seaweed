// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

struct IPFSMultihash {
    bytes32 digest;
    uint8 hashFunction;
    uint8 size;
}
