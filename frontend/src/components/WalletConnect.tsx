import { AddressPurpose } from "@midl/core";
import { useConnect } from "@midl/react";
import { FaBitcoin, FaWallet } from "react-icons/fa";

export default function WalletConnect() {
    const { connectors, connect } = useConnect({
        purposes: [AddressPurpose.Ordinals], // CRITICAL: Must specify purposes!
    });

    return (
        <div className="card" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "2rem" }}>
                <div className="logo-icon" style={{
                    width: "80px",
                    height: "80px",
                    margin: "0 auto 1rem",
                    fontSize: "2.5rem"
                }}>
                    M
                </div>
                <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                    Welcome to Bitcoin DEX
                </h1>
                <p style={{ color: "var(--gray-600)", fontSize: "1.125rem" }}>
                    The first Uniswap-style DEX on Bitcoin, powered by MIDL
                </p>
            </div>

            <div style={{
                padding: "1.5rem",
                background: "var(--gray-50)",
                borderRadius: "var(--radius-lg)",
                marginBottom: "2rem"
            }}>
                <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap" }}>
                    <div style={{ textAlign: "center" }}>
                        <FaBitcoin style={{ fontSize: "2rem", color: "var(--midl-orange)", marginBottom: "0.5rem" }} />
                        <div style={{ fontWeight: "600" }}>Bitcoin Security</div>
                        <div style={{ fontSize: "0.875rem", color: "var(--gray-600)" }}>L1 Settlement</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚡</div>
                        <div style={{ fontWeight: "600" }}>EVM Smart Contracts</div>
                        <div style={{ fontSize: "0.875rem", color: "var(--gray-600)" }}>Full DeFi Power</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔒</div>
                        <div style={{ fontWeight: "600" }}>Battle-Tested</div>
                        <div style={{ fontSize: "0.875rem", color: "var(--gray-600)" }}>Uniswap V2</div>
                    </div>
                </div>
            </div>

            <div>
                <h3 style={{ marginBottom: "1rem" }}>Connect Your Wallet</h3>
                {connectors?.map((connector) => (
                    <button
                        key={connector.id}
                        type="button"
                        onClick={() => connect({ id: connector.id })}
                        className="btn btn-primary btn-lg w-full"
                        style={{ marginBottom: "0.75rem" }}
                    >
                        <FaWallet />
                        Connect with {connector.id}
                    </button>
                ))}
            </div>

            <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "1.5rem" }}>
                By connecting, you agree to the terms of service
            </p>
        </div>
    );
}
