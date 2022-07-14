const hre = require("hardhat");
const { getGatewayAddress, gasReceiverAddress, getWDEVAddress } = require("./gatewayGasReceiver");
const ethers = hre.ethers;

async function main() {
  await hre.run('compile');

  // Gets the gateway for our network
  const gatewayAddress = getGatewayAddress(hre.network.name);
  const MOONBASE_WDEV_ADDRESS = getWDEVAddress(hre.network.name);

  // Deploy our contract
  const CrossChainNFT = await ethers.getContractFactory("CrossChainNFT");
  const nft = await CrossChainNFT.deploy(gatewayAddress, gasReceiverAddress, MOONBASE_WDEV_ADDRESS);
  console.log("Deployed CrossChainNFT on " + hre.network.name + " at: " + nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
