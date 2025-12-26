import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { CONTRACTS } from "../config/contracts";

interface Token {
    symbol: string;
    address: string;
    decimals: number;
    name: string;
}

interface TokenSelectorProps {
    selectedToken: Token;
    onSelect: (token: Token) => void;
    otherToken?: Token; // To prevent selecting the same token twice
}

export default function TokenSelector({ selectedToken, onSelect, otherToken }: TokenSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    // All available tokens
    const tokens = [CONTRACTS.TBTC, CONTRACTS.TUSDC, CONTRACTS.WBTC];

    const handleSelect = (token: Token) => {
        onSelect(token);
        setIsOpen(false);
    };

    return (
        <div style={{ position: "relative" }}>
            <button
                className="token-select"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius-lg)",
                    background: "var(--surface)",
                    border: "none",
                    transition: "var(--transition)",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--gray-100)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--surface)";
                }}
            >
                <div className="token-icon">{selectedToken.symbol[0]}</div>
                <span style={{ fontWeight: "600" }}>{selectedToken.symbol}</span>
                <FaChevronDown style={{ fontSize: "0.75rem", opacity: 0.6 }} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop to close dropdown */}
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 998,
                        }}
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown menu */}
                    <div
                        style={{
                            position: "absolute",
                            top: "calc(100% + 0.5rem)",
                            right: 0,
                            background: "var(--bg-primary)",
                            border: "1px solid var(--gray-200)",
                            borderRadius: "var(--radius-lg)",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                            zIndex: 999,
                            minWidth: "200px",
                            overflow: "hidden",
                        }}
                    >
                        <div style={{ padding: "0.5rem" }}>
                            <div
                                style={{
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    color: "var(--text-secondary)",
                                    padding: "0.5rem 0.75rem",
                                }}
                            >
                                Select Token
                            </div>

                            {tokens.map((token) => {
                                const isDisabled = otherToken && token.address === otherToken.address;
                                const isSelected = token.address === selectedToken.address;

                                return (
                                    <button
                                        key={token.address}
                                        onClick={() => !isDisabled && handleSelect(token)}
                                        disabled={isDisabled}
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.75rem",
                                            padding: "0.75rem",
                                            border: "none",
                                            background: isSelected
                                                ? "rgba(215, 123, 58, 0.1)"
                                                : "transparent",
                                            cursor: isDisabled ? "not-allowed" : "pointer",
                                            opacity: isDisabled ? 0.4 : 1,
                                            borderRadius: "var(--radius-md)",
                                            transition: "var(--transition)",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isDisabled) {
                                                e.currentTarget.style.background = isSelected
                                                    ? "rgba(215, 123, 58, 0.15)"
                                                    : "var(--gray-50)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = isSelected
                                                ? "rgba(215, 123, 58, 0.1)"
                                                : "transparent";
                                        }}
                                    >
                                        <div
                                            className="token-icon"
                                            style={{ width: "32px", height: "32px" }}
                                        >
                                            {token.symbol[0]}
                                        </div>
                                        <div style={{ textAlign: "left", flex: 1 }}>
                                            <div style={{ fontWeight: "600", fontSize: "1rem" }}>
                                                {token.symbol}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "0.75rem",
                                                    color: "var(--text-tertiary)",
                                                }}
                                            >
                                                {token.name}
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <div
                                                style={{
                                                    width: "8px",
                                                    height: "8px",
                                                    borderRadius: "50%",
                                                    background: "var(--midl-orange)",
                                                }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
