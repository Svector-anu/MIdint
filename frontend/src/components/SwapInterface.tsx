import { useState, useEffect } from "react";
import { FaArrowDown, FaCog } from "react-icons/fa";
import { CONTRACTS, ROUTER_ABI, ERC20_ABI } from "../config/contracts";
import { parseUnits, formatUnits } from "ethers";
import { useReadContracts, useWriteContract } from "wagmi";
import { useAccounts } from "@midl/react";

export default function SwapInterface() {
    const [fromAmount, setFromAmount] = useState("");
    const [toAmount, setToAmount] = useState("");
    const [status, setStatus] = useState("");

    const { accounts, isConnected } = useAccounts();
    const userAddress = accounts?.[0]?.address as `0x${string}` | undefined;

    const { writeContract, isPending } = useWriteContract();

    // Get estimated output amount from Router
    const { data: amountsOut } = useReadContracts({
        contracts: [
            {
                address: CONTRACTS.Router.address as `0x${string}`,
                abi: ROUTER_ABI,
                functionName: "getAmountsOut",
                args: fromAmount && parseFloat(fromAmount) > 0
                    ? [
                        parseUnits(fromAmount, CONTRACTS.TBTC.decimals),
                        [CONTRACTS.TBTC.address, CONTRACTS.TUSDC.address],
                    ]
                    : undefined,
            },
        ],
        query: { enabled: Boolean(fromAmount && parseFloat(fromAmount) > 0) },
    });

    // Update toAmount when estimate is fetched
    useEffect(() => {
        if (amountsOut?.[0]?.result) {
            const amounts = amountsOut[0].result as bigint[];
            if (amounts?.length > 1) {
                const output = formatUnits(amounts[1], CONTRACTS.TUSDC.decimals);
                setToAmount(parseFloat(output).toFixed(6));
            }
        } else if (fromAmount && parseFloat(fromAmount) > 0) {
            setToAmount("0.00");
        }
    }, [amountsOut, fromAmount]);

    const handleApprove = () => {
        if (!fromAmount) return;
        setStatus("Approving TBTC for swap...");
        writeContract({
            address: CONTRACTS.TBTC.address as `0x${string}`,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [CONTRACTS.Router.address, parseUnits(fromAmount, CONTRACTS.TBTC.decimals)],
        });
    };

    const handleSwap = () => {
        if (!fromAmount || !userAddress) return;
        setStatus("Swapping...");
        const deadline = Math.floor(Date.now() / 1000) + 3600;

        writeContract({
            address: CONTRACTS.Router.address as `0x${string}`,
            abi: ROUTER_ABI,
            functionName: "swapExactTokensForTokens",
            args: [
                parseUnits(fromAmount, CONTRACTS.TBTC.decimals),
                0n, // amountOutMin (0 for testing)
                [CONTRACTS.TBTC.address, CONTRACTS.TUSDC.address],
                userAddress,
                BigInt(deadline),
            ],
        });
    };

    const handleSwapTokens = () => {
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title">Swap</h2>
                <button className="btn btn-sm btn-secondary"><FaCog /></button>
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
                        <div className="token-icon">T</div>
                        <span>TBTC</span>
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
                        readOnly
                    />
                    <div className="token-select">
                        <div className="token-icon">T</div>
                        <span>TUSDC</span>
                    </div>
                </div>
            </div>

            {/* Status */}
            {status && (
                <div style={{
                    padding: "0.75rem",
                    background: "rgba(215, 123, 58, 0.1)",
                    borderRadius: "var(--radius-md)",
                    marginTop: "1rem",
                    fontSize: "0.875rem",
                    color: "var(--midl-orange)",
                }}>
                    {isPending ? "⏳ " : ""}{status}
                </div>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
                <button
                    className="btn btn-secondary"
                    onClick={handleApprove}
                    disabled={!isConnected || !fromAmount || isPending}
                    style={{ flex: 1 }}
                >
                    1. Approve
                </button>
                <button
                    className="btn btn-primary"
                    onClick={handleSwap}
                    disabled={!isConnected || !fromAmount || isPending}
                    style={{ flex: 1 }}
                >
                    2. Swap
                </button>
            </div>
        </div>
    );
}
