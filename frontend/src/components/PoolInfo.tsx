import { FaChartLine, FaCoins, FaExchangeAlt } from "react-icons/fa";

export default function PoolInfo() {
    // These would come from contract reads in a real implementation
    const poolStats = {
        totalLiquidity: "125,430",
        tbtcReserve: "4.18",
        tusdcReserve: "125,430",
        volume24h: "45,230",
    };

    return (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-label">
                    <FaCoins style={{ display: "inline", marginRight: "0.5rem", color: "var(--midl-orange)" }} />
                    Total Liquidity
                </div>
                <div className="stat-value">${poolStats.totalLiquidity}</div>
                <div className="stat-change positive">+12.5% this week</div>
            </div>

            <div className="stat-card">
                <div className="stat-label">
                    <FaChartLine style={{ display: "inline", marginRight: "0.5rem", color: "var(--midl-orange)" }} />
                    24h Volume
                </div>
                <div className="stat-value">${poolStats.volume24h}</div>
                <div className="stat-change positive">+8.3% from yesterday</div>
            </div>

            <div className="stat-card">
                <div className="stat-label">
                    <FaExchangeAlt style={{ display: "inline", marginRight: "0.5rem", color: "var(--midl-orange)" }} />
                    TBTC/TUSDC Pool
                </div>
                <div className="stat-value" style={{ fontSize: "1rem" }}>
                    {poolStats.tbtcReserve} TBTC
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--gray-600)", marginTop: "0.25rem" }}>
                    {poolStats.tusdcReserve} TUSDC
                </div>
            </div>
        </div>
    );
}
