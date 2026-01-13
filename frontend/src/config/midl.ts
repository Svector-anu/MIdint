import { createMidlConfig } from "@midl/satoshi-kit";
import { regtest } from "@midl/core";
import { xverseConnector } from "@midl/connectors";
import type { Config } from "@midl/core";

/**
 * MIDL Configuration using SatoshiKit
 * This automatically sets up wallet connectors
 */
export const midlConfig = createMidlConfig({
    networks: [regtest],
    persist: true,
    connectors: [
        xverseConnector({
            metadata: {
                group: "popular",
            },
        }),
    ],
}) as Config;

/**
 * MIDL Network Details
 */
export const MIDL_NETWORK = {
    id: regtest.id,
    name: "Regtest",
    blockExplorer: "https://blockscout.regtest.midl.xyz",
};
