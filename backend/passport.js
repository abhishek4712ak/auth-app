import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import User from './models/user.model.js';

// Ensure environment variables are loaded
dotenv.config();

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || profile.email;
        const name = profile.displayName;
        const avatar = profile.photos?.[0]?.value;

        // Find or create user
        let user = await User.findOne({ providerId: profile.id, provider: 'google' });

        if (!user) {
          // Check if user exists by email
          let existingUser = await User.findOne({ email });

          if (existingUser) {
            // Link Google account to existing user
            existingUser.providerId = profile.id;
            existingUser.provider = 'google';
            user = await existingUser.save();
          } else {
            // Create new user
            user = await User.create({
              name,
              email,
              avatar,
              providerId: profile.id,
              provider: 'google'
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/auth/github/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.username || profile.displayName;
        const avatar = profile._json.avatar_url;

        // Find or create user
        let user = await User.findOne({ providerId: profile.id, provider: 'github' });

        if (!user) {
          // Check if user exists by email (if available)
          let existingUser = email ? await User.findOne({ email }) : null;

          if (existingUser) {
            // Link GitHub account to existing user
            existingUser.providerId = profile.id;
            existingUser.provider = 'github';
            user = await existingUser.save();
          } else {
            // Create new user (email optional for GitHub)
            user = await User.create({
              name,
              email: email || `${profile.username}@github.com`,
              avatar,
              providerId: profile.id,
              provider: 'github'
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:8080/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails', 'picture']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const avatar = profile.photos?.[0]?.value || `https://graph.facebook.com/${profile.id}/picture?type=large`;

        // Find or create user
        let user = await User.findOne({ providerId: profile.id, provider: 'facebook' });

        if (!user) {
          let existingUser = email ? await User.findOne({ email }) : null;

          if (existingUser) {
            existingUser.providerId = profile.id;
            existingUser.provider = 'facebook';
            user = await existingUser.save();
          } else {
            user = await User.create({
              name,
              email,
              avatar,
              providerId: profile.id,
              provider: 'facebook'
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);


// Serialize user
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
