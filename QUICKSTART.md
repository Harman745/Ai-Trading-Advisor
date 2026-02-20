# 🚀 Quick Start Guide

Get up and running with AI Trading Advisor in 5 minutes!

## Prerequisites

Before you begin, make sure you have:
- ✅ [Node.js](https://nodejs.org/) (version 16 or higher)
- ✅ npm (comes with Node.js)
- ✅ [Anthropic API key](https://console.anthropic.com/)

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/ai-trading-advisor.git
cd ai-trading-advisor
```

Or download the ZIP file and extract it.

---

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (React, Vite, Tailwind, etc.)

---

## Step 3: Get Your Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to "API Keys"
4. Click "Create Key"
5. Copy your API key

💰 **Note:** Anthropic offers a free trial. Check their [pricing page](https://www.anthropic.com/pricing) for details.

---

## Step 4: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env
```

Now edit `.env` and add your API key:

```bash
VITE_ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

---

## Step 5: Start the Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Step 6: Open in Browser

Open your browser and go to:
```
http://localhost:5173
```

🎉 **You're ready to go!**

---

## 🎯 First Steps

### Try Single Analysis
1. Click the menu button (☰)
2. Select "Single Analysis"
3. Enter `BTC` or `AAPL`
4. Click "Analyze Market"
5. Get instant AI analysis!

### Upload a Chart
1. Click menu → "Chart Analysis"
2. Take a screenshot of any trading chart
3. Upload it
4. Get price predictions!

### Set a Price Alert
1. Click menu → "Price Alerts"
2. Enter symbol and price
3. Click "Create Alert"
4. Check alerts anytime!

---

## 🐛 Troubleshooting

### "Cannot find module 'react'"
```bash
rm -rf node_modules
npm install
```

### "API key is invalid"
- Make sure your API key is correct in `.env`
- Ensure it starts with `sk-ant-`
- Restart the dev server after changing `.env`

### Port 5173 already in use
```bash
# Use a different port
npm run dev -- --port 3000
```

---

## 📚 Learn More

- [Full Documentation](./README.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Contributing](./CONTRIBUTING.md)

---

## 💡 Tips

1. **Save your work**: Your alerts and portfolio are saved in the browser
2. **API costs**: Monitor your usage at console.anthropic.com
3. **Backup data**: Export your data regularly (feature coming soon)
4. **Stay updated**: Pull latest changes regularly

---

## 🆘 Need Help?

- 📖 Check the [README](./README.md)
- 🐛 [Open an issue](https://github.com/yourusername/ai-trading-advisor/issues)
- 💬 Contact the maintainers

---

**Happy Trading! 📈**
