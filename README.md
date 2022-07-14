# Axelar SDK Demo

This is a hardhat project that contains a very simple NFT contract with a twist: it can only mint an NFT if 
it receives a specific cross-chain message. The price to mint the cross-chain message, is 0.05 WDEV.

## Scripts
```
npx hardhat run scripts/deploy.js --network moonbase
```
Deploy CrossChainNFT to moonbase.

```
npx hardhat run scripts/mint.js --network moonbase
```
Sends a cross chain message to a network of your choice in an attempt to mint the NFT. Be sure to change the
constants in the script itself.

```
npx hardhat axelarStatus --tx YOUR_TRANSACTION_HASH
```
Displays information about an Axelar transaction, given its transaction hash.
