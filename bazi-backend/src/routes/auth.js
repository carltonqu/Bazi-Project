import express from "express";
import { verifyGoogleToken, findOrCreateUser, generateToken } from "../auth.js";

const router = express.Router();

/**
 * POST /api/auth/google
 * Handle Google OAuth login/signup
 */
router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }

    // Verify Google token
    const googleProfile = await verifyGoogleToken(idToken);

    if (!googleProfile.emailVerified) {
      return res.status(400).json({ message: "Email not verified with Google" });
    }

    // Find or create user
    const user = await findOrCreateUser(googleProfile);

    // Generate JWT
    const token = generateToken(user);

    // Return user data and token
    res.json({
      success: true,
      message: user.createdAt === user.lastLogin 
        ? "Account created successfully" 
        : "Login successful",
      user: {
        id: user.id,
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

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get("/me", (req, res) => {
  // This route should be protected by authMiddleware
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture,
    },
  });
});

/**
 * POST /api/auth/logout
 * Handle logout (client-side token removal)
 */
router.post("/logout", (req, res) => {
  // Since we're using JWT, logout is handled client-side
  // by removing the token from storage
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;
