import type { DeployFunction } from "hardhat-deploy/types";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

/**
 * Deploy WBTC (Wrapped Bitcoin)
 * Required for Router as WETH equivalent
 */
const deploy: DeployFunction = async (hre) => {
    console.log("\n📝 Deploying WBTC (Wrapped Bitcoin)...\n");

    await hre.midl.initialize();

    const wbtc = await hre.midl.deploy("WBTC", {
        args: [],
    });

    await hre.midl.execute();

    // Save WBTC address
    const addressesPath = join(__dirname, "../deployments.json");
    let addresses: any = {};
    try {
        addresses = JSON.parse(readFileSync(addressesPath, "utf-8"));
    } catch (e) { }
    addresses.WBTC = wbtc?.address;
    writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));

    console.log(`✅ WBTC deployed at: ${wbtc?.address}\n`);
};

deploy.tags = ["wbtc", "WBTC"];

export default deploy;
