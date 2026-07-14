When ready to deploy, ask AI:
"I am deploying CalculatorsNexus. Guide me through deployment."

Things that will need to change:
──────────────────────────────────────────────────────
Frontend (Next.js):
□ next.config.js        → update API URL to real domain
□ .env.production       → NEXT_PUBLIC_API_URL=https://api.calculatorsnexus.com/api

Backend (Django):
□ settings.py           → DEBUG=False
□ settings.py           → SECRET_KEY from environment variable
□ settings.py           → ALLOWED_HOSTS = ['api.calculatorsnexus.com']
□ settings.py           → CORS_ALLOWED_ORIGINS = ['https://calculatorsnexus.com']
□ settings.py           → JSONRenderer only (no browsable API)
□ templates/robots.txt  → update domain to calculatorsnexus.com
□ Admin → Sites         → update domain from localhost to calculatorsnexus.com

Hosting:
□ Frontend → Vercel (free)
□ Backend  → Railway or DigitalOcean ($5-10/month)
□ Database → PostgreSQL (switch from SQLite)