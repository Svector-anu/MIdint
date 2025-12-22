import { ethers } from "hardhat";
import { parseUnits } from "ethers";

/**
 * Test script to execute a swap on the DEX
 * Run with: npx hardhat run scripts/test-swap.ts --network default
 */
async function main() {
    console.log("\n🔄 Testing DEX Swap...\n");

    // Contract addresses
    const ROUTER_ADDRESS = "0x29cf3A9B709f94Eb46fBbA67753B90E721ddC9Ed";
    const WBTC_ADDRESS = "0xca0daeff9cB8DED3EEF075Df62aDBb1522479639";
    const TOKEN_ADDRESS = "0xA4D2CbAF027125a967E48e94b1Baa03363981b1c";

    const [signer] = await ethers.getSigners();
    console.log(`Using wallet: ${signer.address}\n`);

    // Get contract instances
    const wbtc = await ethers.getContractAt("WBTC", WBTC_ADDRESS);
    const token = await ethers.getContractAt("TestToken", TOKEN_ADDRESS);
    const router = await ethers.getContractAt("UniswapV2Router02", ROUTER_ADDRESS);

    // Check balances before swap
    const wbtcBefore = await wbtc.balanceOf(signer.address);
    const tokenBefore = await token.balanceOf(signer.address);

    console.log("📊 Balances Before Swap:");
    console.log(`   WBTC: ${ethers.formatUnits(wbtcBefore, 18)}`);
    console.log(`   Token: ${ethers.formatUnits(tokenBefore, 8)}\n`);

    // Swap 0.1 WBTC for Tokens
    const swapAmount = parseUnits("0.1", 18); // 0.1 WBTC

    console.log(`Swapping: ${ethers.formatUnits(swapAmount, 18)} WBTC for Tokens\n`);

    // 1. Approve WBTC
    console.log("1️⃣ Approving WBTC...");
    let tx = await wbtc.approve(ROUTER_ADDRESS, swapAmount);
    await tx.wait();
    console.log(`   ✅ Approved\n`);

    // 2. Get expected output amount
    console.log("2️⃣ Calculating expected output...");
    const path = [WBTC_ADDRESS, TOKEN_ADDRESS];
    const amounts = await router.getAmountsOut(swapAmount, path);
    const expectedOut = amounts[1];
    console.log(`   Expected output: ${ethers.formatUnits(expectedOut, 8)} Tokens\n`);

    // 3. Execute swap
    console.log("3️⃣ Executing swap...");
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    tx = await router.swapExactTokensForTokens(
        swapAmount,              // amountIn
        0,                       // amountOutMin (0 for testing, use slippage in prod)
        path,                    // path
        signer.address,          // to
        deadline                 // deadline
    );

    const receipt = await tx.wait();
    console.log(`   ✅ Swap executed!`);
    console.log(`   Transaction: ${receipt?.hash}\n`);

    // 4. Check balances after swap
    const wbtcAfter = await wbtc.balanceOf(signer.address);
    const tokenAfter = await token.balanceOf(signer.address);

    console.log("📊 Balances After Swap:");
    console.log(`   WBTC: ${ethers.formatUnits(wbtcAfter, 18)}`);
    console.log(`   Token: ${ethers.formatUnits(tokenAfter, 8)}\n`);

    console.log("📈 Swap Results:");
    console.log(`   WBTC spent: ${ethers.formatUnits(wbtcBefore - wbtcAfter, 18)}`);
    console.log(`   Tokens received: ${ethers.formatUnits(tokenAfter - tokenBefore, 8)}`);
    console.log(`   Effective price: ${ethers.formatUnits((tokenAfter - tokenBefore) * BigInt(1e10) / (wbtcBefore - wbtcAfter), 8)} Tokens per WBTC\n`);

    console.log("✅ Swap successful! DEX is working! 🎉\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
