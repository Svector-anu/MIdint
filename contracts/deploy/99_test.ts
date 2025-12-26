import type { DeployFunction } from "hardhat-deploy/types";

/**
 * Test everything works - MIDL style
 */
const test: DeployFunction = async (hre) => {
    console.log("\n🧪 Testing Contracts with MIDL...\n");

    await hre.midl.initialize();

    const addresses = await hre.midl.getAccounts();
    const deployer = addresses[0];

    console.log(`Deployer: ${deployer}\n`);

    // Addresses
    const TBTC = "0xA4D2CbAF027125a967E48e94b1Baa03363981b1c";
    const ROUTER = "0x29cf3A9B709f94Eb46fBbA67753B90E721ddC9Ed";

    console.log("📍 Testing TBTC contract...");

    // Test 1: Check balance
    console.log("1️⃣ Checking balance...");
    const balanceResult = await hre.midl.read({
        name: "CheckTBTCBalance",
        address: TBTC,
        functionName: "balanceOf",
        args: [deployer],
    });
    console.log(`   Balance: ${balanceResult}\n`);

    // Test 2: Try minting
    console.log("2️⃣ Minting 10,000 TBTC...");
    try {
        await hre.midl.execute({
            name: "MintTBTC",
            address: TBTC,
            functionName: "mint",
            args: [deployer, "1000000000000"], // 10000 * 10^8
        });

        await hre.midl.execute();
        console.log("   ✅ Mint transaction sent!\n");
    } catch (error) {
        console.log(`   ❌ Mint failed: ${error}\n`);
    }

    // Test 3: Try approval
    console.log("3️⃣ Approving Router...");
    try {
        await hre.midl.execute({
            name: "ApproveTBTC",
            address: TBTC,
            functionName: "approve",
            args: [ROUTER, "10000000000"], // 100 * 10^8
        });

        await hre.midl.execute();
        console.log("   ✅ Approval transaction sent!\n");
    } catch (error) {
        console.log(`   ❌ Approval failed: ${error}\n`);
    }

    console.log("✅ Tests complete!\n");
    console.log("📝 Check block explorer for transaction status:");
    console.log("   https://blockscout.regtest.midl.xyz\n");
};

test.tags = ["test"];
test.runAtTheEnd = true;

export default test;
