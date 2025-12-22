import { createConfig, regtest } from "@midl/core";
import { xverseConnector } from "@midl/connectors";

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
 * MIDL Network Details
 */
export const MIDL_NETWORK = {
    id: regtest.id,
    name: regtest.name,
    blockExplorer: "https://blockscout.regtest.midl.xyz",
};
