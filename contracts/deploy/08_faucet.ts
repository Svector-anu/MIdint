import type { DeployFunction } from "hardhat-deploy/types";

/**
 * Faucet - Mint test tokens to your wallet
 */
const faucet: DeployFunction = async (hre) => {
    console.log("\n🚰 MIDL Token Faucet\n");

    await hre.midl.initialize();

    // Your EVM address
    const recipientAddress = "0xF8483dddbCB103519F8BfE1713aBDa4f3A9C20b0";

    console.log(`Minting tokens to: ${recipientAddress}\n`);

    // Contract addresses
    const TBTC = "0xA4D2CbAF027125a967E48e94b1Baa03363981b1c";

    // Mint TBTC
    console.log("🪙 Minting 1,000 TBTC...");
    await hre.midl.execute({
        name: "MintTBTC",
        address: TBTC,
        functionName: "mint",
        args: [recipientAddress, "100000000000"], // 1000 TBTC (8 decimals)
    });
    await hre.midl.execute();
    console.log("   ✅ 1,000 TBTC minted!\n");

    console.log("✅ Faucet complete!\n");
    console.log("📝 Check balance:");
    console.log(`   https://blockscout.regtest.midl.xyz/address/${recipientAddress}\n`);
};

export default faucet;
faucet.tags = ["Faucet"];
