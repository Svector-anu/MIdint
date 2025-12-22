import { useState } from "react";
import { FaPlus, FaArrowRight } from "react-icons/fa";
import { useAccounts, useConnect } from "@midl/react";
import { AddressPurpose } from "@midl/core";

interface Pool {
    token0: string;
    token1: string;
    token0Symbol: string;
    token1Symbol: string;
    tvl: string;
    apr: string;
    volume24h: string;
}

export default function PoolsPage() {
    const [hasPositions] = useState(false); // Will be true when user has liquidity
    const { isConnected } = useAccounts();
    const { connectors, connect } = useConnect({
        purposes: [AddressPurpose.Ordinals],
    });

    const handleConnect = () => {
        if (connectors && connectors.length > 0) {
            connect({ id: connectors[0].id });
        }
    };

    // Mock data - will be replaced with real contract data
    const topPools: Pool[] = [
        {
            token0: "WBTC",
            token1: "TBTC",
            token0Symbol: "W",
            token1Symbol: "T",
            tvl: "$0",
            apr: "0.00%",
            volume24h: "0.3%",
        },
        {
            token0: "TBTC",
            token1: "TUSDC",
            token0Symbol: "T",
            token1Symbol: "U",
            tvl: "$0",
            apr: "60.19%",
            volume24h: "0.3%",
        },
        {
            token0: "TBTC",
            token1: "TUSDC",
            token0Symbol: "T",
            token1Symbol: "C",
            tvl: "$0",
            apr: "25.4%",
            volume24h: "0.06%",
        },
    ];

    return (
        <div className="container" style={{ padding: "2rem 1.5rem", maxWidth: "1400px" }}>
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 400px",
                gap: "2rem",
                alignItems: "start"
            }}>
                {/* Left: Your Positions */}
                <div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "2rem" }}>
                        Pools
                    </h1>

                    <div className="card" style={{ minHeight: "400px", display: "flex", flexDirection: "column" }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "2rem"
                        }}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Your positions</h2>
                            <button className="btn btn-primary">
                                <FaPlus /> New position
                            </button>
                        </div>

                        {!isConnected ? (
                            <div style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                padding: "3rem 1rem"
                            }}>
                                <div style={{
                                    width: "80px",
                                    height: "80px",
                                    background: "var(--surface)",
                                    borderRadius: "var(--radius-lg)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "1.5rem",
                                    fontSize: "2rem"
                                }}>
                                    📋
                                </div>
                                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                                    Connect your wallet
                                </h3>
                                <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                                    To view your positions and rewards you must connect your wallet.
                                </p>
                                <button className="btn btn-secondary" onClick={handleConnect}>
                                    Connect wallet
                                </button>
                            </div>
                        ) : !hasPositions ? (
                            <div style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                padding: "3rem 1rem"
                            }}>
                                <div>
                                    <div style={{
                                        fontSize: "3rem",
                                        marginBottom: "1rem"
                                    }}>
                                        💧
                                    </div>
                                    <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                                        No liquidity positions
                                    </h3>
                                    <p style={{ color: "var(--text-secondary)" }}>
                                        Add liquidity to start earning fees
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {/* Will show user's liquidity positions here */}
                                <p style={{ color: "var(--text-secondary)" }}>Loading positions...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Top Pools by TVL */}
                <div>
                    <h2 style={{
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        marginBottom: "1.5rem",
                        marginTop: "4.5rem" // Align with "Pools" title
                    }}>
                        Top pools by TVL
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {topPools.map((pool, index) => (
                            <div
                                key={index}
                                className="card"
                                style={{
                                    padding: "1rem 1.25rem",
                                    cursor: "pointer",
                                    transition: "var(--transition)"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "var(--surface)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "var(--bg-secondary)";
                                }}
                            >
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        {/* Token Icons */}
                                        <div style={{ position: "relative", width: "48px", height: "32px" }}>
                                            <div className="token-icon" style={{
                                                position: "absolute",
                                                left: 0,
                                                zIndex: 2,
                                                width: "32px",
                                                height: "32px"
                                            }}>
                                                {pool.token0Symbol}
                                            </div>
                                            <div className="token-icon" style={{
                                                position: "absolute",
                                                left: "16px",
                                                zIndex: 1,
                                                width: "32px",
                                                height: "32px",
                                                background: "var(--midl-orange-dark)"
                                            }}>
                                                {pool.token1Symbol}
                                            </div>
                                        </div>

                                        {/* Pool Name */}
                                        <div>
                                            <div style={{
                                                fontWeight: "600",
                                                fontSize: "1rem",
                                                marginBottom: "0.25rem"
                                            }}>
                                                {pool.token0} / {pool.token1}
                                            </div>
                                            <div style={{
                                                fontSize: "0.75rem",
                                                color: "var(--text-tertiary)",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.5rem"
                                            }}>
                                                <span>v3</span>
                                                <span>•</span>
                                                <span>{pool.volume24h}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* APR */}
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{
                                            fontWeight: "700",
                                            fontSize: "1.125rem",
                                            color: "var(--text-primary)"
                                        }}>
                                            {pool.apr} APR
                                        </div>
                                        <div style={{
                                            fontSize: "0.75rem",
                                            color: "var(--text-tertiary)",
                                            marginTop: "0.25rem"
                                        }}>
                                            TVL {pool.tvl}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Explore More Pools */}
                    <button
                        style={{
                            width: "100%",
                            marginTop: "1rem",
                            padding: "0.875rem",
                            background: "transparent",
                            border: "none",
                            color: "var(--text-secondary)",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            transition: "var(--transition)",
                            borderRadius: "var(--radius-md)"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "var(--surface)";
                            e.currentTarget.style.color = "var(--text-primary)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "var(--text-secondary)";
                        }}
                    >
                        Explore more pools <FaArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
}
