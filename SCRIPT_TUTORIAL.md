# MIDL DEX - Script-Based Tutorial

## Overview
This tutorial demonstrates building and testing a DEX on MIDL using Hardhat scripts. All operations are executed via backend scripts, which is the recommended approach for MIDL development.

## Why Scripts?
- ✅ **100% Reliable** - Direct integration with MIDL's intention system
- ✅ **Full Control** - Complete visibility into transaction execution
- ✅ **Production Ready** - Same approach used in production dApps
- ✅ **Easy Testing** - Repeatable and automated workflows

---

## Quick Start

### 1. Setup Environment

```bash
cd contracts
cp .env.example .env
# Edit .env with your test wallet mnemonic
```

### 2. Deploy All Contracts

```bash
npx hardhat deploy --network default
```

This deploys:
- ✅ TBTC (Test Bitcoin Token)
- ✅ WBTC (Wrapped Bitcoin)
- ✅ Uniswap V2 Factory
- ✅ Uniswap V2 Router
- ✅ TBTC/WBTC Trading Pair
- ✅ Initial Liquidity

### 3. Mint Test Tokens

```bash
npx hardhat deploy --tags Faucet --network default
```

**Output:**
```
🚰 MIDL Token Faucet

Minting tokens to: 0xF8483dddbCB103519F8BfE1713aBDa4f3A9C20b0

🪙 Minting 1,000 TBTC...
   ✅ 1,000 TBTC minted!

✅ Faucet complete!
```

### 4. Test Complete DEX Flow

```bash
npx hardhat deploy --tags TestDex --network default
```

**Output:**
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

---

## Available Scripts

### Deployment Scripts

| Script | Tag | Description |
|--------|-----|-------------|
| `00_deploy_tokens.ts` | `Tokens` | Deploy TBTC and WBTC |
| `01_deploy_wbtc.ts` | `WBTC` | Deploy WBTC separately |
| `02_deploy_factory.ts` | `Factory` | Deploy Uniswap V2 Factory |
| `03_deploy_router.ts` | `Router` | Deploy Uniswap V2 Router |
| `04_create_pair.ts` | `CreatePair` | Create TBTC/WBTC pair |
| `05_add_liquidity.ts` | `AddLiquidity` | Add initial liquidity |
| `08_faucet.ts` | `Faucet` | Mint test tokens |
| `09_test_dex.ts` | `TestDex` | Complete DEX test |

### Running Specific Scripts

```bash
# Deploy only tokens
npx hardhat deploy --tags Tokens --network default

# Deploy Factory and Router
npx hardhat deploy --tags Factory,Router --network default

# Reset and redeploy everything
npx hardhat deploy --reset --network default
```

---

## Script Breakdown

### 1. Token Faucet (`08_faucet.ts`)

**Purpose**: Mint test tokens to your wallet

**Code:**
```typescript
await hre.midl.initialize();

const userAddress = "0xF8483dddbCB103519F8BfE1713aBDa4f3A9C20b0";
const TBTC = "0xA4D2CbAF027125a967E48e94b1Baa03363981b1c";

// Mint 1,000 TBTC
await hre.midl.execute({
    name: "MintTBTC",
    address: TBTC,
    functionName: "mint",
    args: [userAddress, "100000000000"], // 1,000 TBTC (8 decimals)
});

await hre.midl.execute(); // Execute all intentions
```

**Key Concepts:**
- `hre.midl.initialize()` - Initialize MIDL runtime
- `hre.midl.execute({...})` - Queue transaction intention
- `hre.midl.execute()` - Execute all queued intentions

### 2. Complete DEX Test (`09_test_dex.ts`)

**Purpose**: Test full DEX workflow

**Steps:**

#### Step 1: Approve Router for TBTC
```typescript
await hre.midl.execute({
    name: "ApproveTBTC",
    address: TBTC,
    functionName: "approve",
    args: [ROUTER, "50000000000"], // 500 TBTC
});
await hre.midl.execute();
```

#### Step 2: Approve Router for WBTC
```typescript
await hre.midl.execute({
    name: "ApproveWBTC",
    address: WBTC,
    functionName: "approve",
    args: [ROUTER, "5000000000000000000"], // 5 WBTC
});
await hre.midl.execute();
```

#### Step 3: Add Liquidity
```typescript
const deadline = Math.floor(Date.now() / 1000) + 3600;

await hre.midl.execute({
    name: "AddLiquidity",
    address: ROUTER,
    functionName: "addLiquidity",
    args: [
        TBTC,                    // tokenA
        WBTC,                    // tokenB
        "10000000000",           // 100 TBTC
        "1000000000000000000",   // 1 WBTC
        "0",                     // amountAMin
        "0",                     // amountBMin
        userAddress,             // to
        deadline.toString(),     // deadline
    ],
});
await hre.midl.execute();
```

#### Step 4: Swap Tokens
```typescript
await hre.midl.execute({
    name: "SwapTBTCforWBTC",
    address: ROUTER,
    functionName: "swapExactTokensForTokens",
    args: [
        "1000000000",            // 10 TBTC
        "0",                     // amountOutMin
        [TBTC, WBTC],           // path
        userAddress,             // to
        deadline.toString(),     // deadline
    ],
});
await hre.midl.execute();
```

---

## Verification

### Check Balances

```bash
npx hardhat console --network default
```

