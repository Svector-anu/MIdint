import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { CONTRACTS, ERC20_ABI, ROUTER_ABI } from "../config/contracts";
import { parseUnits } from "ethers";
import { useAccounts } from "@midl/react";
import { useReadContracts, useWriteContract } from "wagmi";

export default function LiquidityInterface() {
    const [amountA, setAmountA] = useState("");
    const [amountB, setAmountB] = useState("");
    const [status, setStatus] = useState("");

    const { accounts, isConnected } = useAccounts();
    const userAddress = accounts?.[0]?.address as `0x${string}` | undefined;

    const { writeContract, isPending } = useWriteContract();

    // Read token balances
    const { data: balances } = useReadContracts({
        contracts: [
            {
                address: CONTRACTS.TBTC.address,
                abi: ERC20_ABI,
                functionName: "balanceOf",
                args: userAddress ? [userAddress] : undefined,
            },
            {
                address: CONTRACTS.WBTC.address,
                abi: ERC20_ABI,
                functionName: "balanceOf",
                args: userAddress ? [userAddress] : undefined,
            },
        ],
        query: { enabled: Boolean(userAddress) },
    });

    const balanceA = balances?.[0]?.result
        ? Number(balances[0].result as bigint) / 10 ** CONTRACTS.TBTC.decimals
        : 0;
    const balanceB = balances?.[1]?.result
        ? Number(balances[1].result as bigint) / 10 ** CONTRACTS.WBTC.decimals
        : 0;

    const handleApproveA = () => {
        if (!amountA) return;
        setStatus("Approving TBTC...");
        writeContract({
            address: CONTRACTS.TBTC.address,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [CONTRACTS.Router.address, parseUnits(amountA, CONTRACTS.TBTC.decimals)],
        });
    };

    const handleApproveB = () => {
        if (!amountB) return;
        setStatus("Approving WBTC...");
        writeContract({
            address: CONTRACTS.WBTC.address,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [CONTRACTS.Router.address, parseUnits(amountB, CONTRACTS.WBTC.decimals)],
        });
    };

    const handleAddLiquidity = () => {
        if (!amountA || !amountB || !userAddress) return;
        setStatus("Adding liquidity...");
        const deadline = Math.floor(Date.now() / 1000) + 3600;

        writeContract({
            address: CONTRACTS.Router.address,
            abi: ROUTER_ABI,
            functionName: "addLiquidity",
            args: [
                CONTRACTS.TBTC.address,
                CONTRACTS.WBTC.address,
                parseUnits(amountA, CONTRACTS.TBTC.decimals),
                parseUnits(amountB, CONTRACTS.WBTC.decimals),
                0n,
                0n,
                userAddress,
                BigInt(deadline),
            ],
        });
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title">Add Liquidity</h2>
            </div>

            {/* TBTC Input */}
            <div className="token-input">
                <div className="token-input-top">
                    <div className="token-input-label">TBTC</div>
                    <div className="token-balance">Balance: {balanceA.toFixed(4)}</div>
                </div>
                <div className="token-input-main">
                    <input
                        type="number"
                        className="token-amount"
                        placeholder="0.0"
                        value={amountA}
                        onChange={(e) => setAmountA(e.target.value)}
                    />
                    <div className="token-select">
                        <div className="token-icon">T</div>
                        <span>TBTC</span>
                    </div>
                </div>
            </div>

            {/* Plus Icon */}
            <div style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}>
                <FaPlus style={{ color: "var(--text-secondary)" }} />
            </div>

            {/* WBTC Input */}
            <div className="token-input">
                <div className="token-input-top">
                    <div className="token-input-label">WBTC</div>
                    <div className="token-balance">Balance: {balanceB.toFixed(4)}</div>
                </div>
                <div className="token-input-main">
                    <input
                        type="number"
                        className="token-amount"
                        placeholder="0.0"
                        value={amountB}
                        onChange={(e) => setAmountB(e.target.value)}
                    />
                    <div className="token-select">
                        <div className="token-icon">W</div>
                        <span>WBTC</span>
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
                    onClick={handleApproveA}
                    disabled={!isConnected || !amountA || isPending}
                    style={{ flex: 1 }}
                >
                    1. Approve TBTC
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={handleApproveB}
                    disabled={!isConnected || !amountB || isPending}
                    style={{ flex: 1 }}
                >
                    2. Approve WBTC
                </button>
            </div>

            <button
                className="btn btn-primary btn-lg w-full"
                style={{ marginTop: "0.75rem" }}
                onClick={handleAddLiquidity}
                disabled={!isConnected || !amountA || !amountB || isPending}
            >
                {!isConnected ? "Connect Wallet" : "3. Add Liquidity"}
            </button>
        </div>
    );
}
