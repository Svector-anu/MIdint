import "dotenv/config";
import "@typechain/hardhat";
import "@midl/hardhat-deploy";
import "hardhat-deploy";
import "@nomicfoundation/hardhat-verify";
import { vars, type HardhatUserConfig } from "hardhat/config";
import { midlRegtest } from "@midl/executor";

// Read MNEMONIC from .env file or hardhat vars, fallback to test mnemonic
const MNEMONIC = process.env.MNEMONIC || vars.get("MNEMONIC", "test test test test test test test test test test test junk");

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.6", // For Uniswap V2
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
      {
        version: "0.5.16", // For Uniswap V2 Core
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
    ],
  },
  midl: {
    networks: {
      default: {
        mnemonic: MNEMONIC,
        confirmationsRequired: 1,
        btcConfirmationsRequired: 1,
      },
    },
  },
  networks: {
    default: {
      url: midlRegtest.rpcUrls.default.http[0],
      chainId: midlRegtest.id,
    },
  },
  etherscan: {
    apiKey: {
      "midl-regtest": "empty",
    },
    customChains: [
      {
        network: "midl-regtest",
        chainId: 777,
        urls: {
          apiURL: "https://blockscout.regtest.midl.xyz/api",
          browserURL: "https://blockscout.regtest.midl.xyz",
        },
      },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    feeToSetter: {
      default: 0,
    },
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
};

export default config;
