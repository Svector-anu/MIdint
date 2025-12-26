import type { DeployFunction } from "hardhat-deploy/types";
import { parseUnits } from "ethers";

/**
 * Simple faucet - send tokens to your Xverse wallet
 * Run with: pnpm run deploy --tags faucet
 */
const deploy: DeployFunction = async (hre) => {
    console.log("\n🚰 Faucet: Sending Tokens to Your Wallet...\n");

    // Your Xverse EVM address (you'll need to get this from the frontend)
    // For now, we'll use the deployer's address as a test
    const [deployer] = await hre.ethers.getSigners();

    // REPLACE THIS with your actual Xverse EVM address from the frontend
    const YOUR_ADDRESS = deployer.address; // Change this!

    console.log(`Sending to: ${YOUR_ADDRESS}\n`);

    const TBTC = "0xA4D2CbAF027125a967E48e94b1Baa03363981b1c";
    const WBTC = "0xca0daeff9cB8DED3EEF075Df62aDBb1522479639";

    await hre.midl.initialize();

    // Mint TBTC
    console.log("1️⃣ Minting 10,000 TBTC...");
    await hre.midl.execute({
        name: "MintTBTC",
        address: TBTC,
        functionName: "mint",
        args: [YOUR_ADDRESS, parseUnits("10000", 8)],
    });

    // Mint TUSDC (same address as TBTC for now)
    console.log("2️⃣ Minting 100,000 TUSDC...");
    await hre.midl.execute({
        name: "MintTUSDC",
        address: TBTC, // Same token
        functionName: "mint",
        args: [YOUR_ADDRESS, parseUnits("100000", 6)],
    });

    // For WBTC, send some from deployer
    console.log("3️⃣ Sending 5 WBTC...");
    const wbtc = await hre.ethers.getContractAt("WBTC", WBTC);
    const wbtcBalance = await wbtc.balanceOf(deployer.address);

    if (wbtcBalance > 0) {
        await hre.midl.execute({
            name: "TransferWBTC",
            address: WBTC,
            functionName: "transfer",
            args: [YOUR_ADDRESS, parseUnits("5", 18)],
        });
    }

    await hre.midl.execute();

    console.log("\n✅ Tokens sent! Check your wallet balance!\n");
    console.log("📱 Refresh the frontend to see updated balances.\n");
};

deploy.tags = ["faucet"];
deploy.runAtTheEnd = true;

export default deploy;
