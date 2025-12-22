import type { DeployFunction } from "hardhat-deploy/types";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

/**
 * Deploy Uniswap V2 Router02
 * User-facing contract for swaps and liquidity management
 */
const deploy: DeployFunction = async (hre) => {
    console.log("\n🛣️  Deploying Uniswap V2 Router...\n");

    // Read deployed addresses
    const addressesPath = join(__dirname, "../deployments.json");
    let addresses: any = {};
    try {
        addresses = JSON.parse(readFileSync(addressesPath, "utf-8"));
    } catch (e) {
        console.log("No previous deployments found");
    }

    const factoryAddress = addresses.UniswapV2Factory;
    const wbtcAddress = addresses.WBTC;

    if (!factoryAddress || !wbtcAddress) {
        throw new Error("Factory or WBTC not deployed yet!");
    }

    console.log(`Factory: ${factoryAddress}`);
    console.log(`WBTC: ${wbtcAddress}\n`);

    await hre.midl.initialize();

    const router = await hre.midl.deploy("UniswapV2Router02", {
        args: [factoryAddress, wbtcAddress],
    });

    await hre.midl.execute();

    // Save router address
    addresses.UniswapV2Router02 = router?.address;
    writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));

    console.log(`✅ Router deployed at: ${router?.address}\n`);
};

deploy.tags = ["router", "uniswap"];
deploy.dependencies = ["factory"];

export default deploy;
