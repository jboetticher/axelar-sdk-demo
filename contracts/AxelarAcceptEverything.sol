// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

// import { IAxelarExecutable } from "https://github.com/axelarnetwork/axelar-cgp-solidity/blob/main/contracts/interfaces/IAxelarExecutable.sol";
import "@axelar-network/axelar-cgp-solidity/contracts/interfaces/IAxelarExecutable.sol";


contract AxelarAcceptEverything is IAxelarExecutable {
   constructor(address gateway_) IAxelarExecutable(gateway_) { }
}

// Fantom: 0xaf108eF646c8214c9DD9C13CBC5fadf964Bbe293