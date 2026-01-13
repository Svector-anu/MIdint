import { ConnectButton } from "@midl/satoshi-kit";

interface HeaderProps {
    activePage: "trade" | "pools";
    onPageChange: (page: "trade" | "pools") => void;
}

export default function Header({ activePage, onPageChange }: HeaderProps) {
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

                {/* SatoshiKit Connect Button */}
                <ConnectButton />
            </div>
        </header>
    );
}
