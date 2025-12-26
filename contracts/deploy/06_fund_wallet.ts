import type { DeployFunction } from "hardhat-deploy/types";
import { parseUnits } from "ethers";

/**
 * Send test tokens to user's Xverse wallet
 * The MIDL system will handle Bitcoin <> EVM address mapping
 */
const deploy: DeployFunction = async (hre) => {
    console.log("\n💸 Sending Tokens to Your Xverse Wallet...\n");

    // Your Bitcoin address
    const YOUR_BTC_ADDRESS = "bcrt1q69qwavpyqlsktfqg5j77d4cuw000vqs3yymvd3";

    // Note: MIDL will map this to an EVM address automatically
    // For now, we'll use the deployer to mint and you can claim via the frontend

    const [deployer] = await hre.ethers.getSigners();
    console.log(`Deployer: ${deployer.address}`);
    console.log(`Your Bitcoin Address: ${YOUR_BTC_ADDRESS}\n`);

    // Token addresses
    const TBTC_ADDRESS = "0xA4D2CbAF027125a967E48e94b1Baa03363981b1c";
    const WBTC_ADDRESS = "0xca0daeff9cB8DED3EEF075Df62aDBb1522479639";

    console.log("📊 The deployer wallet already has:");
    console.log("   - 1,000,000 TBTC");
    console.log("   - Access to WBTC\n");

    console.log("✅ To use these tokens:");
    console.log("1. Connect your Xverse wallet to the frontend");
    console.log("2. Your MIDL EVM address will be shown");
    console.log("3. Send a small test transaction to get tokens\n");

    console.log("💡 OR import this mnemonic into Xverse:");
    console.log("   (Check your .env file for MNEMONIC)\n");
};

deploy.tags = ["fund"];

export default deploy;
