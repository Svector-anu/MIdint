import type { DeployFunction } from "hardhat-deploy/types";

/**
 * Create the TBTC/TUSDC trading pair
 * This will be the main demo pool
 */
const deploy: DeployFunction = async (hre) => {
    console.log("\n💧 Creating TBTC/TUSDC Pair...\n");

    const factory = await hre.deployments.get("UniswapV2Factory");
    const tbtc = await hre.deployments.get("TBTC");
    const tusdc = await hre.deployments.get("TUSDC");

    await hre.midl.initialize();

    // Create pair via factory
    await hre.midl.execute({
        name: "CreatePair",
        contract: "UniswapV2Factory",
        address: factory.address,
        functionName: "createPair",
        args: [tbtc.address, tusdc.address],
    });

    await hre.midl.execute();

    // Get the pair address
    const factoryContract = await hre.ethers.getContractAt(
        "UniswapV2Factory",
        factory.address
    );
    const pairAddress = await factoryContract.getPair(
        tbtc.address,
        tusdc.address
    );

    console.log(`✅ TBTC/TUSDC Pair created at: ${pairAddress}\n`);
};

deploy.tags = ["pair", "pool"];
deploy.dependencies = ["router"];
deploy.runAtTheEnd = true;

export default deploy;
