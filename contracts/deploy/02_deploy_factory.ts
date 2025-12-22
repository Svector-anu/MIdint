import type { DeployFunction } from "hardhat-deploy/types";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

/**
 * Deploy Uniswap V2 Factory
 * This creates new trading pairs
 */
const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts } = hre;
    const { feeToSetter } = await getNamedAccounts();

    console.log("\n🏭 Deploying Uniswap V2 Factory...\n");
    console.log(`Fee setter: ${feeToSetter}\n`);

    await hre.midl.initialize();

    const factory = await hre.midl.deploy("UniswapV2Factory", {
        args: [feeToSetter],
    });

    await hre.midl.execute();

    // Save factory address
    const addressesPath = join(__dirname, "../deployments.json");
    let addresses: any = {};
    try {
        addresses = JSON.parse(readFileSync(addressesPath, "utf-8"));
    } catch (e) { }
    addresses.UniswapV2Factory = factory?.address;
    writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));

    console.log(`✅ Factory deployed at: ${factory?.address}\n`);
};

deploy.tags = ["factory", "uniswap"];
deploy.dependencies = ["tokens", "wbtc"];

export default deploy;
