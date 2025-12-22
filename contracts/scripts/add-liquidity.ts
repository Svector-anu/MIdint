import hre from "hardhat";
import { parseUnits } from "ethers";

/**
 * Test script to add liquidity to WBTC/TestToken pool
 * Run with: npx hardhat run scripts/add-liquidity.ts --network default
 */
async function main() {
    console.log("\n💰 Adding Liquidity to DEX...\n");

    // Contract addresses
    const ROUTER_ADDRESS = "0x29cf3A9B709f94Eb46fBbA67753B90E721ddC9Ed";
    const FACTORY_ADDRESS = "0xde6c29923d7BB9FDbcDfEC54E7e726894B982593";
    const WBTC_ADDRESS = "0xca0daeff9cB8DED3EEF075Df62aDBb1522479639";
    const TOKEN_ADDRESS = "0xA4D2CbAF027125a967E48e94b1Baa03363981b1c"; // TBTC

    const [signer] = await hre.ethers.getSigners();
    console.log(`Using wallet: ${signer.address}\n`);

    // Get contract instances
    const wbtc = await hre.ethers.getContractAt("WBTC", WBTC_ADDRESS);
    const token = await hre.ethers.getContractAt("TestToken", TOKEN_ADDRESS);
    const router = await hre.ethers.getContractAt("UniswapV2Router02", ROUTER_ADDRESS);
    const factory = await hre.ethers.getContractAt("UniswapV2Factory", FACTORY_ADDRESS);

    // Check balances
    const wbtcBalance = await wbtc.balanceOf(signer.address);
    const tokenBalance = await token.balanceOf(signer.address);
    console.log(`WBTC Balance: ${hre.ethers.formatUnits(wbtcBalance, 18)}`);
    console.log(`Token Balance: ${hre.ethers.formatUnits(tokenBalance, 8)}\n`);

    // Amounts to add
    const wbtcAmount = parseUnits("1", 18);      // 1 WBTC
    const tokenAmount = parseUnits("1000", 8);   // 1000 tokens (1 WBTC = 1000 tokens)

    console.log(`Adding liquidity:`);
    console.log(`- ${hre.ethers.formatUnits(wbtcAmount, 18)} WBTC`);
    console.log(`- ${hre.ethers.formatUnits(tokenAmount, 8)} Tokens`);
    console.log(`- Initial price: 1 WBTC = 1000 Tokens\n`);

    // 1. Approve tokens
    console.log("1️⃣ Approving WBTC...");
    let tx = await wbtc.approve(ROUTER_ADDRESS, wbtcAmount);
    await tx.wait();
    console.log(`   ✅ Approved\n`);

    console.log("2️⃣ Approving Token...");
    tx = await token.approve(ROUTER_ADDRESS, tokenAmount);
    await tx.wait();
    console.log(`   ✅ Approved\n`);

    // 2. Create pair if it doesn't exist
    console.log("3️⃣ Checking if pair exists...");
    let pairAddress = await factory.getPair(WBTC_ADDRESS, TOKEN_ADDRESS);

    if (pairAddress === hre.ethers.ZeroAddress) {
        console.log("   Creating new pair...");
        tx = await factory.createPair(WBTC_ADDRESS, TOKEN_ADDRESS);
        await tx.wait();
        pairAddress = await factory.getPair(WBTC_ADDRESS, TOKEN_ADDRESS);
        console.log(`   ✅ Pair created at: ${pairAddress}\n`);
    } else {
        console.log(`   ✅ Pair exists at: ${pairAddress}\n`);
    }

    // 3. Add liquidity
    console.log("4️⃣ Adding liquidity to pool...");
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

    tx = await router.addLiquidity(
        WBTC_ADDRESS,
        TOKEN_ADDRESS,
        wbtcAmount,
        tokenAmount,
        0, // amountAMin (0 for initial liquidity)
        0, // amountBMin (0 for initial liquidity)
        signer.address,
        deadline
    );

    const receipt = await tx.wait();
    console.log(`   ✅ Liquidity added!`);
    console.log(`   Transaction: ${receipt?.hash}\n`);

    // 4. Check pool reserves
    const pair = await hre.ethers.getContractAt("UniswapV2Pair", pairAddress);
    const reserves = await pair.getReserves();
    console.log("📊 Pool Reserves:");
    console.log(`   Reserve0: ${hre.ethers.formatUnits(reserves[0], 18)}`);
    console.log(`   Reserve1: ${hre.ethers.formatUnits(reserves[1], 8)}\n`);

    console.log("✅ Liquidity added successfully! Pool is ready for swaps! 🎉\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
