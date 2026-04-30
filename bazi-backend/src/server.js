import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { z } from "zod";
import authRoutes from "./routes/auth.js";
import { authMiddleware } from "./auth.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Allow multiple origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://bazi-frontend-gray.vercel.app",
  "https://bazi-frontend-b4xschkld-aidevelopers-projects-a5652f1e.vercel.app",
];

if (process.env.FRONTEND_ORIGIN) {
  allowedOrigins.push(process.env.FRONTEND_ORIGIN);
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin.startsWith(allowed.replace('*.', '')))) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

// Auth routes
app.use("/api/auth", authRoutes);

const FortuneRowSchema = z.object({
  topic: z.string(),
  reading: z.string(),
  advice: z.string(),
});

const FortuneOutputSchema = z.object({
  categories: z.object({
    aboutMyself: z.array(FortuneRowSchema),
    career: z.array(FortuneRowSchema),
    relationships: z.array(FortuneRowSchema),
    business: z.array(FortuneRowSchema),
    lifeGoals: z.array(FortuneRowSchema),
  }),
});

const FortuneInputSchema = z.object({
  name: z.string().min(1),
  birthDate: z.string().min(1),
  birthTime: z.string().min(1),
  birthLocation: z.string().min(1),
  currentAddress: z.string().min(1),
  jobPosition: z.string().min(1),
  gender: z.string().min(1),
  lifeProblem: z.string().min(1),
  birthWeekday: z.string().optional().default(""),
});

function buildPrompt(input) {
  return `You are an expert Bazi fortune consultant. Return ONLY valid JSON (no markdown).

User profile:
- Name: ${input.name}
- Birth Date: ${input.birthDate}
- Birth Time: ${input.birthTime}
- Birth Weekday: ${input.birthWeekday || "Unknown"}
- Birth Location: ${input.birthLocation}
- Current Address: ${input.currentAddress}
- Job Position: ${input.jobPosition}
- Gender: ${input.gender}
- Life Problem: ${input.lifeProblem}

Output schema exactly:
{
  "categories": {
    "aboutMyself": [{"topic":"...","reading":"...","advice":"..."}],
    "career": [{"topic":"...","reading":"...","advice":"..."}],
    "relationships": [{"topic":"...","reading":"...","advice":"..."}],
    "business": [{"topic":"...","reading":"...","advice":"..."}],
    "lifeGoals": [{"topic":"...","reading":"...","advice":"..."}]
  }
}

Rules:
- Create 3 concise rows per category.
- Keep content practical, empathetic, and specific to user life problem.
- Do not include harmful, absolute, or deterministic claims.
- JSON only.`;
}

async function generateFortune(input) {
  const baseURL = process.env.OPENCLAW_BASE_URL;
  const apiKey = process.env.OPENCLAW_API_KEY;
  const model = process.env.OPENCLAW_MODEL || "openai-codex/gpt-5.3-codex";

  if (!baseURL || !apiKey) {
    throw new Error("Missing OPENCLAW_BASE_URL or OPENCLAW_API_KEY in environment.");
  }

  const client = new OpenAI({ baseURL, apiKey });

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "You produce safe, culturally respectful Bazi-style guidance and must output strict JSON.",
      },
      {
        role: "user",
        content: buildPrompt(input),
      },
    ],
    response_format: { type: "json_object" },
  });

  const text = completion.choices?.[0]?.message?.content;
  if (!text) throw new Error("No content returned from AI model.");

  const parsed = JSON.parse(text);
  const validated = FortuneOutputSchema.parse(parsed);
  return validated;
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "bazi-backend" });
});

// Protected route example
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ 
    message: "This is a protected route", 
    user: req.user 
  });
});

app.post("/api/fortune", async (req, res) => {
  try {
    const input = FortuneInputSchema.parse(req.body);
    const fortune = await generateFortune(input);
    res.json(fortune);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid input payload.",
        issues: error.issues,
      });
    }

    console.error("/api/fortune error:", error);
    res.status(500).json({
      message: error?.message || "Failed to generate fortune.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`bazi-backend listening on http://localhost:${PORT}`);
});
