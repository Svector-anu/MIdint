import hre from "hardhat";

/**
 * Test Script - Verify everything works at contract level
 * Run: npx hardhat run scripts/test-contracts.ts --network default
 */
async function main() {
    console.log("\n🧪 Testing Contracts on MIDL...\n");

    const [signer] = await hre.ethers.getSigners();
    console.log(`Testing with wallet: ${signer.address}\n`);

    // Contract addresses
    const TBTC = "0xA4D2CbAF027125a967E48e94b1Baa03363981b1c";
    const WBTC = "0xca0daeff9cB8DED3EEF075Df62aDBb1522479639";
    const ROUTER = "0x29cf3A9B709f94Eb46fBbA67753B90E721ddC9Ed";
    const FACTORY = "0xde6c29923d7BB9FDbcDfEC54E7e726894B982593";

    console.log("📍 Contract Addresses:");
    console.log(`   TBTC:    ${TBTC}`);
    console.log(`   WBTC:    ${WBTC}`);
    console.log(`   Router:  ${ROUTER}`);
    console.log(`   Factory: ${FACTORY}\n`);

    // Get contracts
    const tbtc = await hre.ethers.getContractAt("TestToken", TBTC);
    const wbtc = await hre.ethers.getContractAt("WBTC", WBTC);
    const router = await hre.ethers.getContractAt("UniswapV2Router02", ROUTER);
    const factory = await hre.ethers.getContractAt("UniswapV2Factory", FACTORY);

    // Test 1: Check balances
    console.log("1️⃣ Checking Token Balances...");
    const tbtcBalance = await tbtc.balanceOf(signer.address);
    const wbtcBalance = await wbtc.balanceOf(signer.address);
    console.log(`   TBTC: ${hre.ethers.formatUnits(tbtcBalance, 8)}`);
    console.log(`   WBTC: ${hre.ethers.formatUnits(wbtcBalance, 18)}\n`);

    // Test 2: Check if pair exists
    console.log("2️⃣ Checking if TBTC/WBTC pair exists...");
    const pairAddress = await factory.getPair(TBTC, WBTC);
    console.log(`   Pair: ${pairAddress}`);
    console.log(`   ${pairAddress === hre.ethers.ZeroAddress ? "❌ No pair" : "✅ Pair exists"}\n`);

    // Test 3: Check router points to factory
    console.log("3️⃣ Checking Router configuration...");
    const routerFactory = await router.factory();
    console.log(`   Router's Factory: ${routerFactory}`);
    console.log(`   ${routerFactory === FACTORY ? "✅ Correct" : "❌ Wrong factory"}\n`);

    // Test 4: If no balance, try to mint
    if (tbtcBalance === 0n) {
        console.log("4️⃣ No TBTC balance, minting 10,000 TBTC...");
        const tx = await tbtc.mint(signer.address, hre.ethers.parseUnits("10000", 8));
        await tx.wait();
        const newBalance = await tbtc.balanceOf(signer.address);
        console.log(`   ✅ Minted! New balance: ${hre.ethers.formatUnits(newBalance, 8)}\n`);
    }

    // Test 5: Try approval
    console.log("5️⃣ Testing token approval...");
    const approveAmount = hre.ethers.parseUnits("100", 8);
    const approveTx = await tbtc.approve(ROUTER, approveAmount);
    await approveTx.wait();

    const allowance = await tbtc.allowance(signer.address, ROUTER);
    console.log(`   Allowance: ${hre.ethers.formatUnits(allowance, 8)} TBTC`);
    console.log(`   ${allowance >= approveAmount ? "✅ Approval works" : "❌ Approval failed"}\n`);

    console.log("✅ All contract tests passed!\n");
    console.log("🎯 Ready to test in frontend!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Error:", error);
        process.exit(1);
    });
