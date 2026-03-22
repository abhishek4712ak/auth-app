import express from 'express';


const oauthTest = express();

// Test route to check if OAuth is configured
oauthTest.get('/test-oauth', (req, res) => {
  const providers = {
    google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    github: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    facebook: !!(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET),
    twitter: !!(process.env.TWITTER_CONSUMER_KEY && process.env.TWITTER_CONSUMER_SECRET)
  };

  res.json({
    message: 'OAuth Configuration Status',
    providers,
    configured: Object.values(providers).some(Boolean)
  });
});

export default oauthTest;