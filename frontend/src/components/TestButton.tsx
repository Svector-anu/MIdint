import { useState } from "react";
import { useAccounts } from "@midl/react";
import { CONTRACTS } from "../config/contracts";

export default function TestButton() {
    const { accounts } = useAccounts();
    const [result, setResult] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const userAddress = accounts?.[0]?.address;

    const testBalance = async () => {
        if (!userAddress) {
            setResult("❌ No wallet connected");
            return;
        }

        setLoading(true);
        setResult("🔄 Checking balance...");

        try {
            // Properly encode balanceOf(address) call
            const balanceOfSelector = "0x70a08231";
            const paddedAddress = userAddress.toLowerCase().replace('0x', '').padStart(64, '0');
            const callData = balanceOfSelector + paddedAddress;

            const response = await fetch("https://rpc.regtest.midl.xyz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: 1,
                    method: "eth_call",
                    params: [
                        {
                            to: CONTRACTS.TBTC.address,
                            data: callData,
                        },
                        "latest",
                    ],
                }),
            });

            const data = await response.json();

            if (data.result) {
                const balance = BigInt(data.result);
                const formatted = Number(balance) / 10 ** 8;
                setResult(`✅ TBTC Balance: ${formatted.toFixed(2)}`);
            } else {
                setResult(`❌ RPC Error: ${data.error?.message || "Unknown"}`);
            }
        } catch (error) {
            setResult(`❌ ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                padding: "1.5rem",
                background: "var(--surface)",
                borderRadius: "var(--radius-lg)",
                border: "2px solid var(--midl-orange)",
                marginBottom: "1.5rem",
            }}
        >
            <h3 style={{ fontSize: "1.125rem", fontWeight: "700", marginBottom: "1rem" }}>
                🧪 Connection Test
            </h3>

            <div style={{ marginBottom: "1rem", fontSize: "0.875rem" }}>
                <strong>Wallet:</strong>{" "}
                {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : "Not connected"}
            </div>

            <button
                onClick={testBalance}
                disabled={!userAddress || loading}
                className="btn btn-primary"
                style={{ width: "100%", marginBottom: "1rem" }}
            >
                {loading ? "Testing..." : "Check TBTC Balance"}
            </button>

            {result && (
                <div
                    style={{
                        padding: "1rem",
                        background: result.startsWith("✅")
                            ? "rgba(34, 197, 94, 0.1)"
                            : "rgba(239, 68, 68, 0.1)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.875rem",
                        color: result.startsWith("✅") ? "#22c55e" : "#ef4444",
                    }}
                >
                    {result}
                </div>
            )}
        </div>
    );
}
