# 📁 Project Structure

```
ai-trading-advisor/
├── src/
│   ├── TradingBot.jsx          # Main application component
│   ├── main.jsx                # React entry point
│   ├── index.css               # Global styles + Tailwind
│   └── storage.js              # Storage wrapper (localStorage fallback)
│
├── public/                     # Static assets (add your own)
│   └── (favicon, images, etc.)
│
├── dist/                       # Production build (auto-generated)
│
├── node_modules/               # Dependencies (auto-generated)
│
├── .env                        # Your environment variables (DO NOT COMMIT)
├── .env.example                # Example environment file (safe to commit)
├── .gitignore                  # Git ignore rules
│
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── package-lock.json           # Locked dependency versions
│
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
│
├── README.md                   # Main documentation
├── QUICKSTART.md               # Quick start guide
├── DEPLOYMENT.md               # Deployment instructions
├── CONTRIBUTING.md             # Contribution guidelines
└── LICENSE                     # MIT License

```

## 📄 File Descriptions

### Core Application Files

#### `src/TradingBot.jsx`
- Main React component
- Contains all 7 features
- Handles state management
- API calls to Anthropic

#### `src/main.jsx`
- React application entry point
- Renders TradingBot component
- Imports global styles

#### `src/index.css`
- Tailwind CSS directives
- Global styles
- Custom CSS if needed

#### `src/storage.js`
- Storage abstraction layer
- Falls back to localStorage
- Works in any environment

### Configuration Files

#### `vite.config.js`
- Vite build configuration
- Dev server settings
- Build optimizations

#### `tailwind.config.js`
- Tailwind CSS customization
- Custom animations
- Theme extensions

#### `postcss.config.js`
- PostCSS plugins
- Tailwind processing
- Autoprefixer setup

#### `package.json`
- Project metadata
- Dependencies list
- npm scripts
- Build commands

### Environment Files

#### `.env` (YOUR FILE - not in repo)
```
VITE_ANTHROPIC_API_KEY=your_actual_key_here
```

#### `.env.example` (TEMPLATE - in repo)
```
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Documentation Files

#### `README.md`
- Complete project documentation
- Features overview
- Installation instructions
- Usage guide

#### `QUICKSTART.md`
- 5-minute setup guide
- Step-by-step instructions
- Troubleshooting tips

#### `DEPLOYMENT.md`
- Deploy to Vercel, Netlify, etc.
- Self-hosting guide
- Environment setup

#### `CONTRIBUTING.md`
- How to contribute
- Code style guide
- PR process

### Other Files

#### `.gitignore`
- Prevents committing sensitive files
- Excludes node_modules
- Ignores build artifacts

#### `LICENSE`
- MIT License
- Open source terms

#### `index.html`
- HTML entry point
- Loads React app
- Meta tags for SEO

## 🔧 Build Output

When you run `npm run build`, Vite creates:

```
dist/
├── index.html              # Optimized HTML
├── assets/
│   ├── index-[hash].js    # Bundled JavaScript
│   ├── index-[hash].css   # Bundled styles
│   └── vendor-[hash].js   # Third-party libraries
└── vite.svg               # Default favicon
```

## 📦 Dependencies

### Production Dependencies
- `react` - UI library
- `react-dom` - React DOM rendering
- `lucide-react` - Icon library

### Development Dependencies
- `vite` - Build tool and dev server
- `@vitejs/plugin-react` - React support for Vite
- `tailwindcss` - Utility-first CSS
- `autoprefixer` - CSS vendor prefixes
- `postcss` - CSS processing

## 🎨 Styling Architecture

```
Tailwind CSS (utility classes)
    ↓
PostCSS (processing)
    ↓
Autoprefixer (browser compatibility)
    ↓
Optimized CSS bundle
```

## 🔄 Data Flow

```
User Input
    ↓
React State (useState)
    ↓
API Call to Anthropic
    ↓
Response Processing
    ↓
State Update
    ↓
UI Re-render
    ↓
Storage (if needed)
```

## 🗂️ Storage Structure

```javascript
// Browser Storage Keys
'trading-alerts'    → Array of alert objects
'trading-portfolio' → Array of holding objects

// Alert Object
{
  id: timestamp,
  symbol: "BTC",
  condition: "above",
  price: 50000,
  status: "active",
  triggered: false
}

// Holding Object
{
  id: timestamp,
  symbol: "BTC",
  quantity: 0.5,
  buyPrice: 45000,
  currentPrice: 50000,
  buyDate: "2024-01-01"
}
```

## 🚀 Development Workflow

```
1. Edit src/TradingBot.jsx
2. Vite hot-reloads instantly
3. Test in browser
4. Commit changes
5. Push to GitHub
6. Auto-deploy (if configured)
```

## 📱 Responsive Design

All features work on:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1920px+)

## 🎯 Feature Organization

Each feature is self-contained in the `TradingBot.jsx`:
- Single Analysis (lines ~500-800)
- Compare Investments (lines ~800-1200)
- Chart Analysis (lines ~1200-1500)
- Price Alerts (lines ~1500-1800)
- Portfolio Tracker (lines ~1800-2100)
- News Sentiment (lines ~2100-2400)
- Risk Calculator (lines ~2400-2700)

## 🔐 Security Best Practices

✅ API keys in environment variables
✅ .env in .gitignore
✅ No sensitive data in code
✅ Client-side data storage only
✅ HTTPS in production

---

**Need to modify the structure?** 
Feel free to reorganize as your project grows!
