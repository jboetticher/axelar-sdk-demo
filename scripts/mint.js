const hre = require("hardhat");
const { AxelarQueryAPI, Environment, EvmChain, GasToken } = require("@axelar-network/axelarjs-sdk");
const { getGatewayAddress } = require("./gatewayGasReceiver");


const ethers = hre.ethers;
const axelarSDK = new AxelarQueryAPI({
    environment: Environment.TESTNET,
});

/*

This script will mint an NFT across chains.
It serves as a demo on using the axelar sdk in conjunction with ethers.

For sake of simplicity, the script requires moonbase alpha for the origin.

Use the constants below to change the parameters of the script.

*/

const ORIGIN_CHAIN = "moonbeam";
const DESTINATION_CHAIN = "ethereum-sepolia";
const ORIGIN_CHAIN_ADDRESS = '0x0572B488d70e293F3f93Db9580D19aBbBC00F490';
const DESTINATION_CHAIN_ADDRESS = '0x89f801C7DB23439FDdBad4f913D788F13d1d7494'; // currently set to AxelarAcceptEverything

// moonbase alpha:      0x28B465072e40496154088a92D7f98f295F9c78E9
// fantom testnet:      0xf9e7DEF9c01345794c9c4c3a17DeF0e5a677C10E

async function main() {
    await hre.run('compile');

    // Get contracts & connect to NFT
    const CrossChainNFT = await ethers.getContractFactory("CrossChainNFT");
    const nft = CrossChainNFT.attach(ORIGIN_CHAIN_ADDRESS);

    // Get the wDev address that Axelar uses & wrap tokens
    const GATEWAY_ADDRESS = getGatewayAddress(hre.network.name);
    const gateway = await ethers.getContractAt("@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol:IAxelarGateway", GATEWAY_ADDRESS);

    const MOONBASE_WDEV_ADDRESS = await gateway.tokenAddresses("WDEV");

    // Wrap + Approve WDEV to be used by the NFT contract
    // wrap => transfer to contract => contract transfers to Gateway
    const wDEVPayment = ethers.utils.parseUnits("0.13", "ether");
    const wDEV = await ethers.getContractAt( "WETH9", MOONBASE_WDEV_ADDRESS);
    
    const wrapTx = await wDEV.deposit({ value: wDEVPayment });
    console.log("Wrap transaction hash: ", wrapTx.hash);

    const approveTx = await wDEV.approve( ORIGIN_CHAIN_ADDRESS, wDEVPayment  );
    console.log("Approve transaction hash: ", approveTx.hash);

    console.log("Awaiting transaction confirmations...");
    await ethers.provider.waitForTransaction(approveTx.hash, 1);

    /*
    Here we attempt to estimate the gas we have to pay for.
    Typically you could estimate required gas like so: 
    nft.estimateGas.executeWithToken()

    But the "executeWithToken" function can only be called by Axelar gateway: gas estimation is difficult.

    Axelar recommends 400000 to 700000 gas, which is usually more than enough for transactions.
    Chains may refund gas if you paid much more than what was paid.
    Feel free to experiment to figure out what a benchmark gas fee would be for your implementation.

    The following code will return DEV amount to pay in gas.
    */
    const estimateGasUsed = 400000;
    const gasFee = await axelarSDK.estimateGasFee(
        ORIGIN_CHAIN,
        DESTINATION_CHAIN,
        GasToken.GLMR,
        estimateGasUsed
    );
    const gasFeeToHuman = ethers.utils.formatEther(ethers.BigNumber.from(gasFee));
    console.log(`Cross-Chain Gas Fee: ${gasFee} Wei / ${gasFeeToHuman} Ether`);

    // Begin the minting
    const mintRes = await nft.mintXCNFT(
        DESTINATION_CHAIN_ADDRESS,
        DESTINATION_CHAIN,
        wDEVPayment,
        { value: gasFee }
    );
    console.log("Minting transaction hash: ", mintRes.hash);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });