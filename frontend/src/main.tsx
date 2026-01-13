import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import { MidlProvider } from "@midl/react";
import { WagmiMidlProvider } from "@midl/executor-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { midlConfig } from "./config/midl";
import { midlRegtest } from "@midl/executor";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <MidlProvider config={midlConfig}>
            <QueryClientProvider client={queryClient}>
                <WagmiMidlProvider chain={midlRegtest}>
                    <App />
                </WagmiMidlProvider>
            </QueryClientProvider>
        </MidlProvider>
    </React.StrictMode>
);

