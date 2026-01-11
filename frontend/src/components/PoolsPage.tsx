import { useState, useEffect } from "react";
import { FaPlus, FaArrowRight } from "react-icons/fa";
import { useAccounts, useConnect } from "@midl/react";
import { AddressPurpose } from "@midl/core";
import { useReadContract, useReadContracts } from "wagmi";
import { CONTRACTS, FACTORY_ABI, PAIR_ABI } from "../config/contracts";
import { formatUnits } from "ethers";

interface Pool {
    token0: string;
    token1: string;
    token0Symbol: string;
    token1Symbol: string;
    tvl: string;
    apr: string;
    volume24h: string;
    reserve0?: string;
    reserve1?: string;
    pairAddress?: string;
}

export default function PoolsPage() {
    const { isConnected } = useAccounts();
    const { connectors, connect } = useConnect({
        purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
    });

    const handleConnect = () => {
        if (connectors && connectors.length > 0) {
            connect({ id: connectors[0].id });
        }
    };

    // 1. Get Pair Address
    const { data: pairAddress } = useReadContract({
        address: CONTRACTS.Factory.address,
        abi: FACTORY_ABI,
        functionName: "getPair",
        args: [CONTRACTS.TBTC.address, CONTRACTS.WBTC.address],
    });

    // 2. Get Reserves if pair exists
    const { data: reserves } = useReadContract({
        address: pairAddress as `0x${string}`,
        abi: PAIR_ABI,
        functionName: "getReserves",
        query: { enabled: !!pairAddress && pairAddress !== "0x0000000000000000000000000000000000000000" },
    });

    const [poolData, setPoolData] = useState<Pool | null>(null);

    useEffect(() => {
        if (reserves) {
            // @ts-ignore
            const [reserve0, reserve1] = reserves;
            // Assuming token0 is TBTC (lower address usually, but we should check token0/token1)
            // For Regtest simplicity we just show raw values

            const r0 = formatUnits(reserve0, CONTRACTS.TBTC.decimals); // Simplified assumption
            const r1 = formatUnits(reserve1, CONTRACTS.WBTC.decimals);

            setPoolData({
                token0: "TBTC",
                token1: "WBTC",
                token0Symbol: "T",
                token1Symbol: "W",
                tvl: `$${(parseFloat(r0) * 60000 + parseFloat(r1) * 60000).toLocaleString()}`, // Mock Price $60k
                apr: "12.5%", // Mock APR
                volume24h: "0.0%",
                reserve0: parseFloat(r0).toFixed(4),
                reserve1: parseFloat(r1).toFixed(4),
                pairAddress: pairAddress as string,
            });
        }
    }, [reserves, pairAddress]);

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
                        ) : (
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
                        {poolData ? (
                            <div
                                className="card"
                                style={{
                                    padding: "1rem 1.25rem",
                                    cursor: "pointer",
                                    transition: "var(--transition)"
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
                                                {poolData.token0Symbol}
                                            </div>
                                            <div className="token-icon" style={{
                                                position: "absolute",
                                                left: "16px",
                                                zIndex: 1,
                                                width: "32px",
                                                height: "32px",
                                                background: "var(--midl-orange-dark)"
                                            }}>
                                                {poolData.token1Symbol}
                                            </div>
                                        </div>

                                        {/* Pool Name */}
                                        <div>
                                            <div style={{
                                                fontWeight: "600",
                                                fontSize: "1rem",
                                                marginBottom: "0.25rem"
                                            }}>
                                                {poolData.token0} / {poolData.token1}
                                            </div>
                                            <div style={{
                                                fontSize: "0.75rem",
                                                color: "var(--text-tertiary)",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.5rem"
                                            }}>
                                                <span>Res: {poolData.reserve0} / {poolData.reserve1}</span>
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
                                            {poolData.apr} APR
                                        </div>
                                        <div style={{
                                            fontSize: "0.75rem",
                                            color: "var(--text-tertiary)",
                                            marginTop: "0.25rem"
                                        }}>
                                            TVL {poolData.tvl}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: "1rem", color: "var(--text-secondary)", textAlign: "center" }}>
                                {pairAddress && pairAddress !== "0x0000000000000000000000000000000000000000"
                                    ? "Loading pool data..."
                                    : "No active pools found"}
                            </div>
                        )}
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
