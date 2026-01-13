# Tutorial Screenshots

This directory contains screenshots for the MIDL DEX tutorial.

## Hardhat Script Outputs

### 1. Faucet Script
**File**: `faucet_script_output.png`

Shows the output of running:
```bash
npx hardhat deploy --tags Faucet --network default
```

**What it demonstrates:**
- Token minting process
- MIDL intention execution
- Success confirmation
- Blockscout verification link

### 2. Complete DEX Test Script
**File**: `testdex_script_output.png`

Shows the output of running:
```bash
npx hardhat deploy --tags TestDex --network default
```

**What it demonstrates:**
- Step 1: Approving Router for TBTC
- Step 2: Approving Router for WBTC
- Step 3: Adding Liquidity (100 TBTC + 1 WBTC)
- Step 4: Swapping 10 TBTC for WBTC
- Complete DEX flow execution
- Transaction verification link

### 3. Blockscout Transaction History
**File**: `blockscout_transactions.png`

Shows the Blockscout explorer page with:
- User address and token balances
- Transaction history:
  - Swap transaction
  - Add Liquidity transaction
  - Token approvals (TBTC, WBTC)
  - Token minting
- All transactions marked as successful
- Gas fees and timestamps

## Frontend Screenshots

### 4. Initial Swap Page
**File**: `initial_swap_page.png`

Shows:
- Connect Wallet button
- Swap interface with TBTC selection
- Clean, modern UI design

### 5. Pools Page
**File**: `pools_page_initial.png`

Shows:
- "Top pools by TVL" section
- Pool interface layout
- Navigation tabs

### 6. Liquidity Tab
**File**: `liquidity_tab_ui.png`

Shows:
- Add Liquidity interface
- Token selection for TBTC
- Balance display

## Usage in Tutorial

These screenshots should be used in the tutorial to demonstrate:

1. **Backend Testing** (Hardhat Scripts)
   - How to mint test tokens
   - How to execute complete DEX operations
   - Verification on Blockscout

2. **Frontend Interface** (UI Screenshots)
   - Wallet connection flow
   - Swap interface
   - Liquidity management
   - Pool data display

## Screenshot Locations

All screenshots are saved in:
`/Users/macbook/.gemini/antigravity/brain/98c28984-94e7-4371-a369-3fd9c40e347a/`

Files:
- `faucet_script_output_*.png`
- `testdex_script_output_*.png`
- `blockscout_transactions_*.png`
- `initial_swap_page_*.png`
- `pools_page_initial_*.png`
- `liquidity_tab_ui_*.png`
