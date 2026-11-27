

# 🚀 AI Trading & Investment Advisor


A React and Node.js educational trading simulator. Explore AI-generated asset scenarios, analyze an uploaded chart and estimate the value of a practice portfolio. The app has no live price or news feed.

---


## ✨ Features

- 📊 **Single Asset Analysis:** AI-powered analysis for stocks, crypto, or other assets. Technical indicators, sentiment, entry/stop loss, and risk assessment.
- ⚖️ **Compare Investments:** Compare up to 3 assets side-by-side. AI recommendations and portfolio allocation suggestions.
- 📈 **Chart Analysis:** Upload trading chart images for AI pattern and trend analysis.
- 🔔 **Price Alerts:** Check price and percentage thresholds on demand against simulated USD estimates.
- 💼 **Portfolio Tracker:** See estimated values and simulated gains or losses alongside the purchase prices you entered.
- 📰 **News Sentiment Analysis:** Explore how hypothetical headlines could affect an asset.
- 🧮 **Risk Calculator:** Calculate position sizes, risk/reward, and money management.

---



## 🛠️ Installation


### ⚡ Prerequisites
- Node.js 22 or newer and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))


### 🚀 Quick Start

1. **Clone the repository**
	```bash
	git clone https://github.com/Harman745/Ai-Trading-Advisor.git
	cd Ai-Trading-Advisor
	```
2. **Install dependencies**
	```bash
	npm ci
	```
3. **Set up environment variables**
	- Copy `.env.example` to `.env` and add your OpenAI API key:
	  ```
	  OPENAI_API_KEY=your_openai_api_key_here
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

Run `npm start` to serve the built site and its same-origin `POST /api/advisor` endpoint. The default port is 3000. A Node host can supply `PORT` and `OPENAI_API_KEY` as runtime environment variables. Uploading only `dist/` to a static host omits the AI endpoint.

Run `npm test` for the offline integration and simulation tests. `npm run preview` also serves the local API. With no server key, the risk calculator and local portfolio editing remain available. AI actions display a setup message.


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
3. Click "Check Alert Estimates" to generate simulated prices and check thresholds. A percentage alert takes its first valid estimate as the baseline.

### Portfolio Tracker
1. Select "Portfolio Tracker"
2. Add your holdings with quantity and buy price
3. Click "Refresh AI Estimates" to simulate USD values
4. View estimated profit/loss. Missing estimates stay blank or retain their last successful value and timestamp.

### Risk Calculator
1. Select "Risk Calculator"
2. Enter account size, risk %, entry, and stop loss
3. Optionally add target price
4. Get exact position sizing recommendations


## 💾 Data Storage

Alerts and holdings are saved in this browser. Your entered quantities and purchase prices are used locally to calculate estimated profit/loss. Refreshing estimates sends the requested asset symbols to the server.

## 🔒 AI requests and configuration

The browser sends analysis requests to the Node server. The server calls OpenAI with its own key. Depending on the feature, OpenAI receives the requested symbols, chart image, or chat question and analysis context.

Keep the server key in the host's environment or an ignored local `.env` file. If a previous version was deployed with a browser-visible key, revoke that key and use a new one. The single-process server limits AI usage to 60 requests per hour and four concurrent calls across visitors. Restarting the process resets that limit.

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
