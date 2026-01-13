import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import "@midl/satoshi-kit/styles.css";
import { MidlProvider } from "@midl/react";
import { SatoshiKitProvider } from "@midl/satoshi-kit";
import { WagmiMidlProvider } from "@midl/executor-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { midlConfig } from "./config/midl";
import { midlRegtest } from "@midl/executor";
import { AddressPurpose } from "@midl/core";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <MidlProvider config={midlConfig}>
            <QueryClientProvider client={queryClient}>
                <SatoshiKitProvider
                    config={midlConfig}
                    purposes={[AddressPurpose.Payment, AddressPurpose.Ordinals]}
                >
                    <WagmiMidlProvider chain={midlRegtest}>
                        <App />
                    </WagmiMidlProvider>
                </SatoshiKitProvider>
            </QueryClientProvider>
        </MidlProvider>
    </React.StrictMode>
);
