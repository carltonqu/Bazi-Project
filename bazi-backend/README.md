# bazi-backend

Node.js backend for Bazi fortune generation.

## 1) Setup

```bash
cd bazi-backend
npm install
cp .env.example .env
```

Fill `.env` values:
- `OPENCLAW_BASE_URL`
- `OPENCLAW_API_KEY`
- optional: `OPENCLAW_MODEL`

## 2) Run

```bash
npm run dev
```

## 3) API

### Health
`GET /health`

### Fortune
`POST /api/fortune`

Payload:

```json
{
  "name": "John",
  "birthDate": "1995-03-10",
  "birthTime": "08:30",
  "birthLocation": "Manila",
  "currentAddress": "Quezon City",
  "jobPosition": "Product Manager",
  "gender": "male",
  "lifeProblem": "I feel stuck in career direction",
  "birthWeekday": "Friday"
}
```

Response:

```json
{
  "categories": {
    "aboutMyself": [{ "topic": "", "reading": "", "advice": "" }],
    "career": [{ "topic": "", "reading": "", "advice": "" }],
    "relationships": [{ "topic": "", "reading": "", "advice": "" }],
    "business": [{ "topic": "", "reading": "", "advice": "" }],
    "lifeGoals": [{ "topic": "", "reading": "", "advice": "" }]
  }
}
```

## 4) Deploy to Render

- Create new **Web Service**
- Root directory: `bazi-backend`
- Build command: `npm install`
- Start command: `npm start`
- Add env vars from `.env`
- Set `FRONTEND_ORIGIN` to your frontend domain
