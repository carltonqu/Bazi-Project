import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Only required for email/password users
    }
  },
  name: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  picture: {
    type: String,
    default: null
  },
  // Email verification fields
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  emailVerificationExpires: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  subscriptionStatus: {
    type: String,
    enum: ["free", "active", "canceled", "past_due"],
    default: "free"
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  stripeSubscriptionId: {
    type: String,
    default: null
  }
});

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ emailVerificationToken: 1 });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
