#  MIDL DEX Starter Kit

**Build a real DEX on Bitcoin in 20 minutes!**

This is a complete starter kit for building decentralized exchanges on MIDL - Bitcoin Layer 1 with EVM compatibility. You'll deploy Uniswap V2 contracts, create trading pairs, and execute real swaps on Bitcoin!

## ⚡ Quick Start

**New here? Start with the hands-on tutorial:**

### 👉 **[GETTING_STARTED.md](./GETTING_STARTED.md)** 👈

This guide walks you through everything step-by-step. No prior Bitcoin or DeFi experience needed!

**What you'll build:**
- ✅ Your own DEX on Bitcoin (like Uniswap)
- ✅ Custom tokens (TBTC & WBTC)
- ✅ Live liquidity pools
- ✅ Real swaps on Bitcoin L1

**Time needed:** 15-20 minutes

---

##  What is This?

This starter kit includes:

- ✅ **Uniswap V2 Contracts** - Battle-tested AMM
- ✅ **Deployment Scripts** - One-command deployment
- ✅ **Testing Scripts** - Automated DEX testing
- ✅ **Frontend UI** - React interface (optional)
- ✅ **Complete Docs** - Step-by-step guides

##  Super Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- Test Bitcoin wallet (Xverse recommended)

### Installation

```bash
# Clone repository
git clone https://github.com/Svector-anu/midint.git
cd midint

# Install dependencies
cd contracts && pnpm install
cd ../frontend && pnpm install
```

### Deploy & Test

```bash
cd contracts

# Deploy all contracts
npx hardhat deploy --network default

# Mint test tokens
npx hardhat deploy --tags Faucet --network default

# Test complete DEX flow
npx hardhat deploy --tags TestDex --network default
```

##  Documentation

### Main Tutorials

1. **[SCRIPT_TUTORIAL.md](./SCRIPT_TUTORIAL.md)** ⭐ **RECOMMENDED**
   - Complete script-based guide
   - Production-ready approach
   - All operations via Hardhat scripts

2. **[TUTORIAL.md](./TUTORIAL.md)**
   - Original full-stack tutorial
   - Frontend + Backend integration
   - Comprehensive overview

### Technical Documentation

- **[TESTING.md](./TESTING.md)** - Testing workflows and verification
- **[FRONTEND_FIX.md](./FRONTEND_FIX.md)** - Frontend implementation details
- **[SCREENSHOTS.md](./SCREENSHOTS.md)** - Tutorial screenshots guide

##  Architecture

### Smart Contracts

```
contracts/
├── TestToken.sol       # ERC20 with minting (TBTC)
├── WBTC.sol           # Wrapped Bitcoin
├── UniswapV2Factory.sol
├── UniswapV2Router02.sol
└── UniswapV2Pair.sol
```

### Deployment Scripts

```
deploy/
├── 00_deploy_tokens.ts    # Deploy TBTC & WBTC
├── 02_deploy_factory.ts   # Deploy Uniswap Factory
├── 03_deploy_router.ts    # Deploy Uniswap Router
├── 04_create_pair.ts      # Create TBTC/WBTC pair
├── 05_add_liquidity.ts    # Add initial liquidity
├── 08_faucet.ts          # Mint test tokens
└── 09_test_dex.ts        # Complete DEX test
```

### Frontend (Optional)

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── config/        # MIDL & contract config
│   └── styles/        # CSS styling
└── package.json
```

## 🔧 Usage

### Mint Test Tokens

```bash
npx hardhat deploy --tags Faucet --network default
```

Output:
```
🚰 MIDL Token Faucet
Minting tokens to: 0xF8483dddbCB103519F8BfE1713aBDa4f3A9C20b0
 Minting 1,000 TBTC...
   ✅ 1,000 TBTC minted!
