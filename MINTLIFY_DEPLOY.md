# 🚀 Deploying Your Mintlify Docs

Your documentation is now set up with Mintlify! Here's how to deploy it.

## Option 1: Mintlify Cloud (Recommended) ⭐

### Step 1: Sign Up
1. Go to [mintlify.com](https://mintlify.com)
2. Click "Get Started"
3. Sign in with GitHub

### Step 2: Connect Repository
1. Click "New Project"
2. Select your repository: `Svector-anu/midint`
3. Mintlify will auto-detect `mint.json`
4. Click "Deploy"

### Step 3: Your Docs are Live!
Your docs will be available at:
```
https://midint.mintlify.app
```

Or set up a custom domain:
```
docs.yourdomain.com
```

## Option 2: Self-Host with Mintlify CLI

### Install Mintlify CLI
```bash
npm i -g mintlify
```

### Preview Locally
```bash
cd /Users/macbook/Midl
mintlify dev
```

Open: http://localhost:3000

### Build for Production
```bash
mintlify build
```

Deploy the `_site` folder to:
- Vercel
- Netlify
- GitHub Pages
- Any static host

## What You Get

### Beautiful Documentation Site
- 📱 Mobile responsive
- 🌙 Dark mode
- 🔍 Built-in search
- 📊 Analytics ready
- 🎨 Custom branding

### Navigation Structure
```
Home
├── Introduction
├── Quickstart
│
Tutorial
├── Overview
├── Setup
├── Deploy
├── Test
├── Verify
└── Frontend
│
Advanced
├── Scripts
├── Custom Tokens
├── Testnet
└── Troubleshooting
│
Reference
├── Contracts
├── Networks
└── Screenshots
```

### Features Enabled
- ✅ GitHub integration
- ✅ Telegram link
- ✅ Code syntax highlighting
- ✅ Interactive components
- ✅ Feedback buttons
- ✅ Edit suggestions

## Next Steps

### 1. Complete the Tutorial Pages
Create these files to match the navigation:

```bash
# Tutorial pages
tutorial/setup.mdx
tutorial/deploy.mdx
tutorial/test.mdx
tutorial/verify.mdx
tutorial/frontend.mdx

# Advanced pages
advanced/scripts.mdx
advanced/custom-tokens.mdx
advanced/testnet.mdx
advanced/troubleshooting.mdx

# Reference pages
reference/networks.mdx
reference/screenshots.mdx
```

### 2. Add Images
Create `public/images/` folder:
```bash
mkdir -p public/images
# Add your logo and hero images
```

### 3. Customize Branding
Edit `mint.json`:
- Update colors to match your brand
- Add your logo
- Customize navigation

### 4. Deploy
Push to GitHub and Mintlify auto-deploys!

## Tips

### Use Mintlify Components

**Cards:**
```mdx
<Card title="Title" icon="rocket" href="/link">
  Description
</Card>
```

**Steps:**
```mdx
<Steps>
  <Step title="First">Content</Step>
  <Step title="Second">Content</Step>
</Steps>
```

**Code Groups:**
```mdx
<CodeGroup>
```bash Terminal
npm install
\```

```javascript Code
const x = 1;
\```
</CodeGroup>
```

**Callouts:**
```mdx
<Note>Important note</Note>
<Tip>Helpful tip</Tip>
<Warning>Be careful!</Warning>
<Check>Success message</Check>
```

## Support

- **Mintlify Docs**: https://mintlify.com/docs
- **Mintlify Discord**: https://discord.gg/mintlify
- **GitHub**: https://github.com/mintlify/mint

---

**Your docs are ready to go live!** 🎉

Just sign up at mintlify.com and connect your GitHub repo!
