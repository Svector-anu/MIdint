import hre from "hardhat";

/**
 * Faucet script to mint test tokens to a specific address
 * Usage: npx hardhat run scripts/faucet.ts --network midl
 */
async function main() {
    console.log("\n🚰 MIDL Token Faucet\n");

    await hre.midl.initialize();

    // Get the address to send tokens to (from command line or use deployer)
    const addresses = await hre.midl.getAccounts();
    const deployer = addresses[0];

    // You can change this to any address you want to fund
    const recipientAddress = process.env.RECIPIENT_ADDRESS || deployer;

    console.log(`Recipient: ${recipientAddress}\n`);

    // Contract addresses
    const TBTC = "0xA4D2CbAF027125a967E48e94b1Baa03363981b1c";
    const WBTC = "0xca0daeff9cB8DED3EEF075Df62aDBb1522479639";

    // Mint TBTC
    console.log("🪙 Minting 1,000 TBTC...");
    try {
        await hre.midl.execute({
            name: "MintTBTC",
            address: TBTC,
            functionName: "mint",
            args: [recipientAddress, "100000000000"], // 1000 TBTC (8 decimals)
        });
        await hre.midl.execute();
        console.log("   ✅ 1,000 TBTC minted!\n");
    } catch (error: any) {
        console.log(`   ❌ Failed: ${error.message}\n`);
    }

    // For WBTC, we need to deposit BTC (this requires the recipient to have BTC)
    console.log("💰 To get WBTC, you need to deposit BTC to the WBTC contract");
    console.log(`   WBTC Contract: ${WBTC}`);
    console.log(`   You can do this via the frontend or by calling deposit() with value\n`);

    console.log("✅ Faucet complete!\n");
    console.log("📝 Check balances on Blockscout:");
    console.log(`   https://blockscout.regtest.midl.xyz/address/${recipientAddress}\n`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
