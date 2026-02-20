# 🚀 AI Trading & Investment Advisor

A comprehensive AI-powered trading analysis and portfolio management tool built with React and Claude AI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![AI Powered](https://img.shields.io/badge/AI-Claude%20Sonnet%204-purple.svg)

## ✨ Features

### 📊 **Single Asset Analysis**
- Get AI-powered analysis for any stock, crypto, or asset
- Technical indicators and market sentiment
- Entry strategy and stop loss recommendations
- Risk level assessment

### ⚖️ **Compare Investments**
- Compare up to 3 assets side-by-side
- Get AI recommendations on which to invest in
- See pros, cons, and risk/reward for each
- Portfolio allocation suggestions

### 📈 **Chart Analysis**
- Upload any trading chart image
- AI predicts price direction (UP/DOWN/SIDEWAYS)
- Identifies chart patterns and technical indicators
- Provides support/resistance levels and price targets

### 🔔 **Price Alerts**
- Set custom price alerts for any asset
- Multiple alert types: above/below price, percentage changes
- Persistent storage across sessions
- Manual price checking (click to update)

### 💼 **Portfolio Tracker**
- Track all your investments in one place
- Real-time profit/loss calculations
- Performance breakdown by asset
- Update prices with one click

### 📰 **News Sentiment Analysis**
- Analyze market sentiment from recent news
- Get sentiment scores and price impact predictions
- See key headlines with impact ratings
- AI recommendations based on news

### 🧮 **Risk Calculator**
- Calculate optimal position sizes
- Risk/reward ratio analysis
- Stop loss and target price planning
- Money management guidance

## 🛠️ Installation

### Prerequisites
- Node.js 16+ and npm
- Google Gemini API key ([Get FREE key here](https://aistudio.google.com/app/apikey)) - **No credit card required!**

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-trading-advisor.git
cd ai-trading-advisor
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## 🔑 Getting a FREE Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy and paste into your `.env` file

**100% FREE - No credit card needed!**
- 15 requests per minute
- 1,500 requests per day
- Perfect for personal use

📖 **Detailed setup guide:** See [GEMINI-SETUP.md](./GEMINI-SETUP.md)

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## 🎯 Usage Guide

### Single Analysis
1. Click the menu button
2. Select "Single Analysis"
3. Enter any symbol (BTC, ETH, AAPL, TSLA, etc.)
4. Click "Analyze Market"

### Compare Investments
1. Select "Compare Investments" from menu
2. Enter 2-3 asset symbols
3. Click "Compare Assets"
4. See recommendations and allocation

### Chart Analysis
1. Select "Chart Analysis"
2. Upload a trading chart image (screenshot from any platform)
3. Click "Analyze Chart"
4. Get AI predictions and insights

### Price Alerts
1. Select "Price Alerts"
2. Enter symbol and set conditions
3. Click "Check All Alerts Now" to see if any triggered

### Portfolio Tracker
1. Select "Portfolio Tracker"
2. Add your holdings with quantity and buy price
3. Click "Update All Prices" to see current values
4. Track your profit/loss in real-time

### Risk Calculator
1. Select "Risk Calculator"
2. Enter account size, risk %, entry, and stop loss
3. Optionally add target price
4. Get exact position sizing recommendations

## 💾 Data Storage

Your data is stored locally in your browser using the Storage API:
- ✅ **Price alerts** - Saved automatically
- ✅ **Portfolio holdings** - Saved automatically
- ✅ **Privacy-first** - Data never leaves your device

### Export/Import (Coming Soon)
Backup and restore your data across devices with JSON export/import.

## 🔒 Security & Privacy

- All data stored locally in your browser
- API calls made directly to Anthropic (no intermediary server)
- Your API key is stored in environment variables (never committed to git)
- No user tracking or analytics

## 🚨 Disclaimer

**This tool is for educational purposes only and is NOT financial advice.**

- Past performance does not guarantee future results
- Cryptocurrency and stock trading involves substantial risk
- Only invest what you can afford to lose completely
- Always do your own research (DYOR)
- Consult licensed financial advisors before making investment decisions

The AI provides analysis based on available information but cannot predict market movements with certainty.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google AI](https://ai.google.dev/) for Gemini API (FREE tier!)
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for blazing fast development

## 📧 Contact

If you have any questions or suggestions, please open an issue or contact [your@email.com]

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐️!

---

**Made with ❤️ and AI**
