import type { DeployFunction } from "hardhat-deploy/types";
import { parseUnits } from "ethers";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

/**
 * Deploy test tokens for the DEX
 * - TBTC: Test Bitcoin (8 decimals, 1,000,000 initial supply)
 * - TUSDC: Test USD Coin (6 decimals, 1,000,000 initial supply)
 */
const deploy: DeployFunction = async (hre) => {
    console.log("\n📝 Deploying Test Tokens to MIDL...\n");

    // Initialize MIDL SDK
    await hre.midl.initialize();

    // Deploy TBTC with unique contract name
    const tbtc = await hre.midl.deploy("TestTokenTBTC", {
        contract: "TestToken",
        args: [
            "Test Bitcoin",
            "TBTC",
            8,
            parseUnits("1000000", 8), // 1 million TBTC
        ],
    });

    // Deploy TUSDC with unique contract name
    const tusdc = await hre.midl.deploy("TestTokenTUSDC", {
        contract: "TestToken",
        args: [
            "Test USD Coin",
            "TUSDC",
            6,
            parseUnits("1000000", 6), // 1 million TUSDC
        ],
    });

    // Execute Bitcoin + EVM transactions
    await hre.midl.execute();

    // Save token addresses
    const addressesPath = join(__dirname, "../deployments.json");
    let addresses: any = {};
    try {
        addresses = JSON.parse(readFileSync(addressesPath, "utf-8"));
    } catch (e) { }
    addresses.TBTC = tbtc?.address;
    addresses.TUSDC = tusdc?.address;
    writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));

    console.log("✅ Test tokens deployed successfully!");
    console.log(`   TBTC: ${tbtc?.address}`);
    console.log(`   TUSDC: ${tusdc?.address}\n`);
};

deploy.tags = ["tokens", "TBTC", "TUSDC"];

export default deploy;
