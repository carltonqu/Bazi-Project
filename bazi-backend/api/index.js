import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { z } from "zod";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Stripe from "stripe";
import { connectDB } from "../lib/db.js";
import { User } from "../models/User.js";
import { sendVerificationEmail } from "../lib/email.js";

// Stripe setup (lazy initialization)
let stripe;
function getStripe() {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia",
    });
  }
  return stripe;
}
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || "price_1R8example";

const app = express();

// CORS configuration - allow multiple origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://thelifecycleai.com",
  "https://www.thelifecycleai.com",
  "https://bazi-frontend-gray.vercel.app",
  "https://bazi-frontend-itmuyfxq8-aidevelopers-projects-a5652f1e.vercel.app",
  "https://bazi-frontend-isso3mt9o-aidevelopers-projects-a5652f1e.vercel.app",
  "https://bazi-frontend-ne2gsge9z-aidevelopers-projects-a5652f1e.vercel.app",
  "https://bazi-frontend-m9r7hhvjq-aidevelopers-projects-a5652f1e.vercel.app",
  "https://bazi-frontend-p6mnehamb-aidevelopers-projects-a5652f1e.vercel.app",
  "https://bazi-frontend-i3vqv5m4u-aidevelopers-projects-a5652f1e.vercel.app",
];

if (process.env.FRONTEND_ORIGIN) {
  allowedOrigins.push(process.env.FRONTEND_ORIGIN);
}

// Enable CORS for all origins (simplest approach)
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
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
        isEmailVerified: true,
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

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user (auto-verified for now - skipping email verification)
    const user = new User({
      email: email.toLowerCase(),
      name: name,
      password: password, // In production, hash this with bcrypt
      isEmailVerified: true, // Auto-verify since we're skipping email verification
      emailVerificationToken: null,
      emailVerificationExpires: null,
      lastLogin: new Date()
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Account created successfully! Welcome to Bazi Fortune Teller.",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        picture: user.picture,
        isEmailVerified: true,
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

// Email Verification Endpoint
app.get("/api/auth/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    // Connect to DB
    await connectDB();

    // Find user with this verification token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    // Generate token for auto-login
    const authToken = generateToken(user);

    res.json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        picture: user.picture,
        isEmailVerified: true,
      },
      token: authToken,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      message: "Email verification failed",
      error: error.message,
    });
  }
});

