import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { CONTRACTS, ERC20_ABI } from "../config/contracts";
import { parseUnits } from "ethers";
import { useReadContracts, useAccounts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";

interface Token {
    symbol: string;
    address: string;
    decimals: number;
    name: string;
}

export default function LiquidityInterface() {
    const [tokenA] = useState<Token>(CONTRACTS.WBTC);
    const [tokenB] = useState<Token>(CONTRACTS.TBTC);
    const [amountA, setAmountA] = useState("");
    const [amountB, setAmountB] = useState("");
    const [step, setStep] = useState<'idle' | 'approve1' | 'approve2' | 'add'>('idle');

    const { addresses } = useAccounts();
    const userAddress = addresses?.[0];

    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isSuccess } = useWaitForTransactionReceipt({ hash });

    // Read token balances
    const { data: balances } = useReadContracts({
        contracts: [
            {
                address: tokenA.address as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "balanceOf",
                args: userAddress ? [userAddress] : undefined,
            },
            {
                address: tokenB.address as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "balanceOf",
                args: userAddress ? [userAddress] : undefined,
            },
        ],
        query: {
            enabled: Boolean(userAddress),
        },
    });

    const handleAddLiquidity = async () => {
        if (!userAddress || !amountA || !amountB) return;

        try {
            const amountADesired = parseUnits(amountA, tokenA.decimals);

            // Step 1: Approve tokenA
            setStep('approve1');
            writeContract({
                address: tokenA.address as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [CONTRACTS.Router.address, amountADesired],
            });
        } catch (error) {
            console.error("Error:", error);
            alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setStep('idle');
        }
    };

    // Handle approval success
    if (isSuccess && step === 'approve1') {
        const amountBDesired = parseUnits(amountB, tokenB.decimals);
        setStep('approve2');

        writeContract({
            address: tokenB.address as `0x${string}`,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [CONTRACTS.Router.address, amountBDesired],
        });
    }

    const balanceA = balances?.[0]?.result
        ? Number(balances[0].result as bigint) / 10 ** tokenA.decimals
        : 0;
    const balanceB = balances?.[1]?.result
        ? Number(balances[1].result as bigint) / 10 ** tokenB.decimals
        : 0;

    const getButtonText = () => {
        if (!userAddress) return "Connect Wallet";
        if (isPending) {
            if (step === 'approve1') return "Approving WBTC...";
            if (step === 'approve2') return "Approving TBTC...";
            if (step === 'add') return "Adding Liquidity...";
            return "Processing...";
        }
        if (!amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0) {
            return "Enter amounts";
        }
        return "Add Liquidity";
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title">Add Liquidity</h2>
            </div>

            <p style={{ color: "var(--gray-600)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
                Add liquidity to earn fees. You'll need to approve both tokens first.
            </p>

            {/* Token A */}
            <div className="token-input">
                <div className="token-input-top">
                    <div className="token-input-label">{tokenA.symbol}</div>
                    <div className="token-balance">
                        Balance: {balanceA.toFixed(6)}
                    </div>
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
                        <div className="token-icon">{tokenA.symbol[0]}</div>
                        <span>{tokenA.symbol}</span>
                    </div>
                </div>
            </div>

            {/* Plus Icon */}
            <div style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}>
                <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "var(--surface)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-secondary)",
                }}>
                    <FaPlus />
                </div>
            </div>

            {/* Token B */}
            <div className="token-input">
                <div className="token-input-top">
                    <div className="token-input-label">{tokenB.symbol}</div>
                    <div className="token-balance">
                        Balance: {balanceB.toFixed(6)}
                    </div>
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
                        <div className="token-icon">{tokenB.symbol[0]}</div>
                        <span>{tokenB.symbol}</span>
                    </div>
                </div>
            </div>

            {/* Price Info */}
            {amountA && amountB && (
                <div style={{
                    padding: "1rem",
                    background: "var(--gray-50)",
                    borderRadius: "var(--radius-md)",
                    marginTop: "1rem",
                    fontSize: "0.875rem",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ color: "var(--gray-600)" }}>Price</span>
                        <span style={{ fontWeight: "600" }}>
                            1 {tokenA.symbol} = {(parseFloat(amountB) / parseFloat(amountA)).toFixed(6)} {tokenB.symbol}
                        </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--gray-600)" }}>Network Fee</span>
                        <span style={{ fontWeight: "600", color: "var(--midl-orange)" }}>
                            ~0.0001 BTC
                        </span>
                    </div>
                </div>
            )}

            {/* Status */}
            {hash && (
                <div style={{
                    padding: "1rem",
                    background: "rgba(215, 123, 58, 0.1)",
                    borderRadius: "var(--radius-md)",
                    marginTop: "1rem",
                    fontSize: "0.875rem",
                    color: "var(--midl-orange)",
                }}>
                    {step === 'approve1' && "✓ Approving WBTC..."}
                    {step === 'approve2' && "✓ Approving TBTC..."}
                    {step === 'add' && "✓ Adding liquidity..."}
                    <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", opacity: 0.8 }}>
                        Tx: {hash.slice(0, 10)}...{hash.slice(-8)}
                    </div>
                </div>
            )}

            {/* Button */}
            <button
                className="btn btn-primary btn-lg w-full"
                style={{ marginTop: "1.5rem" }}
                onClick={handleAddLiquidity}
                disabled={
                    !userAddress ||
                    !amountA ||
                    !amountB ||
                    parseFloat(amountA) <= 0 ||
                    parseFloat(amountB) <= 0 ||
                    isPending
                }
            >
                {getButtonText()}
            </button>

            <div style={{
                textAlign: "center",
                marginTop: "1rem",
                fontSize: "0.875rem",
                color: "var(--gray-500)",
            }}>
                💡 You'll be asked to sign 3 transactions: 2 approvals + add liquidity
            </div>
        </div>
    );
}
