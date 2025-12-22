import { useState, useEffect } from "react";
import { FaArrowDown, FaCog } from "react-icons/fa";
import { CONTRACTS, ROUTER_ABI } from "../config/contracts";
import { parseUnits, formatUnits } from "ethers";
import { useReadContracts } from "wagmi";
import TransactionModal from "./TransactionModal";

interface Token {
    symbol: string;
    address: string;
    decimals: number;
    name: string;
}

export default function SwapInterface() {
    const [fromToken, setFromToken] = useState<Token>(CONTRACTS.TBTC);
    const [toToken, setToToken] = useState<Token>(CONTRACTS.TUSDC);
    const [fromAmount, setFromAmount] = useState("");
    const [toAmount, setToAmount] = useState("");
    const [showTxModal, setShowTxModal] = useState(false);

    // Get estimated output amount from Router
    const { data: amountsOut, refetch: refetchAmounts } = useReadContracts({
        contracts: [
            {
                address: CONTRACTS.Router.address,
                abi: ROUTER_ABI,
                functionName: "getAmountsOut",
                args:
                    fromAmount && parseFloat(fromAmount) > 0
                        ? [
                            parseUnits(fromAmount, fromToken.decimals),
                            [fromToken.address, toToken.address],
                        ]
                        : undefined,
            },
        ],
        query: {
            enabled: Boolean(fromAmount && parseFloat(fromAmount) > 0),
        },
    });

    // Update toAmount when estimate is fetched
    useEffect(() => {
        if (amountsOut && amountsOut[0]?.result) {
            const amounts = amountsOut[0].result as bigint[];
            if (amounts && amounts.length > 1) {
                const outputAmount = formatUnits(amounts[1], toToken.decimals);
                setToAmount(parseFloat(outputAmount).toFixed(6));
            }
        } else if (fromAmount && parseFloat(fromAmount) > 0) {
            // Show 0 if no liquidity or error
            setToAmount("0.0");
        }
    }, [amountsOut, toToken.decimals, fromAmount]);

    // Refetch when inputs change
    useEffect(() => {
        if (fromAmount && parseFloat(fromAmount) > 0) {
            refetchAmounts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fromAmount, fromToken, toToken]);

    const handleSwapTokens = () => {
        setFromToken(toToken);
        setToToken(fromToken);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    };

    const handleSwap = () => {
        setShowTxModal(true);
        // Swap logic will be implemented in useSwap hook
    };

    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Swap</h2>
                    <button className="btn btn-sm btn-secondary">
                        <FaCog />
                    </button>
                </div>

                {/* From Token */}
                <div className="token-input">
                    <div className="token-input-top">
                        <div className="token-input-label">From</div>
                        <div className="token-balance">Balance: 0.00</div>
                    </div>
                    <div className="token-input-main">
                        <input
                            type="number"
                            className="token-amount"
                            placeholder="0.0"
                            value={fromAmount}
                            onChange={(e) => setFromAmount(e.target.value)}
                        />
                        <div className="token-select">
                            <div className="token-icon">{fromToken.symbol[0]}</div>
                            <span>{fromToken.symbol}</span>
                        </div>
                    </div>
                </div>

                {/* Swap Arrow */}
                <div className="swap-arrow-container">
                    <button className="swap-arrow" onClick={handleSwapTokens}>
                        <FaArrowDown />
                    </button>
                </div>

                {/* To Token */}
                <div className="token-input">
                    <div className="token-input-top">
                        <div className="token-input-label">To</div>
                        <div className="token-balance">Balance: 0.00</div>
                    </div>
                    <div className="token-input-main">
                        <input
                            type="number"
                            className="token-amount"
                            placeholder="0.0"
                            value={toAmount}
                            onChange={(e) => setToAmount(e.target.value)}
                            readOnly
                        />
                        <div className="token-select">
                            <div className="token-icon">{toToken.symbol[0]}</div>
                            <span>{toToken.symbol}</span>
                        </div>
                    </div>
                </div>

                {/* Price Info */}
                {fromAmount && toAmount && parseFloat(toAmount) > 0 && (
                    <div
                        style={{
                            padding: "1rem",
                            background: "var(--gray-50)",
                            borderRadius: "var(--radius-md)",
                            marginTop: "1rem",
                            fontSize: "0.875rem",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "0.5rem",
                            }}
                        >
                            <span style={{ color: "var(--gray-600)" }}>Price</span>
                            <span style={{ fontWeight: "600" }}>
                                1 {fromToken.symbol} ≈{" "}
                                {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)}{" "}
                                {toToken.symbol}
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "0.5rem",
                            }}
                        >
                            <span style={{ color: "var(--gray-600)" }}>Slippage</span>
                            <span style={{ fontWeight: "600" }}>0.5%</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "var(--gray-600)" }}>Network Fee</span>
                            <span style={{ fontWeight: "600", color: "var(--midl-orange)" }}>
                                ~0.0001 BTC
                            </span>
                        </div>
                    </div>
                )}

                {/* Swap Button */}
                <button
                    className="btn btn-primary btn-lg w-full"
                    style={{ marginTop: "1.5rem" }}
                    onClick={handleSwap}
                    disabled={!fromAmount || parseFloat(fromAmount) <= 0}
                >
                    {!fromAmount || parseFloat(fromAmount) <= 0
                        ? "Enter an amount"
                        : "Swap"}
                </button>

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "1rem",
                        fontSize: "0.875rem",
                        color: "var(--gray-500)",
                    }}
                >
                    💡 This swap requires a Bitcoin L1 transaction
                </div>
            </div>

            {showTxModal && (
                <TransactionModal onClose={() => setShowTxModal(false)} type="swap" />
            )}
        </>
    );
}