```javascript
const TBTC = await ethers.getContractAt("TestToken", "0xA4D2CbAF027125a967E48e94b1Baa03363981b1c");
const balance = await TBTC.balanceOf("0xF8483dddbCB103519F8BfE1713aBDa4f3A9C20b0");
console.log("TBTC Balance:", ethers.formatUnits(balance, 8));
```

### Check Pool Reserves

```javascript
const pair = await ethers.getContractAt(
    "IUniswapV2Pair",
    "PAIR_ADDRESS_HERE"
);
const reserves = await pair.getReserves();
console.log("Reserve0:", reserves[0].toString());
console.log("Reserve1:", reserves[1].toString());
```

### View on Blockscout

Visit: https://blockscout.regtest.midl.xyz/address/0xF8483dddbCB103519F8BfE1713aBDa4f3A9C20b0

You'll see:
- ✅ Token balances (TBTC, WBTC, LP tokens)
- ✅ Transaction history
- ✅ Contract interactions
- ✅ Gas fees

---

## Advanced Usage

### Custom Swap Amounts

Create a new script `scripts/custom-swap.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
    const hre = require("hardhat");
    await hre.midl.initialize();

    const ROUTER = "0x29cf3A9B709f94Eb46fBbA67753B90E721ddC9Ed";
    const TBTC = "0xA4D2CbAF027125a967E48e94b1Baa03363981b1c";
    const WBTC = "0xca0daeff9cB8DED3EEF075Df62aDBb1522479639";
    const userAddress = "0xF8483dddbCB103519F8BfE1713aBDa4f3A9C20b0";

    const amountIn = ethers.parseUnits("50", 8); // 50 TBTC
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    await hre.midl.execute({
        name: "CustomSwap",
        address: ROUTER,
        functionName: "swapExactTokensForTokens",
        args: [
            amountIn.toString(),
            "0",
            [TBTC, WBTC],
            userAddress,
            deadline.toString(),
        ],
    });

    await hre.midl.execute();
    console.log("✅ Swapped 50 TBTC for WBTC!");
}

main().catch(console.error);
```

Run it:
```bash
npx hardhat run scripts/custom-swap.ts --network default
```

### Remove Liquidity

```typescript
const lpToken = await ethers.getContractAt("IUniswapV2Pair", PAIR_ADDRESS);
const lpBalance = await lpToken.balanceOf(userAddress);

// Approve router to spend LP tokens
await hre.midl.execute({
    name: "ApproveLPTokens",
    address: PAIR_ADDRESS,
    functionName: "approve",
    args: [ROUTER, lpBalance.toString()],
});
await hre.midl.execute();

// Remove liquidity
await hre.midl.execute({
    name: "RemoveLiquidity",
    address: ROUTER,
    functionName: "removeLiquidity",
    args: [
        TBTC,
        WBTC,
        lpBalance.toString(),
        "0",
        "0",
        userAddress,
        deadline.toString(),
    ],
});
await hre.midl.execute();
```

---

## Troubleshooting

### Issue: "No intentions to execute"

**Cause**: Intentions were already executed or cleared

**Solution**: This is normal - it means the transaction already went through

### Issue: "Insufficient allowance"

**Cause**: Router not approved to spend tokens

**Solution**: Run the approval step again:
```bash
npx hardhat deploy --tags TestDex --network default --reset
```

### Issue: "INSUFFICIENT_LIQUIDITY"

**Cause**: Pool doesn't have enough liquidity

**Solution**: Add more liquidity:
```bash
npx hardhat deploy --tags AddLiquidity --network default
```

---

## Production Deployment

### 1. Update Network Configuration

Edit `hardhat.config.ts`:

```typescript
networks: {
    midlTestnet: {
        url: "https://rpc.testnet.midl.xyz",
        accounts: {
            mnemonic: vars.get("MNEMONIC"),
        },
    },
    midlMainnet: {
        url: "https://rpc.mainnet.midl.xyz",
        accounts: {
            mnemonic: vars.get("MNEMONIC"),
        },
    },
}
```

### 2. Deploy to Testnet

```bash
npx hardhat deploy --network midlTestnet
```

### 3. Verify Contracts

```bash
npx hardhat verify --network midlTestnet DEPLOYED_ADDRESS
```

---

## Contract Addresses (MIDL Regtest)

| Contract | Address |
|----------|---------|
| TBTC | `0xA4D2CbAF027125a967E48e94b1Baa03363981b1c` |
| WBTC | `0xca0daeff9cB8DED3EEF075Df62aDBb1522479639` |
| Factory | `0xde6c29923d7BB9FDbcDfEC54E7e726894B982593` |
| Router | `0x29cf3A9B709f94Eb46fBbA67753B90E721ddC9Ed` |

---

## Next Steps

1. ✅ **Customize Scripts** - Modify amounts, add new operations
2. ✅ **Build Frontend** - Create UI to display data (read-only)
3. ✅ **Add Features** - Multi-hop swaps, price oracles, etc.
4. ✅ **Deploy to Testnet** - Test with real BTC
5. ✅ **Audit & Launch** - Security audit and mainnet deployment

---

## Resources

- **MIDL Docs**: https://js.midl.xyz
- **Hardhat Docs**: https://hardhat.org
- **Uniswap V2 Docs**: https://docs.uniswap.org/contracts/v2
- **Blockscout Explorer**: https://blockscout.regtest.midl.xyz

---

**Tutorial Version**: 2.0 (Script-Based)  
**Last Updated**: January 2026  
**Recommended Approach**: ✅ Production Ready
