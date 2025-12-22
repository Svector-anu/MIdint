import { useState } from "react";
import { FaTimes, FaCheck, FaSpinner } from "react-icons/fa";

interface TransactionModalProps {
    onClose: () => void;
    type: "swap" | "liquidity";
}

type StepStatus = "pending" | "active" | "complete";

interface TxStep {
    number: number;
    title: string;
    description: string;
    status: StepStatus;
}

export default function TransactionModal({ onClose, type }: TransactionModalProps) {
    const [currentStep, setCurrentStep] = useState(1);

    const swapSteps: TxStep[] = [
        {
            number: 1,
            title: "Add Transaction Intention",
            description: "Preparing swap parameters",
            status: currentStep > 1 ? "complete" : "active",
        },
        {
            number: 2,
            title: "Finalize BTC Transaction",
            description: "Calculating fees and forming Bitcoin tx",
            status: currentStep > 2 ? "complete" : currentStep === 2 ? "active" : "pending",
        },
        {
            number: 3,
            title: "Sign Intentions",
            description: "Sign with your Bitcoin wallet",
            status: currentStep > 3 ? "complete" : currentStep === 3 ? "active" : "pending",
        },
        {
            number: 4,
            title: "Broadcast Transactions",
            description: "Publishing to MIDL and Bitcoin networks",
            status: currentStep > 4 ? "complete" : currentStep === 4 ? "active" : "pending",
        },
    ];

    const liquiditySteps: TxStep[] = [
        {
            number: 1,
            title: "Approve Tokens",
            description: "Approve TBTC and TUSDC spending",
            status: currentStep > 1 ? "complete" : "active",
        },
        {
            number: 2,
            title: "Add Liquidity Intention",
            description: "Preparing liquidity parameters",
            status: currentStep > 2 ? "complete" : currentStep === 2 ? "active" : "pending",
        },
        {
            number: 3,
            title: "Finalize BTC Transaction",
            description: "Calculating fees and forming Bitcoin tx",
            status: currentStep > 3 ? "complete" : currentStep === 3 ? "active" : "pending",
        },
        {
            number: 4,
            title: "Sign & Broadcast",
            description: "Sign and publish to networks",
            status: currentStep > 4 ? "complete" : currentStep === 4 ? "active" : "pending",
        },
    ];

    const steps = type === "swap" ? swapSteps : liquiditySteps;

    // Simulate progress
    const handleContinue = () => {
        if (currentStep < steps.length) {
            setTimeout(() => {
                setCurrentStep(currentStep + 1);
            }, 1000);
        } else {
            // All complete
            setTimeout(() => {
                onClose();
            }, 2000);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">
                        {type === "swap" ? "Swap Transaction" : "Add Liquidity"}
                    </h3>
                    <button className="modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="tx-steps">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className={`tx-step ${step.status === "active" ? "active" : ""} ${step.status === "complete" ? "complete" : ""
                                }`}
                        >
                            <div className="tx-step-number">
                                {step.status === "complete" ? (
                                    <FaCheck />
                                ) : step.status === "active" ? (
                                    <FaSpinner className="loading-spinner" style={{ width: "16px", height: "16px", border: "2px solid" }} />
                                ) : (
                                    step.number
                                )}
                            </div>
                            <div className="tx-step-content">
                                <div className="tx-step-title">{step.title}</div>
                                <div className="tx-step-desc">{step.description}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {currentStep <= steps.length && (
                    <div style={{ marginTop: "1.5rem" }}>
                        <button className="btn btn-primary btn-lg w-full" onClick={handleContinue}>
                            {currentStep === 1 ? "Start" : currentStep < steps.length ? "Continue" : "Finish"}
                        </button>
                    </div>
                )}

                {currentStep > steps.length && (
                    <div className="alert alert-success" style={{ marginTop: "1.5rem" }}>
                        <FaCheck style={{ marginRight: "0.5rem" }} />
                        Transaction successful! View on{" "}
                        <a href="https://blockscout.regtest.midl.xyz" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", fontWeight: "bold" }}>
                            block explorer
                        </a>
                    </div>
                )}

                <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "1rem", textAlign: "center" }}>
                    💡 This is a demo flow. In production, this would interact with your wallet and MIDL network.
                </p>
            </div>
        </div>
    );
}
