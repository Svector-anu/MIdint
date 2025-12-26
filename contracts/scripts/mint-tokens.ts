import hre from "hardhat";
import { parseUnits } from "ethers";

/**
 * Mint test tokens to your wallet
 * Run with: npx hardhat run scripts/mint-tokens.ts --network default
 */
async function main() {
    console.log("\n💰 Minting Test Tokens...\n");

    // Your wallet address (from .env MNEMONIC)
    const [signer] = await hre.ethers.getSigners();
    const yourAddress = signer.address;

    console.log(`Minting to: ${yourAddress}\n`);

    // Token addresses
    const TBTC_ADDRESS = "0xA4D2CbAF027125a967E48e94b1Baa03363981b1c";
    const WBTC_ADDRESS = "0xca0daeff9cB8DED3EEF075Df62aDBb1522479639";

    // Get contracts
    const tbtc = await hre.ethers.getContractAt("TestToken", TBTC_ADDRESS);
    const wbtc = await hre.ethers.getContractAt("WBTC", WBTC_ADDRESS);

    // Mint TBTC (1000 TBTC with 8 decimals)
    console.log("1️⃣ Minting 1000 TBTC...");
    let tx = await tbtc.mint(yourAddress, parseUnits("1000", 8));
    await tx.wait();
    console.log("   ✅ TBTC minted\n");

    // Deposit to WBTC (wrapping 10 BTC worth)
    console.log("2️⃣ Depositing 10 WBTC...");
    tx = await wbtc.deposit({ value: parseUnits("10", 18) });
    await tx.wait();
    console.log("   ✅ WBTC deposited\n");

    // Check balances
    const tbtcBalance = await tbtc.balanceOf(yourAddress);
    const wbtcBalance = await wbtc.balanceOf(yourAddress);

    console.log("📊 Your Token Balances:");
    console.log(`   TBTC: ${hre.ethers.formatUnits(tbtcBalance, 8)}`);
    console.log(`   WBTC: ${hre.ethers.formatUnits(wbtcBalance, 18)}\n`);

    console.log("✅ Tokens minted! You can now add liquidity! 🎉\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
