# 🚀 Bitcoin DEX on MIDL

The first Uniswap-style decentralized exchange running on Bitcoin, powered by MIDL Protocol.

![MIDL Logo](./frontend/public/midl-logo.png)

## 🌟 What is This?

This is a **complete starter kit** demonstrating how to build a production-ready DEX on Bitcoin using:
- **MIDL Protocol** - EVM compatibility on Bitcoin L1
- **Uniswap V2** - Battle-tested AMM contracts
- **React + TypeScript** - Modern frontend with beautiful MIDL-branded UI

## 🏗️ Architecture

```
Uniswap V2 Contracts (Factory, Pair, Router02)
              ↓
      MIDL EVM Layer (Smart Contract Execution)
              ↓
      Bitcoin L1 (Settlement & Security)
```

Every transaction requires:
1. **EVM Transaction** - Smart contract interaction
2. **Bitcoin Transaction** - Fees and asset transfers
3. **MIDL Flow** - Links both via transaction intentions

## 📁 Project Structure

```
bitcoin-dex/
├── contracts/              # Smart contracts (Hardhat)
│   ├── contracts/          # Solidity contracts
│   │   ├── TestToken.sol          # ERC-20 test tokens
│   │   ├── WBTC.sol               # Wrapped Bitcoin
│   │   ├── UniswapV2Factory.sol   # Creates pairs
│   │   ├── UniswapV2Pair.sol      # Pool logic
│   │   └── UniswapV2Router02.sol  # User-facing router
│   ├── deploy/             # Deployment scripts
│   └── hardhat.config.ts   # MIDL configuration
│
└── frontend/               # React UI (Vite)
    ├── src/
    │   ├── components/     # React components
    │   ├── config/         # MIDL & contract config
    │   ├── hooks/          # Custom React hooks
    │   └── styles/         # MIDL-branded CSS
    └── package.json        # Frontend dependencies
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **pnpm** (or npm/yarn)
- **Bitcoin testnet funds** from [MIDL Faucet](https://faucet.midl.xyz)
- **Xverse Wallet** (or MIDL-compatible wallet)

### 1. Install Dependencies

```bash
# Install contract dependencies
cd contracts
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

### 2. Configure Your Wallet

Set your Bitcoin mnemonic for deployment:

```bash
cd contracts
npx hardhat vars set MNEMONIC
# Paste your 12/24 word seed phrase
```

⚠️ **Security**: Never commit your mnemonic! Use a test wallet only.

### 3. Get Your Bitcoin Address

```bash
cd contracts
pnpm run address
```

Output:
```
Bitcoin Address: bcrt1q... (p2wpkh)
EVM Address: 0x...
```

Fund this address at [https://faucet.regtest.midl.xyz/](https://faucet.regtest.midl.xyz/)

### 4. Deploy Contracts

```bash
cd contracts
pnpm run deploy
```

This deploys:
- ✅ TBTC and TUSDC test tokens
- ✅ WBTC (Wrapped Bitcoin)
- ✅ Uniswap V2 Factory
- ✅ Uniswap V2 Router02
- ✅ TBTC/TUSDC trading pair

### 5. Update Frontend Config

Copy deployed addresses to `frontend/src/config/contracts.ts`:

```typescript
export const CONTRACTS = {
  TBTC: {
    address: "0x..." // From deployments/default/TBTC.json
  },
  // ... update all addresses
};
```

### 6. Run Frontend

```bash
cd frontend
pnpm dev
```

Visit **http://localhost:3000** 🎉

## 🎨 Features

### ✅ Implemented

- **Wallet Connection** - Xverse wallet integration
- **Swap Interface** - Token swaps with price display
- **Liquidity Interface** - Add liquidity to pools
- **Pool Stats** - TVL, volume, reserves
- **Transaction Flow** - 4-step MIDL process visualization
- **MIDL Branding** - Orange & white theme
- **Responsive Design** - Mobile-friendly

### 🔜 Coming Soon (To Do for You!)

- **Real Contract Integration** - Connect hooks to actual swaps
- **Token Balances** - Read user balances from contracts
- **Price Oracles** - Real-time price calculations
- **Remove Liquidity** - Withdraw LP tokens
- **Multi-hop Routing** - Swap through multiple pairs
- **Transaction History** - View past transactions

## 🛠️ Development

### Compile Contracts

```bash
cd contracts
pnpm compile
```

### Deploy to Different Networks

Edit `hardhat.config.ts` to add networks:

```typescript
networks: {
  mainnet: {
    url: "https://rpc.midl.xyz",
    chainId: 888, // Check latest docs
  }
}
```

Then deploy:

```bash
pnpm hardhat deploy --network mainnet
```

### Verify Contracts

```bash
pnpm verify <CONTRACT_ADDRESS> "constructor args" --network default
```

## 📚 MIDL Transaction Flow

Every write operation (swap, add liquidity) follows this flow:

```
1. Add Transaction Intention
   ↓ (Create EVM tx data)

2. Finalize BTC Transaction
   ↓ (Calculate fees, form Bitcoin tx)

3. Sign Intentions
   ↓ (Sign with Bitcoin wallet)

4. Broadcast
   ↓ (Publish to MIDL + Bitcoin)

✅ Confirmed on Bitcoin L1
```

See `TransactionModal.tsx` for implementation.

## 🎯 Key Technologies

- **Smart Contracts**: Solidity, Uniswap V2, OpenZeppelin
- **Deployment**: Hardhat, @midl/hardhat-deploy
- **Frontend**: React, TypeScript, Vite
- **MIDL SDK**: @midl/executor, @midl/executor-react, @midl/core
- **Styling**: Custom CSS with CSS variables
- **State Management**: React Query, Wagmi

## 🔗 Useful Links

- **MIDL Docs**: https://js.midl.xyz/docs
- **MIDL Faucet**: https://faucet.midl.xyz
- **Block Explorer**: https://blockscout.regtest.midl.xyz
- **Uniswap V2 Docs**: https://docs.uniswap.org/contracts/v2/overview

## 🐛 Troubleshooting

### "Module not found: @midl/viem"

Make sure you have the viem override in `package.json`:

```json
{
  "pnpm": {
    "overrides": {
      "viem": "npm:@midl/viem"
    }
  }
}
```

### "Insufficient funds"

Get testnet BTC from the faucet:
```bash
pnpm address  # Get your address
# Visit https://faucet.midl.xyz
```

### "Transaction failed"

Check:
1. You have enough BTC for fees
2. Your mnemonic is set correctly
3. Contracts are deployed on the right network

## 🤝 Contributing

This is a starter kit! Extend it, improve it, make it yours:

1. Fork the repo
2. Add your features
3. Deploy to MIDL mainnet
4. Share with the community!

## 📜 License

- **Uniswap V2**: GPL-3.0
- **This Project**: MIT (for starter kit code)
- **MIDL**: Check [MIDL Labs](https://midl.xyz) for terms

## 🙏 Acknowledgments

- **MIDL Labs** - For bringing EVM to Bitcoin
- **Uniswap** - For the AMM design
- **OpenZeppelin** - For secure token standards

---

Built with 🧡 on Bitcoin via MIDL Protocol
