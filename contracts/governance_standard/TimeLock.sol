// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
    constructor(
        uint256 _minDelay /* wait before excuting */,
        address[] memory _proposers /* Who can propose */,
        address[] memory _executors /* Who can execute */,
        address _admin /* Who can cancel */
    ) TimelockController(_minDelay, _proposers, _executors, _admin) {}
}
