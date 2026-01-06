import { useState } from "react";
import { useAccounts } from "@midl/react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "ethers";
import { CONTRACTS, ERC20_ABI } from "../config/contracts";
import { FaFaucet } from "react-icons/fa";

export default function TokenFaucet() {
    const { accounts } = useAccounts();
    const userAddress = accounts?.[0]?.address as `0x${string}` | undefined;
    const [minting, setMinting] = useState<string | null>(null);

    const { writeContract, data: hash } = useWriteContract();
    const { isSuccess } = useWaitForTransactionReceipt({ hash });

    const mintTokens = async (tokenSymbol: 'TBTC' | 'WBTC') => {
        if (!userAddress) return;

        setMinting(tokenSymbol);

        try {
            const token = CONTRACTS[tokenSymbol];
            const amount = tokenSymbol === 'WBTC'
                ? parseUnits("10", 18)  // 10 WBTC
                : parseUnits("1000", 8);  // 1000 TBTC

            // For TBTC, call mint (it's a TestToken)
            if (tokenSymbol === 'TBTC') {
                writeContract({
                    address: token.address,
                    abi: ERC20_ABI,
                    functionName: "mint",
                    args: [userAddress, amount],
                });
            } else {
                // For WBTC, deposit native BTC (send value)
                writeContract({
                    address: token.address,
                    abi: [{
                        "inputs": [],
                        "name": "deposit",
                        "outputs": [],
                        "stateMutability": "payable",
                        "type": "function"
                    }],
                    functionName: "deposit",
                    value: amount,
                });
            }
        } catch (error) {
            console.error("Mint error:", error);
            setMinting(null);
        }
    };

    if (isSuccess && minting) {
        setTimeout(() => setMinting(null), 2000);
    }

    if (!userAddress) {
        return (
            <div style={{
                padding: "1rem",
                background: "var(--gray-50)",
                borderRadius: "var(--radius-lg)",
                textAlign: "center",
                color: "var(--text-secondary)",
            }}>
                Connect wallet to get test tokens
            </div>
        );
    }

    return (
        <div style={{
            padding: "1.5rem",
            background: "var(--surface)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--gray-200)",
            marginBottom: "1.5rem",
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1rem",
            }}>
                <FaFaucet style={{ fontSize: "1.5rem", color: "var(--midl-orange)" }} />
                <div>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: "700", marginBottom: "0.25rem" }}>
                        Test Token Faucet
                    </h3>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                        Get free test tokens for the DEX
                    </p>
                </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                    onClick={() => mintTokens('TBTC')}
                    disabled={minting === 'TBTC'}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                >
                    {minting === 'TBTC' ? '⏳' : 'Get 1,000 TBTC'}
                </button>

                <button
                    onClick={() => mintTokens('WBTC')}
                    disabled={minting === 'WBTC'}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                >
                    {minting === 'WBTC' ? '⏳' : 'Get 10 WBTC'}
                </button>
            </div>

            {isSuccess && (
                <div style={{
                    marginTop: "1rem",
                    padding: "0.75rem",
                    background: "rgba(34, 197, 94, 0.1)",
                    borderRadius: "var(--radius-md)",
                    color: "#22c55e",
                    fontSize: "0.875rem",
                    textAlign: "center",
                }}>
                    ✅ Tokens minted successfully!
                </div>
            )}
        </div>
    );
}
