import type { DeployFunction } from "hardhat-deploy/types";
import { parseUnits } from "ethers";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Add initial liquidity to TBTC/TUSDC pair
 * This ensures the pool is usable for swaps
 */
const deploy: DeployFunction = async (hre) => {
    console.log("\n💰 Adding Initial Liquidity to TBTC/TUSDC Pool...\n");

    // Read deployed addresses
    const addressesPath = join(__dirname, "../deployments.json");
    const addresses = JSON.parse(readFileSync(addressesPath, "utf-8"));

    const routerAddress = addresses.UniswapV2Router02 || "0x29cf3A9B709f94Eb46fBbA67753B90E721ddC9Ed";
    const factoryAddress = addresses.UniswapV2Factory;
    const tbtcAddress = addresses.TestToken || "0xA4D2CbAF027125a967E48e94b1Baa03363981b1c"; // TBTC
    const tusdcAddress = addresses.TestToken || "0xA4D2CbAF027125a967E48e94b1Baa03363981b1c"; // TUSDC

    console.log(`Router: ${routerAddress}`);
    console.log(`Factory: ${factoryAddress}`);
    console.log(`TBTC: ${tbtcAddress}`);
    console.log(`TUSDC: ${tusdcAddress}\n`);

    // Liquidity amounts
    const tbtcAmount = parseUnits("100", 8);    // 100 TBTC (8 decimals)
    const tusdcAmount = parseUnits("100000", 6); // 100,000 TUSDC (6 decimals)

    console.log(`Adding liquidity:`);
    console.log(`- 100 TBTC`);
    console.log(`- 100,000 TUSDC`);
    console.log(`- Initial price: 1 TBTC = 1,000 TUSDC\n`);

    await hre.midl.initialize();

    // 1. Approve TBTC to Router
    console.log("1️⃣ Approving TBTC...");
    await hre.midl.execute({
        name: "ApproveTBTC",
        address: tbtcAddress,
        functionName: "approve",
        args: [routerAddress, tbtcAmount],
    });

    // 2. Approve TUSDC to Router
    console.log("2️⃣ Approving TUSDC...");
    await hre.midl.execute({
        name: "ApproveTUSDC",
        address: tusdcAddress,
        functionName: "approve",
        args: [routerAddress, tusdcAmount],
    });

    // 3. Add liquidity via Router
    console.log("3️⃣ Adding liquidity to pool...");
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

    await hre.midl.execute({
        name: "AddLiquidity",
        address: routerAddress,
        functionName: "addLiquidity",
        args: [
            tbtcAddress,           // tokenA
            tusdcAddress,          // tokenB
            tbtcAmount,            // amountADesired
            tusdcAmount,           // amountBDesired
            0,                     // amountAMin (0 for initial liquidity)
            0,                     // amountBMin (0 for initial liquidity)
            addresses.deployer || await hre.getNamedAccounts().then(a => a.deployer), // to
            deadline,              // deadline
        ],
    });

    // Execute all transactions
    await hre.midl.execute();

    console.log("\n✅ Initial liquidity added successfully!");
    console.log("Pool is now ready for swaps! 🎉\n");
};

deploy.tags = ["liquidity", "pool"];
deploy.dependencies = ["router"];
deploy.runAtTheEnd = true;

export default deploy;
