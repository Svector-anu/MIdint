import { useState } from "react";
import Header from "./components/Header";
import SwapInterface from "./components/SwapInterface";
import LiquidityInterface from "./components/LiquidityInterface";
import PoolsPage from "./components/PoolsPage";

export default function App() {
    const [activePage, setActivePage] = useState<"trade" | "pools">("trade");
    const [activeTab, setActiveTab] = useState<"swap" | "liquidity">("swap");

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
            <Header activePage={activePage} onPageChange={setActivePage} />

            <main className="container" style={{ paddingTop: "2rem" }}>
                {activePage === "trade" ? (
                    <div style={{ maxWidth: "480px", margin: "0 auto" }}>
                        <h1
                            style={{
                                fontSize: "2.5rem",
                                fontWeight: "800",
                                marginBottom: "1rem",
                                textAlign: "center",
                            }}
                        >
                            Trade on Bitcoin L1
                        </h1>
                        <p
                            style={{
                                color: "var(--text-secondary)",
                                textAlign: "center",
                                marginBottom: "2rem",
                            }}
                        >
                            Powered by MIDL Protocol
                        </p>

                        {/* Tab Navigation */}
                        <div className="tabs">
                            <button
                                className={activeTab === "swap" ? "tab active" : "tab"}
                                onClick={() => setActiveTab("swap")}
                            >
                                Swap
                            </button>
                            <button
                                className={activeTab === "liquidity" ? "tab active" : "tab"}
                                onClick={() => setActiveTab("liquidity")}
                            >
                                Liquidity
                            </button>
                        </div>

                        {/* Active Interface */}
                        {activeTab === "swap" ? <SwapInterface /> : <LiquidityInterface />}
                    </div>
                ) : (
                    <PoolsPage />
                )}
            </main>
        </div>
    );
}
