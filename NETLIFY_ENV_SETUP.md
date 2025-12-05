# Netlify Environment Configuration

## Set Environment Variable

Go to your Netlify dashboard:
1. Site settings → Environment variables
2. Add new variable:

**Key**: `NEXT_PUBLIC_API_BASE_URL`  
**Value**: `https://3000-ivs6mmlhg9m3tj3d6stg6-3c645c19.manusvm.computer/api/agents`

3. Click "Save"
4. Trigger a new deployment

## Important Notes

⚠️ **Temporary VM URL**: This URL will change if the Manus sandbox restarts.

For production:
- Click "Publish" in Manus UI to get a stable `*.manus.space` domain
- Update the environment variable with the permanent URL

## Local Development

For local testing, update your `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://3000-ivs6mmlhg9m3tj3d6stg6-3c645c19.manusvm.computer/api/agents
```

Then restart your dev server:
```bash
npm run dev
```
