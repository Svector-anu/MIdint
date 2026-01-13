# Building a Bitcoin DEX on MIDL - Complete Tutorial

## Overview
This tutorial guides you through building a decentralized exchange (DEX) on MIDL, a Bitcoin Layer 1 with EVM compatibility. You'll learn how to deploy Uniswap V2 contracts, integrate Bitcoin wallets, and create a modern trading interface.

## What You'll Build
- ✅ Uniswap V2 DEX deployed on MIDL Regtest
- ✅ Bitcoin wallet integration using SatoshiKit
- ✅ Token swapping interface
- ✅ Liquidity pool management
- ✅ Real-time pool data display

## Prerequisites
- Node.js 18+ and pnpm installed
- Xverse wallet (for testing)
- Basic knowledge of React and Solidity
- Git configured with your credentials

## Project Structure
```
Midl/
├── contracts/          # Hardhat project for smart contracts
│   ├── contracts/      # Solidity contracts (Uniswap V2)
│   ├── deploy/         # Deployment scripts
│   └── scripts/        # Testing and utility scripts
└── frontend/           # React + Vite frontend
    ├── src/
    │   ├── components/ # UI components
    │   ├── config/     # MIDL and contract configuration
    │   └── styles/     # CSS styling
    └── package.json
```

---

## Part 1: Environment Setup

### Step 1: Install Dependencies

**Contracts:**
```bash
cd contracts
pnpm install
```

**Frontend:**
```bash
cd frontend
pnpm install
```

### Step 2: Configure Environment Variables

Create `contracts/.env`:
```bash
MNEMONIC="your twelve word mnemonic phrase here"
RPC_URL="https://rpc.regtest.midl.xyz"
```

⚠️ **Important**: Use a TEST wallet only! Never use your main wallet mnemonic.

### Step 3: Configure Xverse Wallet

