import { useState } from "react";
import { useAccounts } from "@midl/react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { parseUnits } from "ethers";
import { CONTRACTS, ERC20_ABI } from "../config/contracts";
import { FaFaucet } from "react-icons/fa";

export default function TokenFaucet() {
    const { accounts } = useAccounts();

    // Use wagmi's useAccount which is patched by WagmiMidlProvider
    const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();

    console.log("MIDL accounts:", accounts);
    console.log("Wagmi address (derived EVM):", wagmiAddress);
    console.log("Wagmi connected:", wagmiConnected);

    // Use the wagmi-derived EVM address
    const userAddress = wagmiAddress;

    const [minting, setMinting] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
    const { isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

    // Log errors
    if (writeError) {
        console.error("Write contract error:", writeError);
    }

    const mintTokens = async (tokenSymbol: 'TBTC' | 'WBTC') => {
        if (!userAddress) {
            console.log("No EVM address from wagmi");
            setError("Wallet not properly connected. Try disconnecting and reconnecting.");
            return;
        }

        setMinting(tokenSymbol);
        setError(null);

        console.log(`Minting ${tokenSymbol} for ${userAddress}...`);

        try {
            const token = CONTRACTS[tokenSymbol];

            // For TBTC, call mint (it's a TestToken with public mint)
            if (tokenSymbol === 'TBTC') {
                const amount = parseUnits("1000", 8); // 1000 TBTC
                console.log(`Token address: ${token.address}`);
                console.log(`Amount: ${amount.toString()}`);
                console.log("Calling mint...");

                writeContract({
                    address: token.address,
                    abi: ERC20_ABI,
                    functionName: "mint",
                    args: [userAddress, amount],
                }, {
                    onSuccess: (data) => {
                        console.log("Mint tx submitted:", data);
                    },
                    onError: (err) => {
                        console.error("Mint failed:", err);
                        setError(err.message);
                        setMinting(null);
                    },
                });
            } else {
                // For WBTC, deposit requires native BTC
                const amount = parseUnits("1", 18); // 1 WBTC
                console.log(`Token address: ${token.address}`);
                console.log(`Amount: ${amount.toString()}`);
                console.log("Calling deposit...");

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
                }, {
                    onSuccess: (data) => {
                        console.log("Deposit tx submitted:", data);
                    },
                    onError: (err) => {
                        console.error("Deposit failed:", err);
                        setError(err.message);
                        setMinting(null);
                    },
                });
            }
        } catch (err: any) {
            console.error("Mint error:", err);
            setError(err.message || "Unknown error");
            setMinting(null);
        }
    };

    if (isSuccess && minting) {
        setTimeout(() => setMinting(null), 2000);
    }

    // Check if connected via MIDL accounts
    const hasMidlAccounts = accounts && accounts.length > 0;

    if (!hasMidlAccounts) {
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

            {/* Show connected addresses */}
            <div style={{
                fontSize: "0.7rem",
                color: "var(--text-tertiary)",
                marginBottom: "1rem",
                wordBreak: "break-all",
            }}>
                <div>BTC: {accounts?.[0]?.address}</div>
                <div>EVM: {userAddress || "Not derived yet"}</div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                    onClick={() => mintTokens('TBTC')}
                    disabled={isPending || isConfirming || !userAddress}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                >
                    {isPending && minting === 'TBTC' ? '⏳ Signing...' : isConfirming && minting === 'TBTC' ? '⏳ Confirming...' : 'Get 1,000 TBTC'}
                </button>

                <button
                    onClick={() => mintTokens('WBTC')}
                    disabled={isPending || isConfirming || !userAddress}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                >
                    {isPending && minting === 'WBTC' ? '⏳ Signing...' : isConfirming && minting === 'WBTC' ? '⏳ Confirming...' : 'Get 1 WBTC'}
                </button>
            </div>

            {/* Error Display */}
            {(error || writeError) && (
                <div style={{
                    marginTop: "1rem",
                    padding: "0.75rem",
                    background: "rgba(239, 68, 68, 0.1)",
                    borderRadius: "var(--radius-md)",
                    color: "#ef4444",
                    fontSize: "0.75rem",
                    textAlign: "center",
                    wordBreak: "break-word",
                }}>
                    ❌ {error || writeError?.message?.slice(0, 200)}
                </div>
            )}

            {/* Success Display */}
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

            {/* Hash Display */}
            {hash && (
                <div style={{
                    marginTop: "0.5rem",
                    fontSize: "0.75rem",
                    color: "var(--text-tertiary)",
                    textAlign: "center",
                    wordBreak: "break-all",
                }}>
                    Tx: {hash}
                </div>
            )}
        </div>
    );
}
