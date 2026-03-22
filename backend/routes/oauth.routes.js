import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

// ========== GOOGLE OAuth ==========
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      const user = req.user;
      const token = generateToken(user);
      
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider
      };

      // Redirect to frontend with token and user data
      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=Authentication+failed`
      );
    }
  }
);

// ========== GITHUB OAuth ==========
router.get('/github',
  passport.authenticate('github', {
    scope: ['user:email']
  })
);

router.get('/github/callback',
  passport.authenticate('github', { session: false }),
  (req, res) => {
    try {
      const user = req.user;
      const token = generateToken(user);
      
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider
      };

      // Redirect to frontend with token and user data
      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('GitHub callback error:', error);
      res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=Authentication+failed`
      );
    }
  }
);

// ========== FACEBOOK OAuth ==========
router.get('/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'public_profile'],
    session: false
  })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  (req, res) => {
    try {
      const user = req.user;
      const token = generateToken(user);
      
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider
      };

      // Redirect to frontend with token and user data
      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Facebook callback error:', error);
      res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=Authentication+failed`
      );
    }
  }
);

// ========== TWITTER OAuth ==========
router.get('/twitter',
  passport.authenticate('twitter', {
    session: false
  })
);

router.get('/twitter/callback',
  passport.authenticate('twitter', { session: false }),
  (req, res) => {
    try {
      const user = req.user;
      const token = generateToken(user);
      
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider
      };

      // Redirect to frontend with token and user data
      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Twitter callback error:', error);
      res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=Authentication+failed`
      );
    }
  }
);

export default router;
