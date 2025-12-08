# Manus API Integration Guide

## ✅ Completed Changes

### 1. Authentication Flow Updated

**Old**: Custom login forms with JWT cookies  
**New**: OAuth redirect flow with Manus

#### Login Flow:
1. User clicks "Sign In with Manus" on `/login`
2. Redirects to: `https://3000-ivs6mmlhg9m3tj3d6stg6-3c645c19.manusvm.computer/api/oauth/login`
3. User authenticates with Manus OAuth
4. Manus redirects back with `session` cookie (httpOnly, secure)
5. App verifies authentication at `/callback`
6. Redirects to dashboard

#### Files Changed:
- ✅ [app/(auth)/login/page.tsx](file:///Users/brain/Desktop/Alex%20Trading%20Coach%20APP/app/(auth)/login/page.tsx) - OAuth redirect button
- ✅ [app/(auth)/callback/page.tsx](file:///Users/brain/Desktop/Alex%20Trading%20Coach%20APP/app/(auth)/callback/page.tsx) - OAuth callback handler
- ✅ [app/api/logout/route.ts](file:///Users/brain/Desktop/Alex%20Trading%20Coach%20APP/app/api/logout/route.ts) - Logout endpoint
- ✅ [components/layout/TopBar.tsx](file:///Users/brain/Desktop/Alex%20Trading%20Coach%20APP/components/layout/TopBar.tsx) - Updated logout path
- ❌ Removed `app/api/auth/*` - No longer needed

### 2. API Client Configuration

**File**: [lib/api/client.ts](file:///Users/brain/Desktop/Alex%20Trading%20Coach%20APP/lib/api/client.ts)

**Key Settings**:
```typescript
{
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // Sends cookies cross-origin
}
```

**Response Format**: All fields are `camelCase`
- ✅ `confluenceScore` (not `confluence_score`)
- ✅ `rrRatio`, `rrValid`
- ✅ `isValid`, `finalApproval`

### 3. Environment Configuration

**Local** (`.env.local`):
```env
NEXT_PUBLIC_API_BASE_URL=https://3000-ivs6mmlhg9m3tj3d6stg6-3c645c19.manusvm.computer/api/agents
```

**Netlify** (Environment Variables):
- Key: `NEXT_PUBLIC_API_BASE_URL`
- Value: `https://3000-ivs6mmlhg9m3tj3d6stg6-3c645c19.manusvm.computer/api/agents`

---

## 🎯 Three Critical Validation Gates

### Gate 1: Confluence Score (<60 Blocks)

**File**: [components/workflow/Step4PatternValidation.tsx](file:///Users/brain/Desktop/Alex%20Trading%20Coach%20APP/components/workflow/Step4PatternValidation.tsx)

**API Endpoint**: `POST /validate_pattern`

**Response Field**: `confluenceScore` (number)

**Logic**:
```typescript
if (result.confluenceScore < 60) {
  // Display: "⚠️ STAND DOWN - Invalid Setup"
  // Block nextStep()
  return;
}
```

**Status**: ✅ Already implemented

---

### Gate 2: R:R Ratio (<1:2 Blocks)

**File**: [components/workflow/Step5RiskCalculation.tsx](file:///Users/brain/Desktop/Alex%20Trading%20Coach%20APP/components/workflow/Step5RiskCalculation.tsx)

**API Endpoint**: `POST /calculate_risk`

**Response Field**: `rrValid` (boolean)

**Logic**:
```typescript
if (!result.rrValid) {
  // Display: "🛑 R:R is below 1:2 - INVALID TRADE"
  // Disable "Next" button
  return;
}
```

**Status**: ✅ Already implemented

---

### Gate 3: Final Checklist (NEW - TO IMPLEMENT)

**File**: `components/workflow/ChecklistComponent.tsx` (TO CREATE)

**API Endpoint**: `POST /final_checklist_validation`

**Request**:
```typescript
{
  sessionTimeConfirmed: boolean,
  confluenceConfirmed: boolean,
  rrConfirmed: boolean,
  screenshotUploaded: boolean,
  trendAnalysisComplete: boolean,
  aoiMarked: boolean
}
```

**Response**:
```typescript
{
  finalApproval: boolean,
  missingItems: string[],
  warnings: string[]
}
```

**Logic**:
```typescript
if (!result.finalApproval) {
  // Display: "Cannot proceed - checklist incomplete"
  // Show missing items
  // Block journal entry
  return;
}
```

**Status**: ⚠️ TO IMPLEMENT

---

## 📋 Workflow Steps Status

| Step | Component | API Endpoint | Status |
|------|-----------|--------------|--------|
| 1 | Step1MarketSession | `/log_session` | ✅ Ready |
| 2 | Step2TrendAnalysis | `/validate_trend` | ⚠️ Needs UI |
| 3 | Step3AOIMapping | `/validate_aoi` | ⚠️ Needs UI |
| 4 | Step4PatternValidation | `/validate_pattern` | ✅ Ready |
| 5 | Step5RiskCalculation | `/calculate_risk` | ✅ Ready |
| 6 | Step6ReviewJournal | `/journal_entry` | ✅ Ready |

---

## 🚀 Deployment Steps

### 1. Update Netlify Environment Variable

```bash
# Go to Netlify Dashboard
# Site settings → Environment variables
# Add:
NEXT_PUBLIC_API_BASE_URL=https://3000-ivs6mmlhg9m3tj3d6stg6-3c645c19.manusvm.computer/api/agents
```

### 2. Deploy to Netlify

```bash
# Commit changes
git add .
git commit -m "Integrate Manus OAuth and API"
git push origin main

# Netlify will auto-deploy
```

### 3. Test Authentication

1. Visit your Netlify site
2. Click "Sign In with Manus"
3. Authenticate with Manus OAuth
4. Should redirect to dashboard

---

## 🧪 Testing Checklist

### Authentication
- [ ] Login redirects to Manus OAuth
- [ ] OAuth callback verifies session
- [ ] Dashboard loads after auth
- [ ] Logout clears session
- [ ] Unauthorized requests redirect to login

### Workflow Steps
- [ ] Step 1: Session logging works
- [ ] Step 4: Confluence <60 blocks progression
- [ ] Step 5: R:R <1:2 blocks progression
- [ ] Step 6: Journal entry creates AI thesis

### API Integration
- [ ] All endpoints use correct base URL
- [ ] Cookies sent with `withCredentials: true`
- [ ] Response fields are camelCase
- [ ] Error handling works correctly

---

## ⚠️ Important Notes

### Temporary VM URL
The current Manus VM URL is **temporary** and will change if the sandbox restarts.

**For Production**:
1. Click "Publish" in Manus UI
2. Get stable `*.manus.space` domain
3. Update `NEXT_PUBLIC_API_BASE_URL` in Netlify

### CORS Configuration
The Manus backend already has CORS enabled for cross-origin requests. The `withCredentials: true` setting allows cookies to be sent.

### Cookie Security
The `session` cookie is:
- `httpOnly`: Cannot be accessed by JavaScript
- `secure`: Only sent over HTTPS
- `sameSite=none`: Allows cross-origin (Netlify → Manus VM)

---

## 📝 Next Steps

1. **Deploy to Netlify** with updated environment variable
2. **Test OAuth flow** end-to-end
3. **Implement Step 2 & 3** (Trend Analysis, AOI Mapping)
4. **Create Final Checklist** component (Gate 3)
5. **Test all three validation gates** with real API

---

## 🆘 Troubleshooting

### "Authentication failed" error
- Check that `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Verify Manus VM is running
- Check browser console for CORS errors

### Cookies not being sent
- Ensure `withCredentials: true` in API client
- Check that Manus backend has CORS headers
- Verify cookie `sameSite` setting

### OAuth redirect not working
- Check OAuth login URL is correct
- Verify callback URL is `/callback`
- Check localStorage for `oauth_return_url`

---

## 📚 API Documentation Reference

All endpoints are relative to:
```
https://3000-ivs6mmlhg9m3tj3d6stg6-3c645c19.manusvm.computer/api/agents
```

Example:
- Full URL: `https://3000-ivs6mmlhg9m3tj3d6stg6-3c645c19.manusvm.computer/api/agents/validate_pattern`
- Client call: `apiClient.post('/validate_pattern', data)`

Response format: All fields in `camelCase`
