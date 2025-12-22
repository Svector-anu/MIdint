# 📖 Deployment Guide - Bitcoin DEX on MIDL

Complete step-by-step guide to deploy your DEX to MIDL Regtest (testnet).

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Get Testnet Funds](#get-testnet-funds)
3. [Deploy Smart Contracts](#deploy-smart-contracts)
4. [Verify Contracts](#verify-contracts)
5. [Configure Frontend](#configure-frontend)
6. [Run the Application](#run-the-application)
7. [Testing the DEX](#testing-the-dex)

---

## 1. Environment Setup

### Install Dependencies

```bash
# Navigate to contracts directory
cd contracts
pnpm install

# Navigate to frontend directory
cd ../frontend
pnpm install
```

### Set Up Your Mnemonic

Your Bitcoin mnemonic is required for deploying contracts:

```bash
cd contracts
npx hardhat vars set MNEMONIC
```

When prompted, enter your **12 or 24-word seed phrase**.

> ⚠️ **Security Warning**: 
> - Use a **test wallet only**
> - Never commit your mnemonic to git
> - Never use your main wallet's seed phrase

---

## 2. Get Testnet Funds

### Get Your Bitcoin Address

```bash
cd contracts
pnpm run address
```

Output example:
```
Bitcoin Address: bcrt1qf3r47tdpkn4rq6gq8kkfhw7l60q08lemmahgmf (p2wpkh)
EVM Address: 0x0130ddAA9bEc9552F11F17792b4EEED2b7d5E8Dd
```

### Request Testnet BTC

1. Visit [https://faucet.regtest.midl.xyz/](https://faucet.regtest.midl.xyz/)
2. Enter your **Bitcoin Address** (starts with `bcrt1`)
3. Request funds
4. Wait for confirmation (~1 minute)

### Verify You Received Funds

Check your balance on the block explorer:
```
https://blockscout.regtest.midl.xyz/address/YOUR_BTC_ADDRESS
```

---

## 3. Deploy Smart Contracts

### Deployment Order

The deployment scripts will automatically deploy in this order:

1. **Test Tokens** (TBTC, TUSDC)
2. **WBTC** (Wrapped Bitcoin)
3. **Uniswap V2 Factory**
4. **Uniswap V2 Router02**
5. **Create TBTC/TUSDC Pair**

### Run Deployment

```bash
cd contracts
pnpm run deploy
```

### Expected Output

```
📝 Deploying Test Tokens to MIDL...
✅ Test tokens deployed successfully!

📝 Deploying WBTC (Wrapped Bitcoin)...
✅ WBTC deployed successfully!

🏭 Deploying Uniswap V2 Factory...
Fee setter: 0x...
✅ Factory deployed at: 0x...

🛣️  Deploying Uniswap V2 Router...
Factory: 0x...
WBTC: 0x...
✅ Router deployed at: 0x...

💧 Creating TBTC/TUSDC Pair...
✅ TBTC/TUSDC Pair created at: 0x...
```

### Deployment Files

After deployment, you'll find contract data in:
```
contracts/deployments/default/
├── TBTC.json
├── TUSDC.json
├── WBTC.json
├── UniswapV2Factory.json
├── UniswapV2Router02.json
└── .chainId
```

Each JSON file contains:
- `address`: Deployed contract address
- `abi`: Contract ABI for frontend integration

---

## 4. Verify Contracts

Verify your contracts on the MIDL block explorer:

### Verify TBTC

```bash
pnpm run verify <TBTC_ADDRESS> "Test Bitcoin" "TBTC" 8 "100000000000000" --network default
```

### Verify TUSDC

```bash
pnpm run verify <TUSDC_ADDRESS> "Test USD Coin" "TUSDC" 6 "1000000000000" --network default
```

### Verify Factory

```bash
pnpm run verify <FACTORY_ADDRESS> "<YOUR_EVM_ADDRESS>" --network default
```

### Verify Router

```bash
pnpm run verify <ROUTER_ADDRESS> "<FACTORY_ADDRESS>" "<WBTC_ADDRESS>" --network default
```

> **Tip**: Get addresses from the deployment JSON files

---

## 5. Configure Frontend

### Update Contract Addresses

Edit `frontend/src/config/contracts.ts`:

```typescript
export const CONTRACTS = {
  TBTC: {
    address: "0x..." as `0x${string}`, // From deployments/default/TBTC.json
    decimals: 8,
    symbol: "TBTC",
    name: "Test Bitcoin",
  },
  TUSDC: {
    address: "0x..." as `0x${string}`, // From deployments/default/TUSDC.json
    decimals: 6,
    symbol: "TUSDC",
    name: "Test USD Coin",
  },
  WBTC: {
    address: "0x..." as `0x${string}`, // From deployments/default/WBTC.json
    decimals: 8,
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
  },
  Factory: {
    address: "0x..." as `0x${string}`, // From deployments/default/UniswapV2Factory.json
  },
  Router: {
    address: "0x..." as `0x${string}`, // From deployments/default/UniswapV2Router02.json
  },
};
```

### Helper Script (Optional)

Create a script to automatically update addresses:

```bash
cd contracts
node scripts/update-frontend-config.js
```

---

## 6. Run the Application

### Start Development Server

```bash
cd frontend
pnpm dev
```

The app will open at **http://localhost:3000**

### Expected Screens

1. **Wallet Connect** - Connect your Xverse wallet
2. **Pool Stats** - View liquidity and volume
3. **Swap** - Trade TBTC ↔ TUSDC
4. **Liquidity** - Add liquidity to earn fees

---

## 7. Testing the DEX

### Mint Test Tokens

Before swapping, you need tokens! The TestToken contract has a `mint` function:

```bash
cd contracts
npx hardhat console --network default
```

In the console:
```javascript
const TBTC = await ethers.getContractAt("TestToken", "<TBTC_ADDRESS>");
await TBTC.mint("<YOUR_EVM_ADDRESS>", ethers.parseUnits("10", 8));

const TUSDC = await ethers.getContractAt("TestToken", "<TUSDC_ADDRESS>");
await TUSDC.mint("<YOUR_EVM_ADDRESS>", ethers.parseUnits("10000", 6));
```

### Add Initial Liquidity

1. Go to **Liquidity** tab
2. Enter amounts (e.g., 1 TBTC, 30000 TUSDC)
3. Click "Add Liquidity"
4. Follow the 4-step MIDL flow:
   - Add intention
   - Finalize BTC tx
   - Sign in wallet
   - Broadcast

5. Wait for Bitcoin confirmation

### Test a Swap

1. Go to **Swap** tab
2. Enter amount (e.g., 0.1 TBTC)
3. See estimated output in TUSDC
4. Click "Swap"
5. Follow the MIDL flow
6. Wait for confirmation

### Verify on Block Explorer

After each transaction:
1. Copy the transaction hash
2. Visit: `https://blockscout.regtest.midl.xyz/tx/<TX_HASH>`
3. Verify the transaction details

---

## 🎉 Deployment Complete!

You now have a fully functional DEX on Bitcoin!

### Next Steps

1. **Improve the UI** - Add price charts, transaction history
2. **Add Features** - Remove liquidity, multi-hop routing
3. **Optimize Gas** - Batch operations where possible
4. **Deploy to Mainnet** - When MIDL mainnet launches
5. **Get Audited** - Before handling real funds

### Mainnet Deployment

When deploying to mainnet:

1. Update `hardhat.config.ts`:
```typescript
networks: {
  mainnet: {
    url: "https://rpc.midl.xyz", // Check latest docs
    chainId: 888, // Check latest docs
  }
}
```

2. Update frontend `config/midl.ts` to use mainnet network

3. Get REAL Bitcoin for gas fees

4. Deploy:
```bash
pnpm hardhat deploy --network mainnet
```

5. **AUDIT YOUR CONTRACTS** before putting real liquidity!

---

## 🐛 Common Issues

### Issue: "Insufficient funds for intrinsic transaction cost"

**Solution**: You need more testnet BTC. Visit the faucet again.

### Issue: "Nonce too high"

**Solution**: Reset your deployment:
```bash
rm -rf deployments/default
pnpm deploy
```

### Issue: "Contract verification failed"

**Solution**: Make sure constructor arguments match exactly what you used in deployment.

### Issue: "Transaction reverted"

**Solution**: 
- Check you approved tokens before adding liquidity
- Ensure pool has liquidity before swapping
- Verify slippage tolerance is sufficient

---

## 📞 Need Help?

- **MIDL Discord**: https://discord.com/invite/midl
- **Documentation**: https://js.midl.xyz/docs
- **Block Explorer**: https://blockscout.regtest.midl.xyz
- **GitHub Issues**: Create an issue in your repo

---

Happy Building on Bitcoin! 🚀
