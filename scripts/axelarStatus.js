const { AxelarGMPRecoveryAPI, Environment } = require("@axelar-network/axelarjs-sdk");

/*

Uses the AxelarGMPRecoveryAPI module to get information about a pending transaction.
The transaction hash is the same hash as what was generated on the source chain.

Example:
0xa41b6a75a36f06d1a2164e20b781a67955387f21ecbffba157c9bc2607d6eda9

*/

task("axelarStatus", "Views the status of an Axelar transaction")
    .addParam("tx", "The transaction's hash")
    .setAction(async (args) => { 
        const txHash = args.tx;
        const sdk = new AxelarGMPRecoveryAPI({
            environment: Environment.TESTNET,
        });
        const txStatus = await sdk.queryTransactionStatus(txHash);
        console.log(txStatus);
    });
