

# 🚀 AI Trading & Investment Advisor


An AI-powered trading analysis and portfolio management tool built with React and OpenAI API.

---


## ✨ Features

- 📊 **Single Asset Analysis:** AI-powered analysis for stocks, crypto, or other assets. Technical indicators, sentiment, entry/stop loss, and risk assessment.
- ⚖️ **Compare Investments:** Compare up to 3 assets side-by-side. AI recommendations and portfolio allocation suggestions.
- 📈 **Chart Analysis:** Upload trading chart images for AI pattern and trend analysis.
- 🔔 **Price Alerts:** Set custom price alerts for any asset. Multiple alert types and persistent storage.
- 💼 **Portfolio Tracker:** Track investments and real-time profit/loss.
- 📰 **News Sentiment Analysis:** Analyze market sentiment from recent news headlines.
- 🧮 **Risk Calculator:** Calculate position sizes, risk/reward, and money management.

---



## 🛠️ Installation


### ⚡ Prerequisites
- Node.js 16+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))


### 🚀 Quick Start

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
	- Copy `.env.example` to `.env` and add your OpenAI API key:
	  ```
	  VITE_OPENAI_API_KEY=your_openai_api_key_here
	  ```
4. **Run the development server**
	```bash
	npm run dev
	```
5. **Open your browser**
	- Go to [http://localhost:5173](http://localhost:5173)


## 🔑 Getting an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in with your OpenAI account
3. Click "Create new secret key"
4. Copy and paste into your `.env` file

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


### ⏳ Export/Import (Coming Soon)
Backup and restore your data across devices with JSON export/import.


## 🔒 Security & Privacy

- All data stored locally in your browser
- API calls made directly to OpenAI (no intermediary server)
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

## 📧 Contact

If you have any questions or suggestions, please open an issue or contact [Harman.singh3@mail.bcu.ac.uk]


## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐️!

---


**Made with ❤️ and AI**
