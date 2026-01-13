import { createConfig, regtest } from "@midl/core";
import { xverseConnector } from "@midl/connectors";
import { http, createConfig as createWagmiConfig } from "wagmi";
import { defineChain } from "viem";

/**
 * MIDL Configuration
 * Sets up connection to MIDL Regtest and wallet connectors
 */
export const midlConfig = createConfig({
    networks: [regtest],
    connectors: [xverseConnector()],
    persist: true,
});

/**
 * MIDL Regtest RPC URL
 */
const MIDL_RPC_URL = "https://rpc.regtest.midl.xyz";

/**
 * MIDL Regtest as a Viem/Wagmi chain
 */
export const midlRegtest = defineChain({
    id: 18332, // Bitcoin regtest chain ID
    name: "MIDL Regtest",
    nativeCurrency: {
        name: "Bitcoin",
        symbol: "BTC",
        decimals: 8,
    },
    rpcUrls: {
        default: {
            http: [MIDL_RPC_URL],
        },
    },
    blockExplorers: {
        default: {
            name: "Blockscout",
            url: "https://blockscout.regtest.midl.xyz",
        },
    },
    testnet: true,
});

/**
 * Wagmi Configuration for MIDL
 * This is used by WagmiMidlProvider to enable EVM operations
 */
export const wagmiConfig = createWagmiConfig({
    chains: [midlRegtest],
    transports: {
        [midlRegtest.id]: http(MIDL_RPC_URL),
    },
});

/**
 * MIDL Network Details
 */
export const MIDL_NETWORK = {
    id: regtest.id,
    name: "Regtest",
    blockExplorer: "https://blockscout.regtest.midl.xyz",
};
