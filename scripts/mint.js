const hre = require("hardhat");
const { AxelarQueryAPI, Environment, EvmChain, GasToken } = require("@axelar-network/axelarjs-sdk");
const { getGatewayAddress } = require("./gatewayGasReceiver");


const ethers = hre.ethers;
const sdk = new AxelarQueryAPI({
    environment: Environment.TESTNET,
});

/*

This script will mint an NFT across chains.
It serves as a demo on using the axelar sdk in conjunction with ethers.

For sake of simplicity, the script requires moonbase alpha for the origin.

Use the constants below to change the parameters of the script.

*/

const ORIGIN_CHAIN = EvmChain.MOONBEAM;
const DESTINATION_CHAIN = EvmChain.FANTOM;
const ORIGIN_CHAIN_ADDRESS = '0xA11e8F4FF58aa71410f95D74c3DeFFF584F20FdF';
const DESTINATION_CHAIN_ADDRESS = '0x62918fB7f3fd634A1FB2e2f8381A20c1279CE129'; // currently set to AxelarAcceptEverything

// moonbase alpha:      0xbfb326210b9Ae12DFD30A5DE307f51C95E84700e
// fantom testnet:      0xF994e877C93dA800B215f178d6749486fe9315A3

async function main() {
    await hre.run('compile');

    // Get contracts & connect to NFT
    const CrossChainNFT = await ethers.getContractFactory("CrossChainNFT");
    const nft = CrossChainNFT.attach(ORIGIN_CHAIN_ADDRESS);

    // Get the wDev address that Axelar uses & wrap tokens
    const GATEWAY_ADDRESS = getGatewayAddress(hre.network.name);
    const gateway = await ethers.getContractAt("IAxelarGateway", GATEWAY_ADDRESS);
    const MOONBASE_WDEV_ADDRESS = await gateway.tokenAddresses("WDEV");

    // Wrap + Approve WDEV to be used by the NFT contract
    // wrap => transfer to contract => contract transfers to Gateway
    const wDEVPayment = ethers.utils.parseUnits("0.05", "ether");
    const wDEV = await ethers.getContractAt( "WETH9", MOONBASE_WDEV_ADDRESS);
    
    const wrapTx = await wDEV.deposit({ value: wDEVPayment });
    console.log("Wrap transaction hash: ", wrapTx.hash);

    const approveTx = await wDEV.approve( ORIGIN_CHAIN_ADDRESS, wDEVPayment  );
    console.log("Approve transaction hash: ", approveTx.hash);

    console.log("Awaiting transaction confirmations...");
    await ethers.provider.waitForTransaction(approveTx.hash, 3);

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
    const gasFee = await sdk.estimateGasFee(
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