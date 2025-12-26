import { useAccounts, useConnect, useDisconnect } from "@midl/react";
import { AddressPurpose } from "@midl/core";
import { FaWallet } from "react-icons/fa";

interface HeaderProps {
    activePage: "trade" | "pools";
    onPageChange: (page: "trade" | "pools") => void;
}

export default function Header({ activePage, onPageChange }: HeaderProps) {
    const { isConnected, accounts } = useAccounts();
    const { disconnect } = useDisconnect();
    const { connectors, connect } = useConnect({
        purposes: [AddressPurpose.Ordinals],
    });

    const truncateAddress = (address: string | undefined) => {
        if (!address) return "";
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const handleConnect = () => {
        if (connectors && connectors.length > 0) {
            connect({ id: connectors[0].id });
        }
    };

    return (
        <header className="header">
            <div className="container header-content">
                <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                    <a href="/" className="logo" style={{ gap: "0.25rem" }}>
                        <div className="logo-icon">M</div>
                        <span>IDINT</span>
                    </a>

                    {/* Navigation like Uniswap */}
                    <nav style={{ display: "flex", gap: "1.5rem" }}>
                        <button
                            onClick={() => onPageChange("trade")}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "1rem",
                                fontWeight: "600",
                                color: activePage === "trade" ? "var(--midl-orange)" : "var(--gray-600)"
                            }}
                        >
                            Trade
                        </button>
                        <button
                            onClick={() => onPageChange("pools")}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "1rem",
                                fontWeight: "600",
                                color: activePage === "pools" ? "var(--midl-orange)" : "var(--gray-600)"
                            }}
                        >
                            Pool
                        </button>
                    </nav>
                </div>

                <nav className="nav">
                    {isConnected && accounts && accounts[0] ? (
                        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                            <div style={{
                                padding: "0.5rem 1rem",
                                background: "var(--gray-100)",
                                borderRadius: "var(--radius-full)",
                                fontSize: "0.875rem",
                                fontWeight: "600"
                            }}>
                                {truncateAddress(accounts[0].address)}
                            </div>
                            <button onClick={() => disconnect()} className="btn btn-secondary btn-sm">
                                Disconnect
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleConnect} className="btn btn-primary">
                            <FaWallet />
                            Connect Wallet
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}
