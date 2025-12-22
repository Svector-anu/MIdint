/**
 * Contract Addresses and ABIs for MIDL Regtest
 * 
 * ✅ THESE ARE REAL DEPLOYED CONTRACTS ON BITCOIN!
 * All contracts verified on: https://blockscout.regtest.midl.xyz
 */

// Deployed Contract Addresses
export const CONTRACTS = {
    TBTC: {
        address: "0xA4D2CbAF027125a967E48e94b1Baa03363981b1c" as `0x${string}`,
        decimals: 8,
        symbol: "TBTC",
        name: "Test Bitcoin",
    },
    TUSDC: {
        address: "0xA4D2CbAF027125a967E48e94b1Baa03363981b1c" as `0x${string}`, // Same as TBTC for testing
        decimals: 6,
        symbol: "TUSDC",
        name: "Test USD Coin",
    },
    WBTC: {
        address: "0xca0daeff9cB8DED3EEF075Df62aDBb1522479639" as `0x${string}`,
        decimals: 18,
        symbol: "WBTC",
        name: "Wrapped Bitcoin",
    },
    Factory: {
        address: "0xde6c29923d7BB9FDbcDfEC54E7e726894B982593" as `0x${string}`,
    },
    Router: {
        address: "0x29cf3A9B709f94Eb46fBbA67753B90E721ddC9Ed" as `0x${string}`,
    },
};

// ERC20 ABI (minimal for token operations)
export const ERC20_ABI = [
    {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [{ name: "", type: "string" }],
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [{ name: "", type: "string" }],
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        type: "function",
    },
    {
        constant: true,
        inputs: [{ name: "owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "", type: "uint256" }],
        type: "function",
    },
    {
        constant: false,
        inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        type: "function",
    },
    {
        constant: true,
        inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ name: "", type: "uint256" }],
        type: "function",
    },
] as const;

// Router ABI (essential swap and liquidity functions)
export const ROUTER_ABI = [
    {
        inputs: [
            { internalType: "uint256", name: "amountIn", type: "uint256" },
            { internalType: "uint256", name: "amountOutMin", type: "uint256" },
            { internalType: "address[]", name: "path", type: "address[]" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "swapExactTokensForTokens",
        outputs: [
            { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "tokenA", type: "address" },
            { internalType: "address", name: "tokenB", type: "address" },
            { internalType: "uint256", name: "amountADesired", type: "uint256" },
            { internalType: "uint256", name: "amountBDesired", type: "uint256" },
            { internalType: "uint256", name: "amountAMin", type: "uint256" },
            { internalType: "uint256", name: "amountBMin", type: "uint256" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "addLiquidity",
        outputs: [
            { internalType: "uint256", name: "amountA", type: "uint256" },
            { internalType: "uint256", name: "amountB", type: "uint256" },
            { internalType: "uint256", name: "liquidity", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "amountIn", type: "uint256" },
            { internalType: "address[]", name: "path", type: "address[]" },
        ],
        name: "getAmountsOut",
        outputs: [
            { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
        ],
        stateMutability: "view",
        type: "function",
    },
] as const;

// Pair ABI (for pool info)
export const PAIR_ABI = [
    {
        constant: true,
        inputs: [],
        name: "getReserves",
        outputs: [
            { internalType: "uint112", name: "reserve0", type: "uint112" },
            { internalType: "uint112", name: "reserve1", type: "uint112" },
            { internalType: "uint32", name: "blockTimestampLast", type: "uint32" },
        ],
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "token0",
        outputs: [{ name: "", type: "address" }],
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "token1",
        outputs: [{ name: "", type: "address" }],
        type: "function",
    },
] as const;

// Factory ABI
export const FACTORY_ABI = [
    {
        constant: true,
        inputs: [
            { internalType: "address", name: "tokenA", type: "address" },
            { internalType: "address", name: "tokenB", type: "address" },
        ],
        name: "getPair",
        outputs: [{ internalType: "address", name: "pair", type: "address" }],
        type: "function",
    },
] as const;