1. Install [Xverse Wallet](https://xverse.app)
2. Create a new wallet or import test wallet
3. Switch network to **MIDL Regtest**
4. Get test BTC from faucet (if available)

---

## Part 2: Smart Contract Deployment

### Understanding MIDL's Transaction System

MIDL uses an **intention-based execution model**:
- Transactions are queued as "intentions"
- `hre.midl.execute()` batches and executes them
- Each transaction is wrapped in a Bitcoin transaction

### Step 1: Deploy Tokens

```bash
cd contracts
npx hardhat deploy --tags Tokens --network default
```

**What happens:**
- Deploys TBTC (Test Bitcoin) with 8 decimals
- Deploys WBTC (Wrapped Bitcoin) with 18 decimals
- Mints initial supply to deployer

**Expected Output:**
```
📝 Deploying Test Tokens to MIDL...

✅ TBTC deployed at: 0xA4D2CbAF027125a967E48e94b1Baa03363981b1c
✅ WBTC deployed at: 0xca0daeff9cB8DED3EEF075Df62aDBb1522479639
```

### Step 2: Deploy Uniswap V2 Contracts

```bash
npx hardhat deploy --tags Factory,Router --network default
```

**Contracts deployed:**
1. **UniswapV2Factory**: Creates trading pairs
2. **UniswapV2Router02**: Handles swaps and liquidity

**Expected Output:**
```
📝 Deploying Uniswap V2 Factory...
✅ Factory: 0xde6c29923d7BB9FDbcDfEC54E7e726894B982593

📝 Deploying Uniswap V2 Router...
✅ Router: 0x29cf3A9B709f94Eb46fBbA67753B90E721ddC9Ed
```

### Step 3: Create Trading Pair

```bash
npx hardhat deploy --tags CreatePair --network default
```

This creates the TBTC/WBTC liquidity pool.

### Step 4: Add Initial Liquidity

```bash
npx hardhat deploy --tags AddLiquidity --network default
```

Adds initial liquidity to bootstrap the pool.

---

## Part 3: Frontend Integration

### Step 1: Understanding SatoshiKit

SatoshiKit is MIDL's official wallet connection library. It provides:
- ✅ Automatic wallet detection (Xverse, Unisat, MetaMask Snap)
- ✅ Bitcoin address management
- ✅ Message signing (BIP322)
- ✅ Transaction broadcasting

### Step 2: Configure MIDL

**File: `frontend/src/config/midl.ts`**
```typescript
import { createMidlConfig } from "@midl/satoshi-kit";
import { regtest } from "@midl/core";
import { xverseConnector } from "@midl/connectors";
import type { Config } from "@midl/core";

export const midlConfig = createMidlConfig({
    networks: [regtest],
    persist: true,
    connectors: [
        xverseConnector({
            metadata: {
                group: "popular",
            },
        }),
    ],
}) as Config;
```

**Key Points:**
- `createMidlConfig` automatically sets up wallet connectors
- `persist: true` saves wallet connection state
- `xverseConnector` enables Xverse wallet support

### Step 3: Setup Providers

**File: `frontend/src/main.tsx`**
```typescript
import { MidlProvider } from "@midl/react";
import { SatoshiKitProvider } from "@midl/satoshi-kit";
import { WagmiMidlProvider } from "@midl/executor-react";
import { midlRegtest } from "@midl/executor";
import { AddressPurpose } from "@midl/core";
import "@midl/satoshi-kit/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <MidlProvider config={midlConfig}>
        <QueryClientProvider client={queryClient}>
            <SatoshiKitProvider 
                config={midlConfig}
                purposes={[AddressPurpose.Payment, AddressPurpose.Ordinals]}
            >
                <WagmiMidlProvider chain={midlRegtest}>
                    <App />
                </WagmiMidlProvider>
            </SatoshiKitProvider>
        </QueryClientProvider>
    </MidlProvider>
);
```

**Provider Hierarchy:**
1. **MidlProvider**: Core MIDL configuration
2. **SatoshiKitProvider**: Wallet connection UI
3. **WagmiMidlProvider**: EVM transaction signing
4. **QueryClientProvider**: React Query for data fetching

### Step 4: Add Wallet Connection

**File: `frontend/src/components/Header.tsx`**
```typescript
import { ConnectButton } from "@midl/satoshi-kit";

export default function Header() {
    return (
        <header>
            <div className="logo">MIDINT</div>
            <ConnectButton />
        </header>
    );
}
```

The `ConnectButton` handles:
- Wallet selection dialog
- Connection state
- Account display
- Disconnect functionality

---

## Part 4: Testing the DEX

### Method 1: Hardhat Scripts (Recommended for Testing)

#### Mint Test Tokens
```bash
cd contracts
npx hardhat deploy --tags Faucet --network default
```

**What it does:**
- Mints 1,000 TBTC to your address
- Uses MIDL's backend execution
- Guaranteed to work

**Expected Output:**
```
🚰 MIDL Token Faucet

Minting tokens to: 0xF8483dddbCB103519F8BfE1713aBDa4f3A9C20b0

🪙 Minting 1,000 TBTC...
   ✅ 1,000 TBTC minted!

✅ Faucet complete!
```

#### Complete DEX Flow
```bash
npx hardhat deploy --tags TestDex --network default
```

**What it does:**
1. Approves Router to spend TBTC
2. Approves Router to spend WBTC
3. Adds liquidity (100 TBTC + 1 WBTC)
4. Executes swap (10 TBTC → WBTC)

**Expected Output:**
```
🧪 Testing Complete DEX Flow

✅ Step 1: Approving Router for TBTC...
   ✅ TBTC approved!

✅ Step 2: Approving Router for WBTC...
   ✅ WBTC approved!

💧 Step 3: Adding Liquidity (100 TBTC + 1 WBTC)...
   ✅ Liquidity added!

🔄 Step 4: Swapping 10 TBTC for WBTC...
   ✅ Swap completed!

✅ DEX Test Complete!
```

### Method 2: Frontend Interface

#### Start Dev Server
```bash
cd frontend
pnpm dev
```

Open: http://localhost:3000

#### Connect Wallet
1. Click "Connect Wallet" button
2. Select Xverse from wallet list
3. Approve connection in Xverse popup
4. Wallet address appears in header

#### View Pool Data
1. Click "Pool" tab
2. See TBTC/WBTC pool reserves
3. View your liquidity position
4. Check TVL and APY

**Note**: Frontend transaction signing is currently under development. Use Hardhat scripts for minting, swapping, and adding liquidity.

---

## Part 5: Verification

### Check Transactions on Blockscout

Visit: https://blockscout.regtest.midl.xyz/address/YOUR_ADDRESS

**What to verify:**
- ✅ Token balances (TBTC, WBTC, LP tokens)
- ✅ Transaction history
- ✅ Contract interactions
- ✅ Gas fees paid

### Check Contract State

```bash
# Check TBTC balance
npx hardhat console --network default
> const TBTC = await ethers.getContractAt("TestToken", "0xA4D2C...")
> await TBTC.balanceOf("YOUR_ADDRESS")

# Check pool reserves
> const pair = await ethers.getContractAt("IUniswapV2Pair", "PAIR_ADDRESS")
> await pair.getReserves()
```

---

## Part 6: Understanding the Architecture

### MIDL Transaction Flow

```
User Action (Frontend)
    ↓
useWriteContract (wagmi)
    ↓
WagmiMidlProvider (intercepts)
    ↓
signTransaction (@midl/executor)
    ↓
Bitcoin Wallet Signs (Xverse)
    ↓
MIDL RPC (wraps in BTC tx)
    ↓
EVM Execution on Bitcoin L1
```

### Contract Addresses (MIDL Regtest)

| Contract | Address |
|----------|---------|
| TBTC | `0xA4D2CbAF027125a967E48e94b1Baa03363981b1c` |
| WBTC | `0xca0daeff9cB8DED3EEF075Df62aDBb1522479639` |
| Factory | `0xde6c29923d7BB9FDbcDfEC54E7e726894B982593` |
| Router | `0x29cf3A9B709f94Eb46fBbA67753B90E721ddC9Ed` |

### Key Files Reference

**Smart Contracts:**
- `contracts/contracts/TestToken.sol` - ERC20 token with minting
- `contracts/contracts/WBTC.sol` - Wrapped Bitcoin (deposit/withdraw)
- `contracts/deploy/00_deploy_tokens.ts` - Token deployment
- `contracts/deploy/08_faucet.ts` - Token minting script
- `contracts/deploy/09_test_dex.ts` - Complete DEX test flow

**Frontend:**
- `frontend/src/config/midl.ts` - MIDL configuration
- `frontend/src/config/contracts.ts` - Contract ABIs and addresses
- `frontend/src/components/Header.tsx` - Wallet connection
- `frontend/src/components/SwapInterface.tsx` - Swap UI
- `frontend/src/components/LiquidityInterface.tsx` - Liquidity UI
- `frontend/src/components/PoolsPage.tsx` - Pool data display

---

## Part 7: Common Issues & Solutions

### Issue 1: "Network mismatch"
**Solution**: Switch Xverse to MIDL Regtest network

### Issue 2: "Insufficient funds"
**Solution**: Run faucet script to mint test tokens
```bash
npx hardhat deploy --tags Faucet --network default
```

### Issue 3: Frontend transactions not working
**Solution**: Use Hardhat scripts for now. Frontend EVM transaction signing is being developed.

### Issue 4: Git push authentication failed
**Solution**: 
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push origin main
# Enter GitHub username and Personal Access Token when prompted
```

---

## Part 8: Next Steps

### For Production Deployment

1. **Deploy to MIDL Testnet/Mainnet**
   - Update network in `hardhat.config.ts`
   - Get real BTC for gas fees
   - Verify contracts on Blockscout

2. **Add More Features**
   - Price charts (integrate TradingView)
   - Transaction history
   - Slippage tolerance settings
   - Multi-hop swaps

3. **Security Audit**
   - Test all edge cases
   - Audit smart contracts
   - Implement rate limiting
   - Add emergency pause functionality

4. **Deploy Frontend**
   - Build production bundle: `pnpm build`
   - Deploy to Vercel/Netlify
   - Configure custom domain
   - Set up analytics

### Learning Resources

- **MIDL Docs**: https://js.midl.xyz
- **Uniswap V2 Docs**: https://docs.uniswap.org/contracts/v2
- **SatoshiKit Docs**: https://js.midl.xyz/satoshi-kit
- **Hardhat Docs**: https://hardhat.org/docs

---

## Conclusion

You've successfully built a Bitcoin DEX on MIDL! You learned:
- ✅ How to deploy EVM contracts on Bitcoin L1
- ✅ MIDL's intention-based transaction system
- ✅ Bitcoin wallet integration with SatoshiKit
- ✅ Building a modern DEX interface
- ✅ Testing and verification workflows

**Key Takeaways:**
1. MIDL enables EVM smart contracts on Bitcoin
2. SatoshiKit simplifies Bitcoin wallet integration
3. Hardhat scripts provide reliable testing
4. Frontend integration is evolving

**Next Tutorial**: Building a Bitcoin NFT Marketplace on MIDL

---

## Appendix: Quick Reference

### Useful Commands

```bash
# Deploy all contracts
npx hardhat deploy --network default

# Mint test tokens
npx hardhat deploy --tags Faucet --network default

# Test complete DEX flow
npx hardhat deploy --tags TestDex --network default

# Start frontend
cd frontend && pnpm dev

# Build frontend
cd frontend && pnpm build

# Git commit and push
git add -A
git commit -m "Your message"
git push origin main
```

### Environment Variables

```bash
# contracts/.env
MNEMONIC="your test wallet mnemonic"
RPC_URL="https://rpc.regtest.midl.xyz"
RECIPIENT_ADDRESS="0xYourAddress"  # Optional for faucet
```

### Network Configuration

```typescript
// MIDL Regtest
{
  id: "regtest",
  rpcUrl: "https://rpc.regtest.midl.xyz",
  blockExplorer: "https://blockscout.regtest.midl.xyz"
}
```

---

**Tutorial Version**: 1.0  
**Last Updated**: January 2026  
**Author**: MIDL Community  
**License**: MIT
