// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

// import { IAxelarExecutable } from "https://github.com/axelarnetwork/axelar-cgp-solidity/blob/main/contracts/interfaces/IAxelarExecutable.sol";
//import "@axelar-network/axelar-cgp-solidity/contracts/interfaces/IAxelarExecutable.sol";

import "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarExecutable.sol";
import { AxelarExecutable } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol';

abstract contract AxelarAcceptEverything is AxelarExecutable {
   constructor(address gateway_) AxelarExecutable(gateway_) { }
}

// Fantom: 0xaf108eF646c8214c9DD9C13CBC5fadf964Bbe293