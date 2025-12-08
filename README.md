# Confluence Checklist Coach

A professional Next.js application for rule-based, confluence-driven traders. Follow a structured pre-trade checklist before placing any trade. Educational use only.

## ⚠️ Important Disclaimer

**This tool is for educational purposes only and does not provide financial advice.**

- Trading involves high risk of loss and is not suitable for everyone
- Not affiliated with any broker, educator, or trading firm
- Creator is not FCA-regulated and does not provide regulated investment services
- You are solely responsible for your trading decisions

See [full disclaimer](/disclaimer) for complete legal information.

---

## 🎯 Features

### Pre-Trade Checklist Workflow (5 Steps)

1. **Market Bias & Environment**
   - Select currency pair
   - Document market conditions

2. **Directional Bias Analysis**
   - Analyze trends across multiple timeframes
   - Document your directional bias
   - AI validation with confidence scoring

3. **Price Zones & Context**
   - Mark key support/resistance levels
   - Document confluence factors
   - AI validation of zone quality

4. **Setup Criteria & Triggers**
   - Confirm your predefined setup/pattern
   - Validate entry conditions
   - Confluence scoring

5. **Risk, Size & Reward-to-Risk Framework**
   - Calculate position size
   - Set stop loss and targets
   - Verify minimum R:R ratio
   - Document set-and-forget management plan

### Trade Journal & Analytics
- Comprehensive trade history
- Win rate and R:R tracking
- Pattern analysis
- Outcome logging for learning

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com/api/agents
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## 📁 Project Structure

```
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── callback/
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── dashboard/
│   │   ├── workflow/
│   │   ├── journal/
│   │   └── settings/
│   ├── disclaimer/          # Legal disclaimer page
│   ├── api/                 # Next.js API routes
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/              # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── DisclaimerBanner.tsx
│   │   └── NotificationCenter.tsx
│   ├── workflow/            # 5-step workflow components
│   │   ├── Step1MarketSession.tsx
│   │   ├── Step2TrendAnalysis.tsx
│   │   ├── Step3AOIMapping.tsx
│   │   ├── Step4PatternValidation.tsx
│   │   ├── Step5RiskCalculation.tsx
│   │   └── Step6ReviewJournal.tsx
│   ├── journal/             # Journal components
│   └── settings/            # Settings components
├── lib/
│   ├── api/                 # API client and methods
│   │   ├── client.ts
│   │   └── workflow.ts
│   └── utils/               # Utility functions
│       ├── formatters.ts
│       └── cn.ts
├── store/
│   └── workflowStore.ts     # Zustand state management
├── types/
│   └── api.ts               # TypeScript type definitions
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 🎨 Design System

### Color Palette
- **Background**: Deep dark (#0a0e1a, #111827, #1f2937)
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Danger**: Red (#ef4444)
- **Warning**: Amber (#f59e0b)

### Components
- Buttons: `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-danger`
- Cards: `.card`, `.card-hover`
- Inputs: `.input`, `.label`
- Alerts: `.alert-success`, `.alert-danger`, `.alert-warning`

---

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Authentication**: Google OAuth
- **Deployment**: Netlify

---

## 📊 API Integration

All API calls are made to the Manus backend.

### Authentication
- `POST /google-login` - Google OAuth login

### Workflow
- `POST /log_session` - Log market session
- `POST /validate_trend` - Validate trend analysis
- `POST /validate_aoi` - Validate price zone/AOI
- `POST /validate_pattern` - Validate setup/pattern
- `POST /calculate_risk` - Calculate risk and R:R
- `POST /journal_entry` - Create journal entry

### Journal
- `GET /trades` - Get all trades
- `POST /log_outcome` - Log trade outcome
- `GET /journal_analysis` - Get analytics

---

## 🔐 Security

- JWT tokens for authentication
- Google OAuth integration
- Input validation with Zod schemas
- XSS protection via Next.js
- Secure cookie settings in production

---

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly interface
- Optimized for all screen sizes

---

## 🧪 Development

### Code Style
- ESLint for linting
- TypeScript strict mode
- Consistent component structure

### Best Practices
- Server-side API routes for authentication
- Client-side state management with Zustand
- Form validation with React Hook Form
- Type-safe API calls

---

## 📄 License

Proprietary - Confluence Checklist Coach

---

## 🤝 Support

For issues or questions, contact the development team.

---

## Key Principles

**Slow down. Check your confluence. Commit to your plan.**

This tool helps you:
- Follow a structured pre-trade checklist
- Document your trading plan before execution
- Apply your own rules systematically
- Commit to a set-and-forget management approach

This tool does NOT:
- Provide trading signals or recommendations
- Tell you what to buy or sell
- Execute trades on your behalf
- Guarantee profits or reduce risk
