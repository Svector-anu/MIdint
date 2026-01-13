import type { DeployFunction } from "hardhat-deploy/types";

/**
 * Complete DEX Test Flow:
 * 1. Approve Router
 * 2. Add Liquidity
 * 3. Swap tokens
 */
const testDex: DeployFunction = async (hre) => {
    console.log("\n🧪 Testing Complete DEX Flow\n");

    await hre.midl.initialize();

    // Your EVM address
    const userAddress = "0xF8483dddbCB103519F8BfE1713aBDa4f3A9C20b0";

    // Contract addresses
    const TBTC = "0xA4D2CbAF027125a967E48e94b1Baa03363981b1c";
    const WBTC = "0xca0daeff9cB8DED3EEF075Df62aDBb1522479639";
    const ROUTER = "0x29cf3A9B709f94Eb46fBbA67753B90E721ddC9Ed";

    console.log(`User: ${userAddress}\n`);

    // Step 1: Approve Router for TBTC
    console.log("✅ Step 1: Approving Router for TBTC...");
    await hre.midl.execute({
        name: "ApproveTBTC",
        address: TBTC,
        functionName: "approve",
        args: [ROUTER, "50000000000"], // 500 TBTC
    });
    await hre.midl.execute();
    console.log("   ✅ TBTC approved!");

    // Step 2: Approve Router for WBTC
    console.log("\n✅ Step 2: Approving Router for WBTC...");
    await hre.midl.execute({
        name: "ApproveWBTC",
        address: WBTC,
        functionName: "approve",
        args: [ROUTER, "5000000000000000000"], // 5 WBTC
    });
    await hre.midl.execute();
    console.log("   ✅ WBTC approved!");

    // Step 3: Add Liquidity
    console.log("\n💧 Step 3: Adding Liquidity (100 TBTC + 1 WBTC)...");
    try {
        const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

        await hre.midl.execute({
            name: "AddLiquidity",
            address: ROUTER,
            functionName: "addLiquidity",
            args: [
                TBTC,                    // tokenA
                WBTC,                    // tokenB
                "10000000000",           // 100 TBTC (8 decimals)
                "1000000000000000000",   // 1 WBTC (18 decimals)
                "0",                     // amountAMin
                "0",                     // amountBMin
                userAddress,             // to
                deadline.toString(),     // deadline
            ],
        });
        await hre.midl.execute();
        console.log("   ✅ Liquidity added!");
    } catch (error: any) {
        console.log(`   ⚠️  ${error.message}`);
    }

    // Step 4: Swap TBTC for WBTC
    console.log("\n🔄 Step 4: Swapping 10 TBTC for WBTC...");
    try {
        const deadline = Math.floor(Date.now() / 1000) + 3600;

        await hre.midl.execute({
            name: "SwapTBTCforWBTC",
            address: ROUTER,
            functionName: "swapExactTokensForTokens",
            args: [
                "1000000000",            // 10 TBTC (8 decimals)
                "0",                     // amountOutMin (0 for testing)
                [TBTC, WBTC],           // path
                userAddress,             // to
                deadline.toString(),     // deadline
            ],
        });
        await hre.midl.execute();
        console.log("   ✅ Swap completed!");
    } catch (error: any) {
        console.log(`   ⚠️  ${error.message}`);
    }

    console.log("\n✅ DEX Test Complete!\n");
    console.log("📝 View transactions:");
    console.log(`   https://blockscout.regtest.midl.xyz/address/${userAddress}\n`);
};

export default testDex;
testDex.tags = ["TestDex"];
