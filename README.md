# Alex Trading Coach Application

A professional Next.js application for high-leverage FX trading with AI-powered validation, TradingView charts, and comprehensive trade journaling.

## 🎯 Features

### Phase 1: Core Trading Workflow
- **6-Step Validation Workflow**
  1. Market & Session Selection with "Alex Time" validation
  2. Trend Analysis with TradingView charts
  3. AOI (Area of Interest) Mapping with drawing tools
  4. Pattern & Signal Validation with confluence scoring
  5. Risk & R:R Calculation with position sizing
  6. Review & Journal Entry with AI-generated thesis

- **Trade Journal & Analytics**
  - Comprehensive trade history
  - Win rate and R:R tracking
  - AI-powered coaching recommendations
  - Pattern and session efficacy analysis

### Phase 2: Advanced Features
- **File Upload**: Screenshot evidence for pattern validation
- **AOI Monitoring**: Real-time price alerts for active AOIs
- **Weekly Reports**: Automated performance summaries
- **Notification Center**: In-app alerts for discipline violations and opportunities

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
NEXT_PUBLIC_API_BASE_URL=https://api.manus.im/v1
```

## 📁 Project Structure

```
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── dashboard/
│   │   ├── workflow/
│   │   ├── journal/
│   │   └── settings/
│   ├── api/                 # Next.js API routes
│   │   └── auth/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/              # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── NotificationCenter.tsx
│   ├── workflow/            # 6-step workflow components
│   │   ├── Step1MarketSession.tsx
│   │   ├── Step2TrendAnalysis.tsx
│   │   ├── Step3AOIMapping.tsx
│   │   ├── Step4PatternValidation.tsx
│   │   ├── Step5RiskCalculation.tsx
│   │   └── Step6ReviewJournal.tsx
│   ├── journal/             # Journal components
│   │   ├── TradeTable.tsx
│   │   ├── OutcomeModal.tsx
│   │   └── CoachingDashboard.tsx
│   ├── charts/              # TradingView chart components
│   │   ├── TradingViewChart.tsx
│   │   └── DrawingTools.tsx
│   └── settings/            # Settings components
│       ├── MonitoringSettings.tsx
│       └── ReportSettings.tsx
├── lib/
│   ├── api/                 # API client and methods
│   │   ├── client.ts
│   │   └── workflow.ts
│   └── utils/               # Utility functions
│       ├── alexTime.ts
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

## 🎨 Design System

### Color Palette
- **Background**: Deep dark (#0a0e1a, #111827, #1f2937)
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981) - Long positions
- **Danger**: Red (#ef4444) - Short positions
- **Warning**: Amber (#f59e0b)

### Components
- Buttons: `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-danger`
- Cards: `.card`, `.card-hover`
- Inputs: `.input`, `.label`
- Alerts: `.alert-success`, `.alert-danger`, `.alert-warning`

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: TradingView Lightweight Charts
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Deployment**: Netlify

## 📊 API Integration

All API calls are made to the Manus backend at `https://api.manus.im/v1/agents/*`

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

### Workflow
- `POST /agents/log_session` - Log market session
- `POST /agents/validate_trend` - Validate trend analysis
- `POST /agents/validate_aoi` - Validate AOI
- `POST /agents/validate_pattern` - Validate pattern (with confluence score)
- `POST /agents/calculate_risk` - Calculate risk and R:R
- `POST /agents/journal_entry` - Create journal entry

### Journal
- `GET /agents/trades` - Get all trades
- `POST /agents/log_outcome` - Log trade outcome
- `GET /agents/journal_analysis` - Get analytics

### Phase 2
- `POST /agents/upload_screenshot` - Upload chart screenshot
- `GET /agents/monitoring/aoi/status` - Get AOI monitoring status
- `POST /agents/monitoring/aoi/config` - Update AOI monitoring
- `GET /agents/notifications` - Get notifications

## 🔐 Security

- JWT tokens stored in httpOnly cookies
- CORS headers configured
- Input validation with Zod schemas
- XSS protection via Next.js
- Secure cookie settings in production

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly interface
- Optimized chart rendering

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

## 📄 License

Proprietary - Alex Trading Coach

## 🤝 Support

For issues or questions, contact the development team.

---

**Remember**: Trade with discipline. Follow the Alex methodology. Never deviate from the 1:2 minimum R:R rule.
# Alex-Trading-Coach-APP
