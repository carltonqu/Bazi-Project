import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { z } from "zod";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { connectDB } from "../lib/db.js";
import { User } from "../models/User.js";

const app = express();

// CORS configuration - allow multiple origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://bazi-frontend-gray.vercel.app",
  "https://bazi-frontend-itmuyfxq8-aidevelopers-projects-a5652f1e.vercel.app",
  "https://bazi-frontend-isso3mt9o-aidevelopers-projects-a5652f1e.vercel.app",
  "https://bazi-frontend-ne2gsge9z-aidevelopers-projects-a5652f1e.vercel.app",
  "https://bazi-frontend-m9r7hhvjq-aidevelopers-projects-a5652f1e.vercel.app",
];

if (process.env.FRONTEND_ORIGIN) {
  allowedOrigins.push(process.env.FRONTEND_ORIGIN);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));

// Google OAuth setup
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Auth utilities
async function verifyGoogleToken(idToken) {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID not configured");
  }

  const ticket = await oauth2Client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  
  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    emailVerified: payload.email_verified,
  };
}

function generateToken(user) {
  return jwt.sign(
    {
      userId: user._id ? user._id.toString() : user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Auth Routes
app.post("/api/auth/google", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }

    if (!GOOGLE_CLIENT_ID) {
      console.error("GOOGLE_CLIENT_ID environment variable is not set");
      return res.status(500).json({ 
        message: "Server configuration error: GOOGLE_CLIENT_ID not configured",
        error: "Missing GOOGLE_CLIENT_ID environment variable"
      });
    }

    const googleProfile = await verifyGoogleToken(idToken);

    if (!googleProfile.emailVerified) {
      return res.status(400).json({ message: "Email not verified with Google" });
    }

    // Connect to DB
    await connectDB();

    // Find or create user
    let user = await User.findOne({ googleId: googleProfile.googleId });
    const isNewUser = !user;

    if (!user) {
      // Check if email already exists
      const existingUser = await User.findOne({ email: googleProfile.email.toLowerCase() });
      if (existingUser) {
        // Link Google account to existing email account
        existingUser.googleId = googleProfile.googleId;
        existingUser.picture = googleProfile.picture;
        existingUser.lastLogin = new Date();
        await existingUser.save();
        user = existingUser;
      } else {
        // Create new user
        user = new User({
          googleId: googleProfile.googleId,
          email: googleProfile.email.toLowerCase(),
          name: googleProfile.name,
          picture: googleProfile.picture,
          lastLogin: new Date()
        });
        await user.save();
      }
    } else {
      user.lastLogin = new Date();
      user.picture = googleProfile.picture;
      await user.save();
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: isNewUser ? "Account created successfully" : "Login successful",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      token,
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({
      message: "Authentication failed",
      error: error.message,
    });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

// Email/Password Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Connect to DB
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password (plain text for now - should use bcrypt in production)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

// Email/Password Signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Connect to DB
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      name: name,
      password: password, // In production, hash this with bcrypt
      lastLogin: new Date()
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
});

// Fortune schemas
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

// Root route
app.get("/", (_req, res) => {
  res.json({
    service: "bazi-backend",
    status: "running",
    version: "1.0.0",
    database: process.env.MONGODB_URI ? "connected" : "not configured",
    endpoints: {
      health: "/api/health",
      auth: {
        login: "POST /api/auth/login",
        signup: "POST /api/auth/signup",
        logout: "POST /api/auth/logout",
        google: "POST /api/auth/google"
      },
      fortune: "POST /api/fortune"
    }
  });
});

// Health check endpoint
app.get("/api/health", async (_req, res) => {
  try {
    await connectDB();
    res.json({ 
      ok: true, 
      service: "bazi-backend", 
      timestamp: new Date().toISOString(),
      database: process.env.MONGODB_URI ? "connected" : "not configured",
      config: {
        googleClientIdConfigured: !!GOOGLE_CLIENT_ID,
        jwtSecretConfigured: JWT_SECRET !== "your-super-secret-jwt-key-change-in-production"
      }
    });
  } catch (error) {
    res.json({ 
      ok: true, 
      service: "bazi-backend", 
      timestamp: new Date().toISOString(),
      database: "error: " + error.message,
      config: {
        googleClientIdConfigured: !!GOOGLE_CLIENT_ID,
        jwtSecretConfigured: JWT_SECRET !== "your-super-secret-jwt-key-change-in-production"
      }
    });
  }
});

// Fortune generation endpoint
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

// Debug endpoint
app.get("/api/debug", async (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    database: process.env.MONGODB_URI ? "configured" : "not configured",
    environment: {
      GOOGLE_CLIENT_ID: {
        present: !!GOOGLE_CLIENT_ID,
        length: GOOGLE_CLIENT_ID ? GOOGLE_CLIENT_ID.length : 0,
        preview: GOOGLE_CLIENT_ID ? `${GOOGLE_CLIENT_ID.substring(0, 20)}...` : null,
        endsWithCorrectSuffix: GOOGLE_CLIENT_ID ? GOOGLE_CLIENT_ID.endsWith('.apps.googleusercontent.com') : false
      },
      JWT_SECRET: {
        present: !!JWT_SECRET,
        isDefault: JWT_SECRET === "your-super-secret-jwt-key-change-in-production"
      },
      NODE_ENV: process.env.NODE_ENV || 'not set'
    }
  });
});

// Export for Vercel serverless
export default app;
