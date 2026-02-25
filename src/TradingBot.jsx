import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, XCircle, BarChart3, Clock, Activity, GitCompare, Sparkles, Menu, X, Newspaper, Calculator } from 'lucide-react';
import { callOpenAIAPI, callOpenAIAPIWithImage } from './openaiAPI.js';

export default function TradingBot() {
  const [symbol, setSymbol] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [userQuestion, setUserQuestion] = useState('');
  
  // Comparison feature state
  const [compareSymbols, setCompareSymbols] = useState(['', '', '']);
  const [comparing, setComparing] = useState(false);
  const [comparison, setComparison] = useState(null);
  const [activeTab, setActiveTab] = useState('single'); // 'single', 'compare', 'chart', 'alerts', 'portfolio', 'news', or 'risk'
  
  // Chart analysis state
  const [chartImage, setChartImage] = useState(null);
  const [chartImagePreview, setChartImagePreview] = useState(null);
  const [analyzingChart, setAnalyzingChart] = useState(false);
  const [chartAnalysis, setChartAnalysis] = useState(null);
  
  // Price alerts state
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    condition: 'above', // above, below, change_up, change_down
    price: '',
    percentage: ''
  });
  const [checkingAlerts, setCheckingAlerts] = useState(false);

  // Portfolio tracker state
  const [portfolio, setPortfolio] = useState([]);
  const [newHolding, setNewHolding] = useState({
    symbol: '',
    quantity: '',
    buyPrice: '',
    buyDate: new Date().toISOString().split('T')[0]
  });
  const [updatingPortfolio, setUpdatingPortfolio] = useState(false);
  const [portfolioStats, setPortfolioStats] = useState(null);

  // News sentiment state
  const [newsSymbol, setNewsSymbol] = useState('');
  const [analyzingNews, setAnalyzingNews] = useState(false);
  const [newsSentiment, setNewsSentiment] = useState(null);

  // Risk calculator state
  const [riskCalc, setRiskCalc] = useState({
    accountSize: '',
    riskPercent: '2',
    entryPrice: '',
    stopLoss: '',
    targetPrice: ''
  });
  const [riskResults, setRiskResults] = useState(null);

  // Menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Load alerts from storage on mount
  useEffect(() => {
    loadAlerts();
    loadPortfolio();
  }, []);

  const loadAlerts = async () => {
    try {
      if (window.storage && window.storage.get) {
        const result = await window.storage.get('trading-alerts');
        if (result && result.value) {
          setAlerts(JSON.parse(result.value));
        }
      }
    } catch (error) {
      console.log('Using in-memory storage - alerts will not persist:', error);
      // Continue without storage - alerts will work but not persist
    }
  };

  const saveAlerts = async (alertsList) => {
    try {
      if (window.storage && window.storage.set) {
        await window.storage.set('trading-alerts', JSON.stringify(alertsList));
      }
    } catch (error) {
      console.log('Could not save alerts:', error);
      // Continue without saving - alerts will work but not persist
    }
  };

  const loadPortfolio = async () => {
    try {
      if (window.storage && window.storage.get) {
        const result = await window.storage.get('trading-portfolio');
        if (result && result.value) {
          setPortfolio(JSON.parse(result.value));
        }
      }
    } catch (error) {
      console.log('Using in-memory storage - portfolio will not persist:', error);
    }
  };

  const savePortfolio = async (portfolioList) => {
    try {
      if (window.storage && window.storage.set) {
        await window.storage.set('trading-portfolio', JSON.stringify(portfolioList));
      }
    } catch (error) {
      console.log('Could not save portfolio:', error);
    }
  };

  const analyzeMarket = async () => {
    if (!symbol.trim()) return;
    
    setAnalyzing(true);
    setAnalysis(null);

    try {
      const parsed = await callGeminiAPIForJSON(`Analyze ${symbol.toUpperCase()} for trading/investment.

Return ONLY valid JSON with this exact structure (no extra text):
{
  "sentiment": "bullish",
  "confidence": 75,
  "shouldTrade": "YES",
  "riskLevel": "medium",
  "technicalIndicators": ["Indicator 1", "Indicator 2"],
  "entryStrategy": "Entry strategy text",
  "stopLoss": "Stop loss recommendation",
  "warnings": ["Warning 1", "Warning 2"],
  "reasoning": "Brief explanation"
}

Use: sentiment (bullish/bearish/neutral), shouldTrade (YES/NO), riskLevel (low/medium/high)`);

      setAnalysis(parsed);
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysis({
        sentiment: "neutral",
        confidence: 0,
        shouldTrade: "NO",
        riskLevel: "high",
        technicalIndicators: ["Unable to analyze"],
        entryStrategy: "Cannot provide strategy",
        stopLoss: "N/A",
        warnings: ["Analysis failed - please try again"],
        reasoning: "Error occurred during analysis"
      });
    }

    setAnalyzing(false);
  };

  const compareAssets = async () => {
    const validSymbols = compareSymbols.filter(s => s.trim());
    if (validSymbols.length < 2) {
      alert('Please enter at least 2 assets to compare');
      return;
    }
    
    setComparing(true);
    setComparison(null);

    try {
      const parsed = await callGeminiAPIForJSON(`Compare these crypto assets for investment: ${validSymbols.join(', ')}

Return ONLY valid JSON (no extra text):
{
  "assets": [
    {
      "symbol": "BTC",
      "score": 85,
      "sentiment": "bullish",
      "riskLevel": "medium",
      "potentialReturn": "high",
      "timeHorizon": "long-term",
      "pros": ["Pro 1", "Pro 2"],
      "cons": ["Con 1", "Con 2"]
    }
  ],
  "topPick": {
    "symbol": "BTC",
    "reason": "Reason for top pick"
  },
  "allocation": {
    "BTC": 50,
    "ETH": 30
  },
  "overallStrategy": "Investment strategy",
  "keyInsights": ["Insight 1", "Insight 2"],
  "warnings": ["Warning 1", "Warning 2"]
}

Provide realistic analysis for each symbol entered.`);
      setComparison(parsed);
    } catch (error) {
      console.error("Comparison error:", error);
      setComparison({
        assets: [],
        topPick: { symbol: "N/A", reason: "Analysis failed" },
        allocation: {},
        overallStrategy: "Unable to provide strategy",
        keyInsights: ["Error occurred during comparison"],
        warnings: ["Please try again"]
      });
    }

    setComparing(false);
  };

  const handleChartUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setChartImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setChartImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeChart = async () => {
    if (!chartImage) {
      alert('Please upload a chart image first');
      return;
    }

    setAnalyzingChart(true);
    setChartAnalysis(null);

    try {
      // Convert image to base64
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(chartImage);
      });

      const responseText = await callGeminiAPIWithImage(`Analyze this trading chart. Provide technical analysis and price prediction.

Return ONLY valid JSON (no extra text):
{
  "direction": "UP",
  "confidence": 75,
  "reasoning": "Detailed explanation of chart patterns and indicators",
  "keyPatterns": ["Pattern 1", "Pattern 2"],
  "supportLevels": ["Level 1", "Level 2"],
  "resistanceLevels": ["Level 1", "Level 2"],
  "indicators": {
    "trend": "bullish",
    "momentum": "strong",
    "volume": "increasing"
  },
  "prediction": {
    "shortTerm": "Likely to rise 5-10% in next 1-2 days",
    "mediumTerm": "Could reach resistance at $X in 1-2 weeks",
    "targets": ["Target 1: $X", "Target 2: $Y"]
  },
  "riskFactors": ["Risk 1", "Risk 2"],
  "recommendation": "BUY/SELL/HOLD with explanation"
}

direction should be: UP, DOWN, or SIDEWAYS
confidence: 0-100 percentage`
      , base64Data, chartImage.type);

      // Clean up the response
      let cleanText = responseText
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanText = jsonMatch[0];
      }
      
      const parsed = JSON.parse(cleanText);
      setChartAnalysis(parsed);
    } catch (error) {
      console.error("Chart analysis error:", error);
      setChartAnalysis({
        direction: "UNKNOWN",
        confidence: 0,
        reasoning: "Failed to analyze chart. Please try again with a clearer image.",
        keyPatterns: ["Analysis failed"],
        supportLevels: [],
        resistanceLevels: [],
        indicators: { trend: "unknown", momentum: "unknown", volume: "unknown" },
        prediction: { shortTerm: "N/A", mediumTerm: "N/A", targets: [] },
        riskFactors: ["Could not analyze chart"],
        recommendation: "Unable to provide recommendation"
      });
    }

    setAnalyzingChart(false);
  };

  const addAlert = () => {
    if (!newAlert.symbol.trim()) {
      alert('Please enter a symbol');
      return;
    }

    if (newAlert.condition === 'above' || newAlert.condition === 'below') {
      if (!newAlert.price || parseFloat(newAlert.price) <= 0) {
        alert('Please enter a valid price');
        return;
      }
    } else {
      if (!newAlert.percentage || parseFloat(newAlert.percentage) <= 0) {
        alert('Please enter a valid percentage');
        return;
      }
    }

    const alert = {
      id: Date.now(),
      symbol: newAlert.symbol.toUpperCase(),
      condition: newAlert.condition,
      price: newAlert.price ? parseFloat(newAlert.price) : null,
      percentage: newAlert.percentage ? parseFloat(newAlert.percentage) : null,
      createdAt: new Date().toISOString(),
      status: 'active',
      triggered: false
    };

    const updatedAlerts = [...alerts, alert];
    setAlerts(updatedAlerts);
    saveAlerts(updatedAlerts);

    // Reset form
    setNewAlert({
      symbol: '',
      condition: 'above',
      price: '',
      percentage: ''
    });
  };

  const deleteAlert = (id) => {
    const updatedAlerts = alerts.filter(a => a.id !== id);
    setAlerts(updatedAlerts);
    saveAlerts(updatedAlerts);
  };

  const checkAlerts = async () => {
    if (alerts.length === 0) {
      alert('No alerts to check. Create some alerts first!');
      return;
    }

    setCheckingAlerts(true);

    try {
      // Get unique symbols
      const symbols = [...new Set(alerts.map(a => a.symbol))];

      // Check each symbol's current price using AI
      const parsed = await callGeminiAPIForJSON(`Get current prices for these symbols: ${symbols.join(', ')}

Return ONLY valid JSON with current prices:
{
  "prices": {
    "BTC": 45000,
    "ETH": 2500
  }
}

Use realistic current market prices. If you don't know exact price, provide reasonable estimate.`);
      const prices = parsed.prices;

      // Check each alert
      const updatedAlerts = alerts.map(alert => {
        const currentPrice = prices[alert.symbol];
        if (!currentPrice) return alert;

        let triggered = false;

        if (alert.condition === 'above' && currentPrice >= alert.price) {
          triggered = true;
        } else if (alert.condition === 'below' && currentPrice <= alert.price) {
          triggered = true;
        }

        if (triggered && !alert.triggered) {
          // Show notification
          alert.status = 'triggered';
          alert.triggered = true;
          alert.triggeredAt = new Date().toISOString();
          alert.triggeredPrice = currentPrice;
        }

        return alert;
      });

      setAlerts(updatedAlerts);
      saveAlerts(updatedAlerts);

      // Show triggered alerts
      const triggeredAlerts = updatedAlerts.filter(a => a.triggered && a.status === 'triggered');
      if (triggeredAlerts.length > 0) {
        const messages = triggeredAlerts.map(a => 
          `🔔 ${a.symbol}: $${a.triggeredPrice} (${a.condition} $${a.price})`
        ).join('\n');
        alert(`ALERTS TRIGGERED!\n\n${messages}`);
      } else {
        alert('✓ All alerts checked. No triggers yet.');
      }

    } catch (error) {
      console.error('Alert check error:', error);
      alert('Failed to check alerts. Please try again.');
    }

    setCheckingAlerts(false);
  };

  const addHolding = () => {
    if (!newHolding.symbol.trim()) {
      alert('Please enter a symbol');
      return;
    }
    if (!newHolding.quantity || parseFloat(newHolding.quantity) <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    if (!newHolding.buyPrice || parseFloat(newHolding.buyPrice) <= 0) {
      alert('Please enter a valid buy price');
      return;
    }

    const holding = {
      id: Date.now(),
      symbol: newHolding.symbol.toUpperCase(),
      quantity: parseFloat(newHolding.quantity),
      buyPrice: parseFloat(newHolding.buyPrice),
      buyDate: newHolding.buyDate,
      currentPrice: parseFloat(newHolding.buyPrice), // Will be updated
      addedAt: new Date().toISOString()
    };

    const updatedPortfolio = [...portfolio, holding];
    setPortfolio(updatedPortfolio);
    savePortfolio(updatedPortfolio);

    // Reset form
    setNewHolding({
      symbol: '',
      quantity: '',
      buyPrice: '',
      buyDate: new Date().toISOString().split('T')[0]
    });
  };

  const deleteHolding = (id) => {
    const updatedPortfolio = portfolio.filter(h => h.id !== id);
    setPortfolio(updatedPortfolio);
    savePortfolio(updatedPortfolio);
  };

  const updatePortfolioPrices = async () => {
    if (portfolio.length === 0) {
      alert('No holdings in portfolio. Add some first!');
      return;
    }

    setUpdatingPortfolio(true);

    try {
      const symbols = [...new Set(portfolio.map(h => h.symbol))];

      const parsed = await callGeminiAPIForJSON(`Get current market prices for: ${symbols.join(', ')}

Return ONLY valid JSON:
{
  "prices": {
    "BTC": 45000,
    "ETH": 2500
  }
}

Use realistic current market prices.`);
      const prices = parsed.prices;

      // Update portfolio with current prices
      const updatedPortfolio = portfolio.map(holding => ({
        ...holding,
        currentPrice: prices[holding.symbol] || holding.currentPrice,
        lastUpdated: new Date().toISOString()
      }));

      setPortfolio(updatedPortfolio);
      savePortfolio(updatedPortfolio);

      // Calculate stats
      let totalInvested = 0;
      let totalCurrent = 0;

      updatedPortfolio.forEach(holding => {
        totalInvested += holding.quantity * holding.buyPrice;
        totalCurrent += holding.quantity * holding.currentPrice;
      });

      const totalPL = totalCurrent - totalInvested;
      const totalPLPercent = (totalPL / totalInvested) * 100;

      setPortfolioStats({
        totalInvested,
        totalCurrent,
        totalPL,
        totalPLPercent,
        holdings: updatedPortfolio.map(h => ({
          symbol: h.symbol,
          invested: h.quantity * h.buyPrice,
          current: h.quantity * h.currentPrice,
          pl: (h.quantity * h.currentPrice) - (h.quantity * h.buyPrice),
          plPercent: ((h.currentPrice - h.buyPrice) / h.buyPrice) * 100
        }))
      });

    } catch (error) {
      console.error('Portfolio update error:', error);
      alert('Failed to update prices. Please try again.');
    }

    setUpdatingPortfolio(false);
  };

  const analyzeNewsSentiment = async () => {
    if (!newsSymbol.trim()) {
      alert('Please enter a symbol');
      return;
    }

    setAnalyzingNews(true);
    setNewsSentiment(null);

    try {
      const parsed = await callGeminiAPIForJSON(`Analyze recent news and market sentiment for ${newsSymbol.toUpperCase()}.

Return ONLY valid JSON (no extra text):
{
  "overallSentiment": "positive",
  "sentimentScore": 7.5,
  "confidence": 80,
  "priceImpact": "bullish",
  "keyNews": [
    {
      "headline": "Recent development or news",
      "sentiment": "positive",
      "impact": "high",
      "summary": "Brief explanation"
    }
  ],
  "topicsDiscussed": ["Regulation", "Adoption", "Technology"],
  "marketMood": "Brief description of overall mood",
  "recommendation": "Action with explanation",
  "risks": ["Risk factor 1", "Risk factor 2"],
  "catalysts": ["Positive factor 1", "Positive factor 2"]
}

Use: overallSentiment (positive/negative/neutral/mixed), priceImpact (bullish/bearish/neutral), sentimentScore (0-10)`);
      setNewsSentiment(parsed);
    } catch (error) {
      console.error('News analysis error:', error);
      setNewsSentiment({
        overallSentiment: "neutral",
        sentimentScore: 5,
        confidence: 0,
        priceImpact: "neutral",
        keyNews: [{
          headline: "Unable to fetch news data",
          sentiment: "neutral",
          impact: "low",
          summary: "Analysis failed. Please try again."
        }],
        topicsDiscussed: ["Analysis failed"],
        marketMood: "Unable to analyze current sentiment",
        recommendation: "Unable to provide recommendation due to analysis error. Please try again.",
        risks: ["Could not fetch news data"],
        catalysts: []
      });
    }

    setAnalyzingNews(false);
  };

  const calculateRisk = () => {
    if (!riskCalc.accountSize || parseFloat(riskCalc.accountSize) <= 0) {
      alert('Please enter a valid account size');
      return;
    }
    if (!riskCalc.entryPrice || parseFloat(riskCalc.entryPrice) <= 0) {
      alert('Please enter a valid entry price');
      return;
    }
    if (!riskCalc.stopLoss || parseFloat(riskCalc.stopLoss) <= 0) {
      alert('Please enter a valid stop loss');
      return;
    }

    const accountSize = parseFloat(riskCalc.accountSize);
    const riskPercent = parseFloat(riskCalc.riskPercent);
    const entryPrice = parseFloat(riskCalc.entryPrice);
    const stopLoss = parseFloat(riskCalc.stopLoss);
    const targetPrice = riskCalc.targetPrice ? parseFloat(riskCalc.targetPrice) : null;

    // Calculate risk amount in dollars
    const riskAmount = accountSize * (riskPercent / 100);

    // Calculate price difference per share
    const riskPerShare = Math.abs(entryPrice - stopLoss);

    // Calculate position size (shares/coins)
    const positionSize = riskAmount / riskPerShare;

    // Calculate total position value
    const positionValue = positionSize * entryPrice;

    // Calculate stop loss percentage
    const stopLossPercent = (riskPerShare / entryPrice) * 100;

    // Calculate potential profit if target is provided
    let potentialProfit = null;
    let profitPercent = null;
    let riskRewardRatio = null;

    if (targetPrice) {
      const profitPerShare = Math.abs(targetPrice - entryPrice);
      potentialProfit = profitPerShare * positionSize;
      profitPercent = (profitPerShare / entryPrice) * 100;
      riskRewardRatio = profitPerShare / riskPerShare;
    }

    setRiskResults({
      accountSize,
      riskPercent,
      riskAmount,
      entryPrice,
      stopLoss,
      targetPrice,
      positionSize,
      positionValue,
      riskPerShare,
      stopLossPercent,
      potentialProfit,
      profitPercent,
      riskRewardRatio
    });
  };

  const askQuestion = async () => {
    if (!userQuestion.trim()) return;

    const newHistory = [...conversationHistory, { role: 'user', content: userQuestion }];
    setConversationHistory(newHistory);
    setUserQuestion('');

    try {
      const contextInfo = comparison 
        ? `Current comparison: ${comparison.assets.map(a => a.symbol).join(', ')} with ${comparison.topPick.symbol} as top pick`
        : analysis 
        ? `Analyzing ${symbol} - ${analysis.sentiment} sentiment, ${analysis.riskLevel} risk`
        : 'No current analysis';

      // Use Gemini API helper for consistent API key usage and error handling
      const prompt = `You are an expert trading mentor and cryptocurrency investment advisor. Answer questions with:
- Clear, actionable advice
- Risk warnings when appropriate
- Educational insights
- Real-world context

Context: ${contextInfo}

User question: ${userQuestion}`;

      // Import callGeminiAPI from geminiAPI.js
      const aiResponse = await callGeminiAPI(prompt);

      setConversationHistory([...newHistory, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error("Question error:", error);
      setConversationHistory([...newHistory, { 
        role: 'assistant', 
        content: "I encountered an error processing your question. Please try again." 
      }]);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch(sentiment?.toLowerCase()) {
      case 'bullish': return 'text-green-600 bg-green-50';
      case 'bearish': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getRiskColor = (risk) => {
    switch(risk?.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleCompareSymbolChange = (index, value) => {
    const newSymbols = [...compareSymbols];
    newSymbols[index] = value.toUpperCase();
    setCompareSymbols(newSymbols);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">AI Trading & Investment Advisor</h1>
          </div>
          <p className="text-blue-200">Your complete trading analysis and portfolio management suite</p>
        </div>

        {/* Hamburger Menu Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-lg transition-all flex items-center gap-3"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            <span>
              {activeTab === 'single' && 'Single Analysis'}
              {activeTab === 'compare' && 'Compare Investments'}
              {activeTab === 'chart' && 'Chart Analysis'}
              {activeTab === 'alerts' && 'Price Alerts'}
              {activeTab === 'portfolio' && 'Portfolio Tracker'}
              {activeTab === 'news' && 'News Sentiment'}
              {activeTab === 'risk' && 'Risk Calculator'}
            </span>
            {activeTab === 'alerts' && alerts.filter(a => a.triggered && a.status === 'triggered').length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {alerts.filter(a => a.triggered && a.status === 'triggered').length}
              </span>
            )}
            {activeTab === 'portfolio' && portfolioStats && (
              <span className={`text-sm font-bold ${portfolioStats.totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioStats.totalPL >= 0 ? '+' : ''}{portfolioStats.totalPLPercent.toFixed(1)}%
              </span>
            )}
          </button>
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="max-w-md mx-auto mb-6 bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="divide-y divide-gray-200">
              <button
                onClick={() => { setActiveTab('single'); setMenuOpen(false); }}
                className={`w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 ${
                  activeTab === 'single' ? 'bg-blue-100 border-l-4 border-blue-600' : ''
                }`}
              >
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-bold text-gray-900">Single Analysis</p>
                  <p className="text-xs text-gray-600">Analyze individual assets</p>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('compare'); setMenuOpen(false); }}
                className={`w-full px-6 py-4 text-left hover:bg-green-50 transition-colors flex items-center gap-3 ${
                  activeTab === 'compare' ? 'bg-green-100 border-l-4 border-green-600' : ''
                }`}
              >
                <GitCompare className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-bold text-gray-900">Compare Investments</p>
                  <p className="text-xs text-gray-600">Compare multiple assets side-by-side</p>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('chart'); setMenuOpen(false); }}
                className={`w-full px-6 py-4 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 ${
                  activeTab === 'chart' ? 'bg-purple-100 border-l-4 border-purple-600' : ''
                }`}
              >
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-bold text-gray-900">Chart Analysis</p>
                  <p className="text-xs text-gray-600">Upload charts for AI prediction</p>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('alerts'); setMenuOpen(false); }}
                className={`w-full px-6 py-4 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 ${
                  activeTab === 'alerts' ? 'bg-orange-100 border-l-4 border-orange-600' : ''
                }`}
              >
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Price Alerts</p>
                  <p className="text-xs text-gray-600">Set custom price notifications</p>
                </div>
                {alerts.filter(a => a.triggered && a.status === 'triggered').length > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {alerts.filter(a => a.triggered && a.status === 'triggered').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => { setActiveTab('portfolio'); setMenuOpen(false); }}
                className={`w-full px-6 py-4 text-left hover:bg-indigo-50 transition-colors flex items-center gap-3 ${
                  activeTab === 'portfolio' ? 'bg-indigo-100 border-l-4 border-indigo-600' : ''
                }`}
              >
                <Activity className="w-5 h-5 text-indigo-600" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Portfolio Tracker</p>
                  <p className="text-xs text-gray-600">Track all your investments</p>
                </div>
                {portfolioStats && (
                  <span className={`text-sm font-bold ${portfolioStats.totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {portfolioStats.totalPL >= 0 ? '+' : ''}{portfolioStats.totalPLPercent.toFixed(1)}%
                  </span>
                )}
              </button>

              <button
                onClick={() => { setActiveTab('news'); setMenuOpen(false); }}
                className={`w-full px-6 py-4 text-left hover:bg-cyan-50 transition-colors flex items-center gap-3 ${
                  activeTab === 'news' ? 'bg-cyan-100 border-l-4 border-cyan-600' : ''
                }`}
              >
                <Newspaper className="w-5 h-5 text-cyan-600" />
                <div>
                  <p className="font-bold text-gray-900">News Sentiment</p>
                  <p className="text-xs text-gray-600">Analyze market news & sentiment</p>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('risk'); setMenuOpen(false); }}
                className={`w-full px-6 py-4 text-left hover:bg-pink-50 transition-colors flex items-center gap-3 ${
                  activeTab === 'risk' ? 'bg-pink-100 border-l-4 border-pink-600' : ''
                }`}
              >
                <Calculator className="w-5 h-5 text-pink-600" />
                <div>
                  <p className="font-bold text-gray-900">Risk Calculator</p>
                  <p className="text-xs text-gray-600">Position sizing & risk management</p>
                </div>
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Analysis Panel */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-2xl p-6">
            {activeTab === 'single' ? (
              /* Single Asset Analysis */
              <>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Market Analysis</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Asset Symbol
                    </label>
                    <input
                      type="text"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                      placeholder="e.g., BTC, ETH, SOL, AAPL"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg font-mono"
                      onKeyPress={(e) => e.key === 'Enter' && analyzeMarket()}
                    />
                  </div>

                  <button
                    onClick={analyzeMarket}
                    disabled={analyzing || !symbol.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {analyzing ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Activity className="w-5 h-5" />
                        Analyze Market
                      </>
                    )}
                  </button>

                  {analysis && (
                    <div className="mt-6 space-y-4">
                      {/* Should Trade Decision */}
                      <div className={`p-4 rounded-lg border-2 ${
                        analysis.shouldTrade === 'YES' 
                          ? 'bg-green-50 border-green-500' 
                          : 'bg-red-50 border-red-500'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg">Investment Decision</h3>
                          {analysis.shouldTrade === 'YES' ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                        <p className="text-2xl font-bold">
                          {analysis.shouldTrade} - {analysis.confidence}% Confidence
                        </p>
                      </div>

                      {/* Sentiment & Risk */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className={`p-3 rounded-lg ${getSentimentColor(analysis.sentiment)}`}>
                          <p className="text-xs font-semibold mb-1">SENTIMENT</p>
                          <p className="text-lg font-bold capitalize">{analysis.sentiment}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${getRiskColor(analysis.riskLevel)}`}>
                          <p className="text-xs font-semibold mb-1">RISK LEVEL</p>
                          <p className="text-lg font-bold capitalize">{analysis.riskLevel}</p>
                        </div>
                      </div>

                      {/* Technical Indicators */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2 text-blue-900">Technical Indicators</h4>
                        <ul className="space-y-1">
                          {analysis.technicalIndicators.map((indicator, i) => (
                            <li key={i} className="text-sm text-blue-800">• {indicator}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Entry Strategy */}
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2 text-purple-900">Entry Strategy</h4>
                        <p className="text-sm text-purple-800">{analysis.entryStrategy}</p>
                      </div>

                      {/* Stop Loss */}
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2 text-orange-900">Stop Loss</h4>
                        <p className="text-sm text-orange-800">{analysis.stopLoss}</p>
                      </div>

                      {/* Warnings */}
                      {analysis.warnings.length > 0 && (
                        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-bold mb-2 text-red-900">Warnings</h4>
                              <ul className="space-y-1">
                                {analysis.warnings.map((warning, i) => (
                                  <li key={i} className="text-sm text-red-800">• {warning}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Reasoning */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2 text-gray-900">Analysis Reasoning</h4>
                        <p className="text-sm text-gray-700">{analysis.reasoning}</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : activeTab === 'chart' ? (
              /* Chart Analysis */
              <>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Chart Analysis</h2>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleChartUpload}
                      className="hidden"
                      id="chart-upload"
                    />
                    <label
                      htmlFor="chart-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      {chartImagePreview ? (
                        <img
                          src={chartImagePreview}
                          alt="Chart preview"
                          className="max-h-64 rounded-lg mb-4"
                        />
                      ) : (
                        <>
                          <BarChart3 className="w-16 h-16 text-gray-400 mb-4" />
                          <p className="text-lg font-semibold text-gray-700 mb-2">
                            Upload Trading Chart
                          </p>
                          <p className="text-sm text-gray-500">
                            Click to select or drag & drop
                          </p>
                        </>
                      )}
                    </label>
                    {chartImagePreview && (
                      <button
                        onClick={() => {
                          setChartImage(null);
                          setChartImagePreview(null);
                          setChartAnalysis(null);
                        }}
                        className="mt-4 text-sm text-red-600 hover:text-red-700"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>

                  <button
                    onClick={analyzeChart}
                    disabled={analyzingChart || !chartImage}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {analyzingChart ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        Analyzing Chart...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-5 h-5" />
                        Analyze Chart
                      </>
                    )}
                  </button>

                  {chartAnalysis && (
                    <div className="mt-6 space-y-4">
                      {/* Prediction */}
                      <div className={`p-6 rounded-lg border-2 ${
                        chartAnalysis.direction === 'UP'
                          ? 'bg-green-50 border-green-500'
                          : chartAnalysis.direction === 'DOWN'
                          ? 'bg-red-50 border-red-500'
                          : 'bg-yellow-50 border-yellow-500'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-2xl">Price Direction</h3>
                          {chartAnalysis.direction === 'UP' ? (
                            <TrendingUp className="w-8 h-8 text-green-600" />
                          ) : chartAnalysis.direction === 'DOWN' ? (
                            <TrendingDown className="w-8 h-8 text-red-600" />
                          ) : (
                            <Activity className="w-8 h-8 text-yellow-600" />
                          )}
                        </div>
                        <p className="text-3xl font-bold mb-2">
                          {chartAnalysis.direction}
                        </p>
                        <p className="text-lg font-semibold">
                          Confidence: {chartAnalysis.confidence}%
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                          <div
                            className={`h-3 rounded-full ${
                              chartAnalysis.direction === 'UP'
                                ? 'bg-green-600'
                                : chartAnalysis.direction === 'DOWN'
                                ? 'bg-red-600'
                                : 'bg-yellow-600'
                            }`}
                            style={{ width: `${chartAnalysis.confidence}%` }}
                          />
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2 text-blue-900">Recommendation</h4>
                        <p className="text-lg font-bold text-blue-800 mb-2">
                          {chartAnalysis.recommendation.split(' ')[0]}
                        </p>
                        <p className="text-sm text-blue-700">{chartAnalysis.recommendation}</p>
                      </div>

                      {/* Key Patterns */}
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2 text-purple-900">Key Patterns Detected</h4>
                        <ul className="space-y-1">
                          {chartAnalysis.keyPatterns.map((pattern, i) => (
                            <li key={i} className="text-sm text-purple-800">• {pattern}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Technical Indicators */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-3 text-gray-900">Technical Indicators</h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center">
                            <p className="text-xs text-gray-600 mb-1">Trend</p>
                            <p className="font-bold capitalize">{chartAnalysis.indicators.trend}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600 mb-1">Momentum</p>
                            <p className="font-bold capitalize">{chartAnalysis.indicators.momentum}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600 mb-1">Volume</p>
                            <p className="font-bold capitalize">{chartAnalysis.indicators.volume}</p>
                          </div>
                        </div>
                      </div>

                      {/* Support & Resistance */}
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-bold mb-2 text-green-900">Support Levels</h4>
                          <ul className="space-y-1">
                            {chartAnalysis.supportLevels.map((level, i) => (
                              <li key={i} className="text-sm text-green-800">• {level}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-bold mb-2 text-red-900">Resistance Levels</h4>
                          <ul className="space-y-1">
                            {chartAnalysis.resistanceLevels.map((level, i) => (
                              <li key={i} className="text-sm text-red-800">• {level}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Predictions */}
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-3 text-indigo-900">Price Predictions</h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-semibold text-indigo-700 mb-1">Short Term</p>
                            <p className="text-sm text-indigo-800">{chartAnalysis.prediction.shortTerm}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-indigo-700 mb-1">Medium Term</p>
                            <p className="text-sm text-indigo-800">{chartAnalysis.prediction.mediumTerm}</p>
                          </div>
                          {chartAnalysis.prediction.targets.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-indigo-700 mb-1">Price Targets</p>
                              <ul className="space-y-1">
                                {chartAnalysis.prediction.targets.map((target, i) => (
                                  <li key={i} className="text-sm text-indigo-800">• {target}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Risk Factors */}
                      {chartAnalysis.riskFactors.length > 0 && (
                        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-bold mb-2 text-red-900">Risk Factors</h4>
                              <ul className="space-y-1">
                                {chartAnalysis.riskFactors.map((risk, i) => (
                                  <li key={i} className="text-sm text-red-800">• {risk}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Reasoning */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2 text-gray-900">Analysis Reasoning</h4>
                        <p className="text-sm text-gray-700">{chartAnalysis.reasoning}</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : activeTab === 'alerts' ? (
              /* Price Alerts */
              <>
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Price Alerts</h2>
                </div>

                <div className="space-y-4">
                  {/* Create New Alert */}
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border-2 border-orange-200">
                    <h3 className="font-bold text-lg mb-3 text-orange-900">Create New Alert</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Symbol
                        </label>
                        <input
                          type="text"
                          value={newAlert.symbol}
                          onChange={(e) => setNewAlert({...newAlert, symbol: e.target.value.toUpperCase()})}
                          placeholder="e.g., BTC, ETH, AAPL"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Alert Condition
                        </label>
                        <select
                          value={newAlert.condition}
                          onChange={(e) => setNewAlert({...newAlert, condition: e.target.value})}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                        >
                          <option value="above">Price goes above</option>
                          <option value="below">Price goes below</option>
                          <option value="change_up">Increases by %</option>
                          <option value="change_down">Decreases by %</option>
                        </select>
                      </div>

                      {(newAlert.condition === 'above' || newAlert.condition === 'below') ? (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Target Price ($)
                          </label>
                          <input
                            type="number"
                            value={newAlert.price}
                            onChange={(e) => setNewAlert({...newAlert, price: e.target.value})}
                            placeholder="e.g., 50000"
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                            step="0.01"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Percentage Change (%)
                          </label>
                          <input
                            type="number"
                            value={newAlert.percentage}
                            onChange={(e) => setNewAlert({...newAlert, percentage: e.target.value})}
                            placeholder="e.g., 5, 10, 20"
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                            step="0.1"
                          />
                        </div>
                      )}

                      <button
                        onClick={addAlert}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <AlertCircle className="w-5 h-5" />
                        Create Alert
                      </button>
                    </div>
                  </div>

                  {/* Check All Alerts Button */}
                  {alerts.length > 0 && (
                    <button
                      onClick={checkAlerts}
                      disabled={checkingAlerts}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {checkingAlerts ? (
                        <>
                          <Clock className="w-5 h-5 animate-spin" />
                          Checking Prices...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Check All Alerts Now
                        </>
                      )}
                    </button>
                  )}

                  {/* Active Alerts List */}
                  <div>
                    <h3 className="font-bold text-lg mb-3 text-gray-800">
                      Your Alerts ({alerts.length})
                    </h3>

                    {alerts.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-semibold mb-2">No alerts yet</p>
                        <p className="text-sm text-gray-400">Create your first alert above</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {alerts.map((alert) => (
                          <div
                            key={alert.id}
                            className={`p-4 rounded-lg border-2 ${
                              alert.triggered && alert.status === 'triggered'
                                ? 'bg-red-50 border-red-500'
                                : 'bg-white border-gray-200'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xl font-bold text-gray-900">
                                    {alert.symbol}
                                  </span>
                                  {alert.triggered && alert.status === 'triggered' && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                      TRIGGERED
                                    </span>
                                  )}
                                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                                    {alert.status}
                                  </span>
                                </div>

                                <div className="text-sm text-gray-700 mb-1">
                                  {alert.condition === 'above' && `Alert when price goes above $${alert.price}`}
                                  {alert.condition === 'below' && `Alert when price goes below $${alert.price}`}
                                  {alert.condition === 'change_up' && `Alert when price increases by ${alert.percentage}%`}
                                  {alert.condition === 'change_down' && `Alert when price decreases by ${alert.percentage}%`}
                                </div>

                                {alert.triggered && alert.triggeredPrice && (
                                  <div className="text-sm font-semibold text-red-600">
                                    Triggered at ${alert.triggeredPrice} on {new Date(alert.triggeredAt).toLocaleString()}
                                  </div>
                                )}

                                <div className="text-xs text-gray-500 mt-2">
                                  Created: {new Date(alert.createdAt).toLocaleString()}
                                </div>
                              </div>

                              <button
                                onClick={() => deleteAlert(alert.id)}
                                className="text-red-600 hover:text-red-700 font-semibold text-sm ml-4"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Alert Info */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-2 text-blue-900 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      How Alerts Work
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Alerts are saved and persist across sessions</li>
                      <li>• Click "Check All Alerts Now" to see if any have triggered</li>
                      <li>• Triggered alerts will show with a red banner</li>
                      <li>• You can create multiple alerts for the same symbol</li>
                      <li>• Delete alerts you no longer need</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : activeTab === 'portfolio' ? (
              /* Portfolio Tracker */
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Portfolio Tracker</h2>
                </div>

                <div className="space-y-4">
                  {/* Portfolio Summary */}
                  {portfolioStats && (
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4 opacity-90">Total Portfolio Value</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm opacity-80 mb-1">Invested</p>
                          <p className="text-2xl font-bold">${portfolioStats.totalInvested.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm opacity-80 mb-1">Current Value</p>
                          <p className="text-2xl font-bold">${portfolioStats.totalCurrent.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm opacity-80 mb-1">Profit/Loss</p>
                          <p className={`text-2xl font-bold ${portfolioStats.totalPL >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                            {portfolioStats.totalPL >= 0 ? '+' : ''}${portfolioStats.totalPL.toFixed(2)}
                          </p>
                          <p className={`text-lg font-semibold ${portfolioStats.totalPL >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                            ({portfolioStats.totalPL >= 0 ? '+' : ''}{portfolioStats.totalPLPercent.toFixed(2)}%)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add New Holding */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border-2 border-indigo-200">
                    <h3 className="font-bold text-lg mb-3 text-indigo-900">Add New Holding</h3>
                    
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Symbol
                        </label>
                        <input
                          type="text"
                          value={newHolding.symbol}
                          onChange={(e) => setNewHolding({...newHolding, symbol: e.target.value.toUpperCase()})}
                          placeholder="BTC, ETH, AAPL"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          value={newHolding.quantity}
                          onChange={(e) => setNewHolding({...newHolding, quantity: e.target.value})}
                          placeholder="1.5"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                          step="0.00000001"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Buy Price ($)
                        </label>
                        <input
                          type="number"
                          value={newHolding.buyPrice}
                          onChange={(e) => setNewHolding({...newHolding, buyPrice: e.target.value})}
                          placeholder="45000"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Buy Date
                        </label>
                        <input
                          type="date"
                          value={newHolding.buyDate}
                          onChange={(e) => setNewHolding({...newHolding, buyDate: e.target.value})}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={addHolding}
                      className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Activity className="w-5 h-5" />
                      Add to Portfolio
                    </button>
                  </div>

                  {/* Update Prices Button */}
                  {portfolio.length > 0 && (
                    <button
                      onClick={updatePortfolioPrices}
                      disabled={updatingPortfolio}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {updatingPortfolio ? (
                        <>
                          <Clock className="w-5 h-5 animate-spin" />
                          Updating Prices...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-5 h-5" />
                          Update All Prices
                        </>
                      )}
                    </button>
                  )}

                  {/* Holdings List */}
                  <div>
                    <h3 className="font-bold text-lg mb-3 text-gray-800">
                      Your Holdings ({portfolio.length})
                    </h3>

                    {portfolio.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-semibold mb-2">No holdings yet</p>
                        <p className="text-sm text-gray-400">Add your first investment above</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {portfolio.map((holding) => {
                          const invested = holding.quantity * holding.buyPrice;
                          const current = holding.quantity * holding.currentPrice;
                          const pl = current - invested;
                          const plPercent = (pl / invested) * 100;

                          return (
                            <div
                              key={holding.id}
                              className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                                    {holding.symbol}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {holding.quantity} shares @ ${holding.buyPrice.toFixed(2)}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Bought: {new Date(holding.buyDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <button
                                  onClick={() => deleteHolding(holding.id)}
                                  className="text-red-600 hover:text-red-700 font-semibold text-sm"
                                >
                                  Delete
                                </button>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                <div className="bg-gray-50 p-2 rounded">
                                  <p className="text-xs text-gray-600 mb-1">Invested</p>
                                  <p className="font-bold text-gray-900">${invested.toFixed(2)}</p>
                                </div>
                                <div className="bg-gray-50 p-2 rounded">
                                  <p className="text-xs text-gray-600 mb-1">Current Price</p>
                                  <p className="font-bold text-gray-900">${holding.currentPrice.toFixed(2)}</p>
                                </div>
                                <div className="bg-gray-50 p-2 rounded">
                                  <p className="text-xs text-gray-600 mb-1">Current Value</p>
                                  <p className="font-bold text-gray-900">${current.toFixed(2)}</p>
                                </div>
                                <div className={`p-2 rounded ${pl >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                                  <p className="text-xs text-gray-600 mb-1">Profit/Loss</p>
                                  <p className={`font-bold ${pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {pl >= 0 ? '+' : ''}${pl.toFixed(2)}
                                  </p>
                                  <p className={`text-xs font-semibold ${pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ({pl >= 0 ? '+' : ''}{plPercent.toFixed(2)}%)
                                  </p>
                                </div>
                              </div>

                              {holding.lastUpdated && (
                                <p className="text-xs text-gray-500">
                                  Last updated: {new Date(holding.lastUpdated).toLocaleString()}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Individual Performance */}
                  {portfolioStats && portfolioStats.holdings.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold mb-3 text-blue-900">Performance Breakdown</h4>
                      <div className="space-y-2">
                        {portfolioStats.holdings.map((h, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-gray-900">{h.symbol}</span>
                                <span className={`text-sm font-semibold ${h.pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {h.pl >= 0 ? '+' : ''}{h.plPercent.toFixed(2)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${h.pl >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                  style={{ width: `${Math.min(Math.abs(h.plPercent), 100)}%` }}
                                />
                              </div>
                            </div>
                            <span className={`ml-4 font-bold ${h.pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {h.pl >= 0 ? '+' : ''}${h.pl.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Portfolio Info */}
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-2 text-indigo-900 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      How Portfolio Tracker Works
                    </h4>
                    <ul className="text-sm text-indigo-800 space-y-1">
                      <li>• Add your investments with quantity and buy price</li>
                      <li>• Click "Update All Prices" to get current market values</li>
                      <li>• See real-time profit/loss for each holding</li>
                      <li>• Track overall portfolio performance</li>
                      <li>• Your portfolio is saved automatically</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : activeTab === 'news' ? (
              /* News Sentiment Analysis */
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Newspaper className="w-6 h-6 text-cyan-600" />
                  <h2 className="text-2xl font-bold text-gray-800">News Sentiment Analysis</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Asset Symbol
                    </label>
                    <input
                      type="text"
                      value={newsSymbol}
                      onChange={(e) => setNewsSymbol(e.target.value.toUpperCase())}
                      placeholder="e.g., BTC, TSLA, AAPL"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none text-lg font-mono"
                      onKeyPress={(e) => e.key === 'Enter' && analyzeNewsSentiment()}
                    />
                  </div>

                  <button
                    onClick={analyzeNewsSentiment}
                    disabled={analyzingNews || !newsSymbol.trim()}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {analyzingNews ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        Analyzing News...
                      </>
                    ) : (
                      <>
                        <Newspaper className="w-5 h-5" />
                        Analyze News Sentiment
                      </>
                    )}
                  </button>

                  {newsSentiment && (
                    <div className="mt-6 space-y-4">
                      {/* Overall Sentiment */}
                      <div className={`p-6 rounded-lg border-2 ${
                        newsSentiment.overallSentiment === 'positive'
                          ? 'bg-green-50 border-green-500'
                          : newsSentiment.overallSentiment === 'negative'
                          ? 'bg-red-50 border-red-500'
                          : newsSentiment.overallSentiment === 'mixed'
                          ? 'bg-orange-50 border-orange-500'
                          : 'bg-gray-50 border-gray-500'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-2xl">Overall Sentiment</h3>
                          {newsSentiment.overallSentiment === 'positive' ? (
                            <TrendingUp className="w-8 h-8 text-green-600" />
                          ) : newsSentiment.overallSentiment === 'negative' ? (
                            <TrendingDown className="w-8 h-8 text-red-600" />
                          ) : (
                            <Activity className="w-8 h-8 text-orange-600" />
                          )}
                        </div>
                        <p className="text-3xl font-bold capitalize mb-2">
                          {newsSentiment.overallSentiment}
                        </p>
                        <p className="text-lg font-semibold mb-3">
                          Score: {newsSentiment.sentimentScore}/10 • Confidence: {newsSentiment.confidence}%
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              newsSentiment.sentimentScore >= 7 ? 'bg-green-600' :
                              newsSentiment.sentimentScore >= 4 ? 'bg-yellow-600' :
                              'bg-red-600'
                            }`}
                            style={{ width: `${newsSentiment.sentimentScore * 10}%` }}
                          />
                        </div>
                      </div>

                      {/* Price Impact & Market Mood */}
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className={`p-4 rounded-lg ${
                          newsSentiment.priceImpact === 'bullish' ? 'bg-green-50' :
                          newsSentiment.priceImpact === 'bearish' ? 'bg-red-50' :
                          'bg-gray-50'
                        }`}>
                          <p className="text-xs font-semibold mb-1 text-gray-600">PRICE IMPACT</p>
                          <p className="text-xl font-bold capitalize">{newsSentiment.priceImpact}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-xs font-semibold mb-1 text-gray-600">MARKET MOOD</p>
                          <p className="text-lg font-bold">{newsSentiment.marketMood}</p>
                        </div>
                      </div>

                      {/* Key News */}
                      {newsSentiment.keyNews && newsSentiment.keyNews.length > 0 && (
                        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                          <h4 className="font-bold mb-3 text-gray-900 flex items-center gap-2">
                            <Newspaper className="w-5 h-5" />
                            Key News Headlines
                          </h4>
                          <div className="space-y-3">
                            {newsSentiment.keyNews.map((news, i) => (
                              <div key={i} className={`p-3 rounded-lg border-l-4 ${
                                news.sentiment === 'positive' ? 'bg-green-50 border-green-500' :
                                news.sentiment === 'negative' ? 'bg-red-50 border-red-500' :
                                'bg-gray-50 border-gray-500'
                              }`}>
                                <div className="flex items-start justify-between mb-2">
                                  <h5 className="font-bold text-sm text-gray-900 flex-1">{news.headline}</h5>
                                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                                    news.impact === 'high' ? 'bg-red-200 text-red-800' :
                                    news.impact === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                    'bg-gray-200 text-gray-800'
                                  }`}>
                                    {news.impact} impact
                                  </span>
                                </div>
                                <p className="text-xs text-gray-700">{news.summary}</p>
                                <p className={`text-xs font-semibold mt-2 capitalize ${
                                  news.sentiment === 'positive' ? 'text-green-700' :
                                  news.sentiment === 'negative' ? 'text-red-700' :
                                  'text-gray-700'
                                }`}>
                                  Sentiment: {news.sentiment}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Topics Discussed */}
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2 text-purple-900">Topics Being Discussed</h4>
                        <div className="flex flex-wrap gap-2">
                          {newsSentiment.topicsDiscussed.map((topic, i) => (
                            <span key={i} className="bg-purple-200 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Catalysts */}
                      {newsSentiment.catalysts && newsSentiment.catalysts.length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-bold mb-2 text-blue-900">Positive Catalysts</h4>
                          <ul className="space-y-1">
                            {newsSentiment.catalysts.map((catalyst, i) => (
                              <li key={i} className="text-sm text-blue-800">✓ {catalyst}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Risks */}
                      {newsSentiment.risks && newsSentiment.risks.length > 0 && (
                        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-bold mb-2 text-red-900">Risk Factors</h4>
                              <ul className="space-y-1">
                                {newsSentiment.risks.map((risk, i) => (
                                  <li key={i} className="text-sm text-red-800">• {risk}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Recommendation */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border-2 border-indigo-300">
                        <h4 className="font-bold mb-2 text-indigo-900">AI Recommendation</h4>
                        <p className="text-lg font-bold text-indigo-800 mb-2">
                          {newsSentiment.recommendation.split(' ')[0]}
                        </p>
                        <p className="text-sm text-indigo-700">{newsSentiment.recommendation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : activeTab === 'risk' ? (
              /* Risk Calculator */
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-6 h-6 text-pink-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Risk Calculator</h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-lg border-2 border-pink-200">
                    <h3 className="font-bold text-lg mb-3 text-pink-900">Position Size Calculator</h3>
                    
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Account Size ($)
                        </label>
                        <input
                          type="number"
                          value={riskCalc.accountSize}
                          onChange={(e) => setRiskCalc({...riskCalc, accountSize: e.target.value})}
                          placeholder="10000"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                          step="100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Risk Per Trade (%)
                        </label>
                        <input
                          type="number"
                          value={riskCalc.riskPercent}
                          onChange={(e) => setRiskCalc({...riskCalc, riskPercent: e.target.value})}
                          placeholder="2"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                          step="0.5"
                          min="0.1"
                          max="10"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Entry Price ($)
                        </label>
                        <input
                          type="number"
                          value={riskCalc.entryPrice}
                          onChange={(e) => setRiskCalc({...riskCalc, entryPrice: e.target.value})}
                          placeholder="45000"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Stop Loss ($)
                        </label>
                        <input
                          type="number"
                          value={riskCalc.stopLoss}
                          onChange={(e) => setRiskCalc({...riskCalc, stopLoss: e.target.value})}
                          placeholder="43000"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                          step="0.01"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Target Price ($) <span className="text-gray-500">(Optional)</span>
                        </label>
                        <input
                          type="number"
                          value={riskCalc.targetPrice}
                          onChange={(e) => setRiskCalc({...riskCalc, targetPrice: e.target.value})}
                          placeholder="50000"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <button
                      onClick={calculateRisk}
                      className="w-full mt-3 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Calculator className="w-5 h-5" />
                      Calculate Position Size
                    </button>
                  </div>

                  {riskResults && (
                    <div className="mt-6 space-y-4">
                      {/* Position Size */}
                      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 opacity-90">Position Size</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm opacity-80 mb-1">Shares/Coins to Buy</p>
                            <p className="text-3xl font-bold">{riskResults.positionSize.toFixed(8)}</p>
                          </div>
                          <div>
                            <p className="text-sm opacity-80 mb-1">Total Position Value</p>
                            <p className="text-3xl font-bold">${riskResults.positionValue.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Risk Details */}
                      <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                        <h4 className="font-bold mb-3 text-gray-900">Risk Details</h4>
                        <div className="grid md:grid-cols-3 gap-3">
                          <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Maximum Risk</p>
                            <p className="text-xl font-bold text-red-600">${riskResults.riskAmount.toFixed(2)}</p>
                            <p className="text-sm text-red-700">{riskResults.riskPercent}% of account</p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Risk Per Share</p>
                            <p className="text-xl font-bold text-orange-600">${riskResults.riskPerShare.toFixed(2)}</p>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Stop Loss %</p>
                            <p className="text-xl font-bold text-yellow-600">{riskResults.stopLossPercent.toFixed(2)}%</p>
                          </div>
                        </div>
                      </div>

                      {/* Entry & Exit Levels */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-3 text-blue-900">Entry & Exit Levels</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-700">Entry Price:</span>
                            <span className="font-bold text-blue-900">${riskResults.entryPrice.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-red-700">Stop Loss:</span>
                            <span className="font-bold text-red-600">${riskResults.stopLoss.toFixed(2)}</span>
                          </div>
                          {riskResults.targetPrice && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-green-700">Target Price:</span>
                              <span className="font-bold text-green-600">${riskResults.targetPrice.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Profit Potential */}
                      {riskResults.potentialProfit && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-300">
                          <h4 className="font-bold mb-3 text-green-900">Profit Potential</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-green-700 mb-1">Potential Profit</p>
                              <p className="text-2xl font-bold text-green-600">${riskResults.potentialProfit.toFixed(2)}</p>
                              <p className="text-sm text-green-700">+{riskResults.profitPercent.toFixed(2)}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-green-700 mb-1">Risk/Reward Ratio</p>
                              <p className="text-2xl font-bold text-green-600">1:{riskResults.riskRewardRatio.toFixed(2)}</p>
                              <p className={`text-sm font-semibold ${
                                riskResults.riskRewardRatio >= 2 ? 'text-green-600' :
                                riskResults.riskRewardRatio >= 1.5 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {riskResults.riskRewardRatio >= 2 ? '✓ Good ratio' :
                                 riskResults.riskRewardRatio >= 1.5 ? '⚠ Acceptable' :
                                 '✗ Poor ratio'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Trade Summary */}
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-3 text-indigo-900 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Trade Summary
                        </h4>
                        <div className="text-sm text-indigo-800 space-y-1">
                          <p>• Buy {riskResults.positionSize.toFixed(8)} shares/coins at ${riskResults.entryPrice.toFixed(2)}</p>
                          <p>• Set stop loss at ${riskResults.stopLoss.toFixed(2)} ({riskResults.stopLossPercent.toFixed(2)}% below entry)</p>
                          {riskResults.targetPrice && (
                            <p>• Target price at ${riskResults.targetPrice.toFixed(2)} ({riskResults.profitPercent.toFixed(2)}% profit)</p>
                          )}
                          <p>• Maximum loss: ${riskResults.riskAmount.toFixed(2)} ({riskResults.riskPercent}% of account)</p>
                          {riskResults.potentialProfit && (
                            <p>• Potential profit: ${riskResults.potentialProfit.toFixed(2)}</p>
                          )}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                        <h4 className="font-bold mb-2 text-yellow-900">Risk Management Tips</h4>
                        <ul className="text-sm text-yellow-800 space-y-1">
                          <li>• Never risk more than 1-2% of your account per trade</li>
                          <li>• Always use stop losses to limit downside</li>
                          <li>• Aim for risk/reward ratio of at least 1:2 or better</li>
                          <li>• Position size should match your risk tolerance</li>
                          <li>• Adjust position size based on volatility</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Compare Multiple Assets */
              <>
                <div className="flex items-center gap-2 mb-4">
                  <GitCompare className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Compare Investments</h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    {compareSymbols.map((sym, index) => (
                      <div key={index}>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Asset {index + 1} {index >= 2 && <span className="text-gray-400">(Optional)</span>}
                        </label>
                        <input
                          type="text"
                          value={sym}
                          onChange={(e) => handleCompareSymbolChange(index, e.target.value)}
                          placeholder={`e.g., ${['BTC', 'ETH', 'SOL'][index]}`}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-lg font-mono"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={compareAssets}
                    disabled={comparing || compareSymbols.filter(s => s.trim()).length < 2}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {comparing ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        Comparing...
                      </>
                    ) : (
                      <>
                        <GitCompare className="w-5 h-5" />
                        Compare Assets
                      </>
                    )}
                  </button>

                  {comparison && (
                    <div className="mt-6 space-y-4">
                      {/* Top Pick */}
                      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border-2 border-yellow-400">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-6 h-6 text-yellow-600" />
                          <h3 className="font-bold text-xl text-yellow-900">Top Pick</h3>
                        </div>
                        <p className="text-2xl font-bold text-yellow-900 mb-2">{comparison.topPick.symbol}</p>
                        <p className="text-sm text-yellow-800">{comparison.topPick.reason}</p>
                      </div>

                      {/* Asset Cards */}
                      <div className="space-y-3">
                        {comparison.assets.map((asset, i) => (
                          <div key={i} className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-xl font-bold text-gray-900">{asset.symbol}</h4>
                              <div className={`text-3xl font-bold ${getScoreColor(asset.score)}`}>
                                {asset.score}/100
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-3">
                              <div className={`p-2 rounded text-center ${getSentimentColor(asset.sentiment)}`}>
                                <p className="text-xs font-semibold">Sentiment</p>
                                <p className="text-sm font-bold capitalize">{asset.sentiment}</p>
                              </div>
                              <div className={`p-2 rounded text-center ${getRiskColor(asset.riskLevel)}`}>
                                <p className="text-xs font-semibold">Risk</p>
                                <p className="text-sm font-bold capitalize">{asset.riskLevel}</p>
                              </div>
                              <div className="p-2 rounded text-center bg-purple-50 text-purple-600">
                                <p className="text-xs font-semibold">Return</p>
                                <p className="text-sm font-bold capitalize">{asset.potentialReturn}</p>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="font-bold text-green-700 mb-1">Pros:</p>
                                <ul className="space-y-1">
                                  {asset.pros.map((pro, j) => (
                                    <li key={j} className="text-green-600">✓ {pro}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="font-bold text-red-700 mb-1">Cons:</p>
                                <ul className="space-y-1">
                                  {asset.cons.map((con, j) => (
                                    <li key={j} className="text-red-600">✗ {con}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Allocation */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-3 text-blue-900">Recommended Portfolio Allocation</h4>
                        <div className="space-y-2">
                          {Object.entries(comparison.allocation).map(([sym, percent]) => (
                            <div key={sym}>
                              <div className="flex justify-between mb-1">
                                <span className="font-semibold text-blue-800">{sym}</span>
                                <span className="font-bold text-blue-900">{percent}%</span>
                              </div>
                              <div className="w-full bg-blue-200 rounded-full h-3">
                                <div 
                                  className="bg-blue-600 h-3 rounded-full transition-all"
                                  style={{width: `${percent}%`}}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Strategy */}
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2 text-purple-900">Overall Strategy</h4>
                        <p className="text-sm text-purple-800">{comparison.overallStrategy}</p>
                      </div>

                      {/* Key Insights */}
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2 text-green-900">Key Insights</h4>
                        <ul className="space-y-1">
                          {comparison.keyInsights.map((insight, i) => (
                            <li key={i} className="text-sm text-green-800">• {insight}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Warnings */}
                      {comparison.warnings.length > 0 && (
                        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-bold mb-2 text-red-900">Important Warnings</h4>
                              <ul className="space-y-1">
                                {comparison.warnings.map((warning, i) => (
                                  <li key={i} className="text-sm text-red-800">• {warning}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Chat Panel */}
          <div className="bg-white rounded-xl shadow-2xl p-6 flex flex-col h-[700px]">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">AI Advisor Chat</h2>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 space-y-3 bg-gray-50 rounded-lg p-4">
              {conversationHistory.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">
                  <p className="mb-2 font-semibold">Ask me anything:</p>
                  <ul className="text-sm space-y-1 text-left">
                    <li>• Should I invest in Bitcoin or Ethereum?</li>
                    <li>• What's the risk with Solana?</li>
                    <li>• How much should I allocate to crypto?</li>
                    <li>• When is the best time to buy?</li>
                    <li>• What about diversification?</li>
                  </ul>
                </div>
              ) : (
                conversationHistory.map((msg, i) => (
                  <div key={i} className={`p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-blue-100 ml-4' 
                      : 'bg-green-100 mr-4'
                  }`}>
                    <p className="text-xs font-bold mb-1 text-gray-600">
                      {msg.role === 'user' ? 'You' : 'AI Advisor'}
                    </p>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="Ask about crypto, strategies, risk..."
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-sm"
                onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
              />
              <button
                onClick={askQuestion}
                disabled={!userQuestion.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold px-6 rounded-lg transition-colors"
              >
                Ask
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-bold mb-1">Important Disclaimer</p>
              <p>This AI provides educational analysis only and is NOT financial advice. Cryptocurrency investments are extremely volatile and risky. Past performance does not guarantee future results. Only invest what you can afford to lose completely. Always do your own research and consult licensed financial advisors before making investment decisions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
