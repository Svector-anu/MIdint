import { useState } from "react";
import Header from "./components/Header";
import SwapInterface from "./components/SwapInterface";
import LiquidityInterface from "./components/LiquidityInterface";
import PoolInfo from "./components/PoolInfo";
import PoolsPage from "./components/PoolsPage";

type PageType = "trade" | "pools";
type TabType = "swap" | "liquidity";

function App() {
    const [activePage, setActivePage] = useState<PageType>("trade");
    const [activeTab, setActiveTab] = useState<TabType>("swap");

    return (
        <div id="root">
            <Header activePage={activePage} onPageChange={setActivePage} />

            <main className="container" style={{ padding: "3rem 1.5rem", flex: 1 }}>
                {activePage === "trade" ? (
                    <>
                        {/* Hero Section - Uniswap Style */}
                        <div style={{
                            textAlign: "center",
                            marginBottom: "3rem",
                            position: "relative",
                            zIndex: 1
                        }}>
                            <h1 style={{
                                fontSize: "3.5rem",
                                fontWeight: "800",
                                marginBottom: "1rem",
                                background: "linear-gradient(90deg, var(--gray-900) 0%, var(--midl-orange) 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text"
                            }}>
                                Swap anytime, anywhere.
                            </h1>
                            <p style={{
                                fontSize: "1.25rem",
                                color: "var(--gray-600)",
                                maxWidth: "600px",
                                margin: "0 auto"
                            }}>
                                Trade crypto on Bitcoin L1 with Uniswap V2
                            </p>
                        </div>

                        {/* Main Swap Container - Centered like Uniswap */}
                        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
                            {/* Tabs */}
                            <div className="tabs">
                                <button
                                    className={`tab ${activeTab === "swap" ? "active" : ""}`}
                                    onClick={() => setActiveTab("swap")}
                                >
                                    Swap
                                </button>
                                <button
                                    className={`tab ${activeTab === "liquidity" ? "active" : ""}`}
                                    onClick={() => setActiveTab("liquidity")}
                                >
                                    Liquidity
                                </button>
                            </div>

                            {/* Content */}
                            {activeTab === "swap" && <SwapInterface />}
                            {activeTab === "liquidity" && <LiquidityInterface />}
                        </div>

                        {/* Pool Stats Below */}
                        <div style={{ marginTop: "4rem" }}>
                            <PoolInfo />
                        </div>
                    </>
                ) : (
                    <PoolsPage />
                )}
            </main>

            <footer className="text-center" style={{ padding: "2rem", color: "var(--gray-500)" }}>
                <p>
                    Bitcoin DEX on MIDL
                </p>
            </footer>
        </div>
    );
}

export default App;