```

### Complete DEX Flow

```bash
npx hardhat deploy --tags TestDex --network default
```

Output:
```
🧪 Testing Complete DEX Flow
✅ Step 1: Approving Router for TBTC...
✅ Step 2: Approving Router for WBTC...
💧 Step 3: Adding Liquidity (100 TBTC + 1 WBTC)...
🔄 Step 4: Swapping 10 TBTC for WBTC...
✅ DEX Test Complete!
```

### Verify on Blockscout

https://blockscout.regtest.midl.xyz/address/YOUR_ADDRESS

##  Contract Addresses (MIDL Regtest)

| Contract | Address |
|----------|---------|
| TBTC | `0xA4D2CbAF027125a967E48e94b1Baa03363981b1c` |
| WBTC | `0xca0daeff9cB8DED3EEF075Df62aDBb1522479639` |
| Factory | `0xde6c29923d7BB9FDbcDfEC54E7e726894B982593` |
| Router | `0x29cf3A9B709f94Eb46fBbA67753B90E721ddC9Ed` |

##  Learning Path

1. **Start Here**: Read [SCRIPT_TUTORIAL.md](./SCRIPT_TUTORIAL.md)
2. **Deploy Contracts**: Follow the Quick Start guide
3. **Run Tests**: Execute the Faucet and TestDex scripts
4. **Verify**: Check transactions on Blockscout
5. **Customize**: Modify scripts for your use case

##  Development

### Run Frontend (Optional)

```bash
cd frontend
pnpm dev
# Open http://localhost:3000
```

**Note**: Frontend is for visualization only. Use Hardhat scripts for transactions.

### Custom Scripts

Create new scripts in `contracts/scripts/`:

```typescript
import { ethers } from "hardhat";

async function main() {
    const hre = require("hardhat");
    await hre.midl.initialize();
    
    // Your custom logic here
    
    await hre.midl.execute();
}

main().catch(console.error);
```

##  Security

- ✅ Use **TEST WALLETS ONLY** for development
- ✅ Never commit private keys or mnemonics
- ✅ Audit contracts before mainnet deployment
- ✅ Test thoroughly on testnet first

## 🌐 Networks

### MIDL Regtest (Development)
- RPC: `https://rpc.regtest.midl.xyz`
- Explorer: `https://blockscout.regtest.midl.xyz`

### MIDL Testnet (Testing)
- RPC: `https://rpc.testnet.midl.xyz`
- Explorer: `https://blockscout.testnet.midl.xyz`

### MIDL Mainnet (Production)
- RPC: `https://rpc.mainnet.midl.xyz`
- Explorer: `https://blockscout.mainnet.midl.xyz`

##  Environment Variables

Create `contracts/.env`:

```bash
MNEMONIC="your twelve word test wallet mnemonic here"
RPC_URL="https://rpc.regtest.midl.xyz"
```

##  Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file

## 🔗 Resources

- **MIDL Documentation**: https://js.midl.xyz
- **Hardhat Documentation**: https://hardhat.org
- **Uniswap V2 Docs**: https://docs.uniswap.org/contracts/v2
- **GitHub Repository**: https://github.com/Svector-anu/midint

## 💡 Key Insights

### Why Script-Based?

1. **Reliability**: Direct integration with MIDL's intention system
2. **Simplicity**: No wallet connection complexity
3. **Production Pattern**: Same approach used in production dApps
4. **Full Control**: Complete visibility into execution

### MIDL Transaction Flow

```
Hardhat Script
    ↓
hre.midl.execute({...})  // Queue intention
    ↓
hre.midl.execute()       // Execute all intentions
    ↓
MIDL RPC (wraps in BTC tx)
    ↓
Bitcoin L1 Execution
```

##  Next Steps

1. ✅ **Customize Scripts** - Modify for your use case
2. ✅ **Add Features** - Multi-hop swaps, price oracles
3. ✅ **Deploy to Testnet** - Test with real BTC
4. ✅ **Build Frontend** - Create read-only UI
5. ✅ **Audit & Launch** - Security review and mainnet

##  Support

- **Issues**: https://github.com/Svector-anu/midint/issues
- **Discussions**: https://github.com/Svector-anu/midint/discussions
- **MIDL Telegram**: https://t.me/midl_xyz

---

**Built by Anu ** | **Powered by MIDL**
