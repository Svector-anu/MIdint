#  Quick Start - Bitcoin DEX on MIDL

Get your DEX running in 5 minutes!

## Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Xverse Wallet installed

## Steps

### 1. Install Dependencies

```bash
# Contracts
cd contracts
pnpm install

# Frontend  
cd ../frontend
pnpm insta

### 2. Configure Wallet

```bash
cd contracts
npx hardhat vars set MNEMONIC
# Enter your 12/24-word test wallet seed
```

### 3. Get Funds

```bash
pnpm run address
# Copy your Bitcoin address
# Visit: https://faucet.regtest.midl.xyz/
# Paste address and request funds
```

### 4. Deploy Contracts

```bash
pnpm run deploy
```

### 5. Update Frontend

Edit `frontend/src/config/contracts.ts`:
- Copy addresses from `contracts/deployments/default/*.json`
- Update `CONTRACTS` object

### 6. Run App

```bash
cd ../frontend
pnpm dev
```

Open **http://localhost:3000** 🎉

## Test It!

1. **Connect Wallet** - Click connect button
2. **Mint Tokens** - Use Hardhat console (see DEPLOYMENT.md)
3. **Swap** - Try TBTC → TUSDC
4. **Add Liquidity** - Become an LP

## Need Help?

- Full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Documentation: [README.md](./README.md)
- MIDL Docs: https://js.midl.xyz/docs

---

