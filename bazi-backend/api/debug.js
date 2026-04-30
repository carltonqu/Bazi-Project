// Debug endpoint to check configuration
import "dotenv/config";

export default function handler(req, res) {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const JWT_SECRET = process.env.JWT_SECRET;
  
  res.json({
    timestamp: new Date().toISOString(),
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
}