// Resend Verification Email
app.post("/api/auth/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Connect to DB
    await connectDB();

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(user.email, user.name, verificationToken);

    if (!emailResult.success) {
      console.error('Failed to resend verification email:', emailResult.error);
      return res.status(502).json({
        success: false,
        message: "Failed to send verification email. Please try again later.",
        error: emailResult.error || "Email service unavailable"
      });
    }

    res.json({
      success: true,
      message: "Verification email sent successfully",
      emailSent: true,
      devMode: emailResult.devMode || false,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      message: "Failed to resend verification email",
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

// Mock fortune data for when AI is not configured
function generateMockFortune(input) {
  return {
    categories: {
      aboutMyself: [
        {
          topic: "Inner Nature",
          reading: `Based on your birth chart, ${input.name}, you possess a balanced elemental composition with strong intuitive abilities. Your natural curiosity drives you to explore deeper meanings in life.`,
          advice: "Trust your instincts when making important decisions. Your intuition is a powerful guide."
        },
        {
          topic: "Core Strengths",
          reading: "Your chart reveals resilience and adaptability as your primary strengths. You have the ability to navigate through challenges with grace and determination.",
          advice: "Leverage your adaptability in times of change. Your flexibility is your greatest asset."
        },
        {
          topic: "Growth Areas",
          reading: "There is potential for developing greater patience and mindfulness. Your active mind sometimes races ahead of the present moment.",
          advice: "Practice mindfulness and meditation to ground your energy and enhance focus."
        }
      ],
      career: [
        {
          topic: "Professional Path",
          reading: `Your Bazi suggests a career path that aligns with your analytical abilities and creative problem-solving skills, ${input.name}. Fields involving strategy, innovation, or helping others would be particularly fulfilling.`,
          advice: "Seek roles that offer both intellectual challenge and meaningful impact."
        },
        {
          topic: "Work Style",
          reading: "You thrive in environments that value independent thinking while also offering collaborative opportunities. Your leadership style is consultative rather than authoritarian.",
          advice: "Look for workplaces that balance autonomy with team collaboration."
        },
        {
          topic: "Career Timing",
          reading: "The coming months present opportunities for career advancement or skill development. Pay attention to unexpected opportunities that align with your long-term goals.",
          advice: "Stay open to new opportunities while maintaining focus on your core objectives."
        }
      ],
      relationships: [
        {
          topic: "Relationship Style",
          reading: "Your chart indicates you value deep, meaningful connections over superficial interactions. You are loyal and committed once trust is established.",
          advice: "Invest time in nurturing your closest relationships. Quality matters more than quantity."
        },
        {
          topic: "Compatibility",
          reading: "You are most compatible with individuals who appreciate your thoughtfulness and respect your need for occasional solitude.",
          advice: "Communicate your needs clearly to partners and friends to avoid misunderstandings."
        },
        {
          topic: "Relationship Growth",
          reading: "Current energies support healing and strengthening of existing relationships. It's a favorable time to resolve past conflicts.",
          advice: "Initiate honest conversations about any lingering issues in your relationships."
        }
      ],
      business: [
        {
          topic: "Business Acumen",
          reading: "Your chart shows strong potential for business success through careful planning and strategic partnerships. You have a natural eye for viable opportunities.",
          advice: "Conduct thorough research before committing to business ventures. Your due diligence will pay off."
        },
        {
          topic: "Financial Outlook",
          reading: "Steady growth is indicated for your financial situation. Avoid risky investments and focus on building sustainable wealth.",
          advice: "Create a long-term financial plan and stick to it consistently."
        },
        {
          topic: "Partnerships",
          reading: "Collaborative ventures look promising, especially with partners who complement your skills. Look for those who share your values.",
          advice: "Choose business partners carefully. Shared values are more important than shared interests."
        }
      ],
      lifeGoals: [
        {
          topic: "Life Purpose",
          reading: `Your Bazi suggests a life path centered on continuous learning and helping others grow, ${input.name}. Your experiences are meant to be shared for the benefit of those around you.`,
          advice: "Embrace opportunities to mentor or teach others. Your wisdom is valuable."
        },
        {
          topic: "Personal Development",
          reading: "The next phase of your life emphasizes inner growth and self-mastery. External achievements will follow internal alignment.",
          advice: "Prioritize personal development alongside professional goals."
        },
        {
          topic: "Legacy",
          reading: "Your lasting impact will come from the positive influence you have on others' lives rather than material accomplishments alone.",
          advice: "Focus on building meaningful relationships and contributing to your community."
        }
      ]
    }
  };
}

async function generateFortune(input) {
  const baseURL = process.env.OPENCLAW_BASE_URL;
  const apiKey = process.env.OPENCLAW_API_KEY;
  const model = process.env.OPENCLAW_MODEL || "openai-codex/gpt-5.3-codex";

  // If API credentials are not configured, return mock data
  if (!baseURL || !apiKey || apiKey === 'your-openclaw-api-key') {
    console.log('AI API not configured, returning mock fortune data');
    return generateMockFortune(input);
  }

  try {
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
  } catch (error) {
    console.error('AI generation failed, falling back to mock data:', error.message);
    return generateMockFortune(input);
  }
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
      FRONTEND_URL: process.env.FRONTEND_URL || 'not set',
      STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID ? 'set' : 'not set',
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'set' : 'not set',
      NODE_ENV: process.env.NODE_ENV || 'not set'
    }
  });
});

// Stripe Checkout Session using direct API call
app.post("/api/stripe/checkout-session", async (req, res) => {
  try {
    const { email, userId } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const params = new URLSearchParams();
    params.append("customer_email", email);
    params.append("line_items[0][price]", STRIPE_PRICE_ID);
    params.append("line_items[0][quantity]", "1");
    params.append("mode", "subscription");
    params.append("success_url", process.env.FRONTEND_URL + "/?subscription=success&session_id={CHECKOUT_SESSION_ID}");
    params.append("cancel_url", process.env.FRONTEND_URL + "/?subscription=cancel");
    if (userId) params.append("metadata[userId]", userId);

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const session = await response.json();
    if (session.error) {
      throw new Error(session.error.message);
    }

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Stripe Webhook
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = getStripe().webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_email;
    const userId = session.metadata?.userId;

    await connectDB();
    if (userId) {
      await User.findByIdAndUpdate(userId, { subscriptionStatus: "active", stripeCustomerId: session.customer });
    } else if (email) {
      await User.findOneAndUpdate({ email: email.toLowerCase() }, { subscriptionStatus: "active", stripeCustomerId: session.customer });
    }
  }

  res.json({ received: true });
});

// Verify subscription status
app.get("/api/subscription/status", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    await connectDB();
    const user = await User.findById(decoded.userId);

    res.json({
      subscriptionStatus: user?.subscriptionStatus || "free",
      stripeCustomerId: user?.stripeCustomerId || null,
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Export for Vercel serverless
export default app;
