# 🚀 Build Your First DEX on Bitcoin - MIDL Starter Kit

Welcome! You're about to build a **real decentralized exchange on Bitcoin**. Not a testnet, not a sidechain - actual Bitcoin Layer 1 with EVM smart contracts. Pretty cool, right?

I'm going to walk you through every step. By the end of this guide, you'll have:
- ✅ A working Uniswap V2 DEX deployed on Bitcoin
- ✅ Your own test tokens (TBTC and WBTC)
- ✅ Live liquidity pools you can trade on
- ✅ All verified on a real blockchain explorer

Let's get started! 🎯

---

## 📋 What You'll Need (5 minutes)

Before we dive in, make sure you have:

1. **Node.js 18 or higher** - [Download here](https://nodejs.org)
2. **pnpm** - Install with: `npm install -g pnpm`
3. **A code editor** - VS Code is great
4. **Xverse Wallet** - [Get it here](https://xverse.app) (we'll use this for testing)
5. **15-20 minutes** - That's all it takes!

> **Important**: We're using a TEST wallet only. Never use your real Bitcoin wallet for development!

---

## 🎬 Part 1: Get the Starter Kit (2 minutes)

First, let's get you set up with the code.

### Clone the Repository

Open your terminal and run:

```bash
# Clone the starter kit
git clone https://github.com/Svector-anu/midint.git
cd midint
```

You'll see two main folders:
- `contracts/` - Your smart contracts and deployment scripts
- `frontend/` - A React UI (optional, we'll focus on scripts)

### Install Dependencies

```bash
# Install contract dependencies
cd contracts
pnpm install

# This will take about 1-2 minutes
```

While that's installing, let me explain what MIDL is...

### 🤔 What is MIDL?

MIDL is Bitcoin Layer 1 with EVM compatibility. Think of it like this:
- You write **Solidity contracts** (just like Ethereum)
- They run on **Bitcoin's blockchain** (secured by Bitcoin miners)
- You use **Bitcoin wallets** (like Xverse)

It's the best of both worlds! 🌍

---

## 🔑 Part 2: Set Up Your Wallet (3 minutes)

Now let's configure your test wallet.

### Create Your Environment File

```bash
# Make sure you're in the contracts folder
cd contracts

# Copy the example environment file
cp .env.example .env
```

### Get Your Test Wallet Mnemonic

**Option 1: Create a New Test Wallet**

1. Open Xverse wallet
2. Create a new wallet (or use an existing TEST wallet)
3. Go to Settings → Show Recovery Phrase
4. Copy your 12-word phrase

**Option 2: Use a Generated Mnemonic**

```bash
# Generate a random test mnemonic
npx mnemonics
```

### Add Your Mnemonic to .env

Open `.env` in your editor and add:

```bash
MNEMONIC="your twelve word mnemonic phrase goes here"
RPC_URL="https://rpc.regtest.midl.xyz"
```

> **⚠️ Security Note**: This `.env` file is gitignored. Never commit it! And again - TEST WALLET ONLY!

### What's Your Address?

Let's find out your EVM address (derived from your Bitcoin wallet):

```bash
npx hardhat console --network default
```

Then type:
```javascript
const [deployer] = await ethers.getSigners();
console.log("Your EVM Address:", deployer.address);
// Press Ctrl+C to exit
```

**Save this address!** You'll see it throughout the tutorial. Mine is `0xF8483dddbCB103519F8BfE1713aBDa4f3A9C20b0` - yours will be different.

---

## 🏗️ Part 3: Deploy Your DEX (5 minutes)

This is where the magic happens. We're going to deploy a complete Uniswap V2 DEX to Bitcoin!

### Deploy Everything at Once

```bash
npx hardhat deploy --network default
```

**What's happening?** (This takes about 2-3 minutes)

You'll see output like this:

```
📝 Deploying Test Tokens to MIDL...
✅ TBTC deployed at: 0xA4D2CbAF027125a967E48e94b1Baa03363981b1c
✅ WBTC deployed at: 0xca0daeff9cB8DED3EEF075Df62aDBb1522479639

📝 Deploying Uniswap V2 Factory...
✅ Factory deployed at: 0xde6c29923d7BB9FDbcDfEC54E7e726894B982593

📝 Deploying Uniswap V2 Router...
✅ Router deployed at: 0x29cf3A9B709f94Eb46fBbA67753B90E721ddC9Ed

📝 Creating TBTC/WBTC pair...
✅ Pair created!

📝 Adding initial liquidity...
✅ Liquidity added!
```

**Congratulations!** 🎉 You just deployed a DEX on Bitcoin!

### What Did We Just Deploy?

1. **TBTC** - A test Bitcoin token (like USDT, but for testing)
2. **WBTC** - Wrapped Bitcoin (for trading)
3. **Uniswap V2 Factory** - Creates trading pairs
4. **Uniswap V2 Router** - Handles swaps and liquidity
5. **TBTC/WBTC Pair** - Your first trading pool!

---

## 💰 Part 4: Get Some Test Tokens (2 minutes)

You need tokens to trade! Let's mint some.

### Run the Faucet Script

```bash
npx hardhat deploy --tags Faucet --network default
```

You'll see:

![Faucet Output](./docs/screenshots/01_faucet_output.png)

```
🚰 MIDL Token Faucet

Minting tokens to: 0xYourAddressHere

🪙 Minting 1,000 TBTC...
   ✅ 1,000 TBTC minted!

✅ Faucet complete!

📝 Check balance:
   https://blockscout.regtest.midl.xyz/address/0xYourAddress
```

**Click that Blockscout link!** You'll see your tokens on the blockchain explorer. This is real - your tokens are on Bitcoin! 🪙

---

## 🔄 Part 5: Test Your DEX (5 minutes)

Now for the fun part - let's actually USE your DEX!

### Run the Complete DEX Test

```bash
npx hardhat deploy --tags TestDex --network default
```

Watch as your DEX comes to life:

![TestDex Output](./docs/screenshots/02_testdex_output.png)

```
🧪 Testing Complete DEX Flow

User: 0xYourAddress

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

**What just happened?**

1. You approved the Router to spend your tokens
2. You added liquidity to the pool (became a liquidity provider!)
3. You swapped 10 TBTC for WBTC
4. All on Bitcoin Layer 1! 🚀

---

## 🔍 Part 6: Verify Everything (3 minutes)

Let's prove this is real by checking the blockchain.

### View Your Transactions

Open Blockscout with your address:
```
https://blockscout.regtest.midl.xyz/address/YOUR_ADDRESS
```

You'll see something like this:

![Blockscout Transactions](./docs/screenshots/03_blockscout_transactions.png)

**Look at that!** You can see:
- ✅ Your token balances (TBTC, WBTC, LP tokens)
- ✅ All your transactions
- ✅ Gas fees you paid (in BTC!)
- ✅ Smart contract interactions

This is a real blockchain explorer, showing your real transactions on Bitcoin!

### Check Your Balances

Let's verify your balances programmatically:

```bash
npx hardhat console --network default
```

Then run:

```javascript
// Get TBTC contract
const TBTC = await ethers.getContractAt(
    "TestToken", 
    "0xA4D2CbAF027125a967E48e94b1Baa03363981b1c"
);

// Check your balance
const balance = await TBTC.balanceOf("YOUR_ADDRESS_HERE");
console.log("TBTC Balance:", ethers.formatUnits(balance, 8));

// You should see around 890 TBTC
// (1000 minted - 100 added to liquidity - 10 swapped)
```

---

## 🎨 Part 7: See the Frontend (Optional)

Want to see a UI for your DEX? Let's fire it up!

```bash
# Open a new terminal
cd frontend
pnpm install
pnpm dev
```

Open http://localhost:3000 in your browser:

![Frontend Swap](./docs/screenshots/04_frontend_swap.png)

**Cool, right?** You can see:
- Your token balances
- The swap interface
- Pool information

> **Note**: The frontend is read-only for now. Use the Hardhat scripts for transactions. This is actually how many production dApps work - backend execution with frontend visualization!

---

## 🎓 What You Just Learned

Let's recap what you accomplished:

1. ✅ **Set up a MIDL development environment**
2. ✅ **Deployed smart contracts to Bitcoin L1**
3. ✅ **Created your own tokens** (TBTC & WBTC)
4. ✅ **Built a Uniswap V2 DEX** with liquidity pools
5. ✅ **Executed real trades** on your DEX
6. ✅ **Verified everything** on a blockchain explorer

**You're now a Bitcoin DeFi developer!** 🎉

---

## 🚀 What's Next?

### Customize Your DEX

Want to make it your own? Here are some ideas:

**1. Create Your Own Token**

Edit `contracts/contracts/TestToken.sol`:
```solidity
constructor() ERC20("MyAwesomeToken", "MAT") {
    _mint(msg.sender, 1000000 * 10 ** decimals());
}
```

Then deploy:
```bash
npx hardhat deploy --tags Tokens --network default --reset
```

**2. Add More Liquidity**

Create `scripts/add-more-liquidity.ts`:
```typescript
import { ethers } from "hardhat";

async function main() {
    const hre = require("hardhat");
    await hre.midl.initialize();

    const ROUTER = "0x29cf3A9B709f94Eb46fBbA67753B90E721ddC9Ed";
    const TBTC = "0xA4D2CbAF027125a967E48e94b1Baa03363981b1c";
    const WBTC = "0xca0daeff9cB8DED3EEF075Df62aDBb1522479639";
    
    const [deployer] = await ethers.getSigners();
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    // Add 50 TBTC + 0.5 WBTC
    await hre.midl.execute({
        name: "AddMoreLiquidity",
        address: ROUTER,
        functionName: "addLiquidity",
        args: [
            TBTC,
            WBTC,
            ethers.parseUnits("50", 8),      // 50 TBTC
            ethers.parseUnits("0.5", 18),    // 0.5 WBTC
            "0",
            "0",
            deployer.address,
            deadline.toString(),
        ],
    });

    await hre.midl.execute();
    console.log("✅ Added more liquidity!");
}

main().catch(console.error);
```

Run it:
```bash
npx hardhat run scripts/add-more-liquidity.ts --network default
```

**3. Custom Swap Amounts**

Try swapping different amounts:
```typescript
// Swap 25 TBTC for WBTC
const amountIn = ethers.parseUnits("25", 8);
// ... rest of swap code
```

### Deploy to Testnet

Ready for the real deal? Deploy to MIDL Testnet:

1. Update `hardhat.config.ts`:
```typescript
midlTestnet: {
    url: "https://rpc.testnet.midl.xyz",
    accounts: { mnemonic: vars.get("MNEMONIC") },
}
```

2. Get testnet BTC from a faucet

3. Deploy:
```bash
npx hardhat deploy --network midlTestnet
```

### Build More Features

- **Price Oracle** - Add Chainlink price feeds
- **Multi-hop Swaps** - Swap through multiple pools
- **Limit Orders** - Add order book functionality
- **Yield Farming** - Reward liquidity providers
- **Governance** - Add DAO voting

---

## 🤔 Common Questions

### Q: Is this really on Bitcoin?
**A:** Yes! MIDL is Bitcoin Layer 1 with EVM compatibility. Your transactions are secured by Bitcoin miners.

### Q: Can I use this in production?
**A:** This starter kit is for learning. For production:
- Get a professional audit
- Test extensively on testnet
- Use proper key management
- Implement emergency pause functions

### Q: Why use scripts instead of the frontend?
**A:** MIDL's transaction signing is still evolving. Scripts give you 100% reliability. Many production dApps use this pattern - backend execution with frontend visualization.

### Q: How much does it cost?
**A:** On regtest (what we used), it's free! On mainnet, you pay Bitcoin transaction fees.

### Q: Can I add more tokens?
**A:** Absolutely! Just deploy more ERC20 contracts and create pairs for them.

---

## 🐛 Troubleshooting

### "No intentions to execute"
This is normal! It means the transaction already went through. MIDL uses an "intention" system where transactions are queued then executed.

### "Insufficient allowance"
You need to approve the Router first:
```bash
npx hardhat deploy --tags TestDex --network default --reset
```

### "INSUFFICIENT_LIQUIDITY"
Add more liquidity to the pool:
```bash
npx hardhat deploy --tags AddLiquidity --network default
```

### Need help?
- Check the [TESTING.md](./TESTING.md) guide
- Open an issue on GitHub
- Join the MIDL Discord

---

## 📚 Additional Resources

### Documentation
- **This Starter Kit**: You're reading it!
- **MIDL Docs**: https://js.midl.xyz
- **Hardhat Docs**: https://hardhat.org
- **Uniswap V2 Docs**: https://docs.uniswap.org/contracts/v2

### Code Reference
- `contracts/contracts/` - Smart contracts
- `contracts/deploy/` - Deployment scripts
- `contracts/scripts/` - Utility scripts
- `frontend/src/` - React frontend

### Screenshots
All tutorial screenshots are in `docs/screenshots/`:
- Faucet output
- DEX test output
- Blockscout verification
- Frontend UI

---

## 🎯 Challenge Yourself

Ready to level up? Try these challenges:

**Beginner:**
- [ ] Change token names and symbols
- [ ] Mint different amounts
- [ ] Try different swap amounts

**Intermediate:**
- [ ] Create a third token and pair
- [ ] Remove liquidity from a pool
- [ ] Calculate price impact of swaps

**Advanced:**
- [ ] Add a fee-on-transfer token
- [ ] Implement flash swaps
- [ ] Build a price chart
- [ ] Create an arbitrage bot

---

## 🙏 Credits

This starter kit was built with:
- **MIDL** - Bitcoin Layer 1 with EVM
- **Uniswap V2** - AMM protocol
- **Hardhat** - Development environment
- **React** - Frontend framework

---

## 📄 License

MIT License - feel free to use this for learning, building, or teaching!

---

## 🎉 You Did It!

You just built a DEX on Bitcoin! That's seriously impressive. 

Here's what you can do now:
1. ⭐ Star this repo if you found it helpful
2. 🐦 Share what you built on Twitter
3. 🚀 Deploy to testnet and show your friends
4. 💡 Build something new with what you learned

**Welcome to Bitcoin DeFi development!** 🚀

Got questions? Found a bug? Want to contribute? Open an issue or PR!

Happy building! 🛠️

---

**Made with ❤️ for the Bitcoin community**

*Last updated: January 2026*
