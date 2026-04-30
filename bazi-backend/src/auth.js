import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID);

// In-memory user store (replace with database in production)
const users = new Map();

/**
 * Verify Google ID token and extract user info
 */
export async function verifyGoogleToken(idToken) {
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

/**
 * Find or create user from Google profile
 */
export async function findOrCreateUser(googleProfile) {
  let user = users.get(googleProfile.googleId);
  
  if (!user) {
    user = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      googleId: googleProfile.googleId,
      email: googleProfile.email,
      name: googleProfile.name,
      picture: googleProfile.picture,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    users.set(googleProfile.googleId, user);
  } else {
    // Update last login
    user.lastLogin = new Date().toISOString();
    user.picture = googleProfile.picture; // Update picture in case it changed
  }
  
  return user;
}

/**
 * Generate JWT token for user
 */
export function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * Verify JWT token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Get user by ID
 */
export function getUserById(userId) {
  for (const user of users.values()) {
    if (user.id === userId) {
      return user;
    }
  }
  return null;
}

/**
 * Authentication middleware
 */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }
  
  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
  
  const user = getUserById(decoded.userId);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized - User not found" });
  }
  
  req.user = user;
  next();
}
