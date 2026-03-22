# Authentication App with OAuth

A modern, dark-themed authentication application with support for multiple OAuth providers including Google, GitHub, Facebook, and Twitter.

## Features

- 🔐 Email/Password Authentication with OTP verification
- 🔄 Password reset functionality
- 🌐 OAuth integration (Google, GitHub, Facebook, Twitter)
- 🎨 Modern dark UI with glassmorphism effects
- 📱 Responsive design
- ⚡ JWT-based authentication
- 🛡️ Secure session management

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Passport.js for OAuth
- JWT for authentication
- bcryptjs for password hashing
- Nodemailer for email services

### Frontend
- React 19
- React Router
- Axios for API calls
- Modern CSS with dark theme

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cd backend
cp .env.example .env
```

Update the `.env` file with your configuration:

#### Database Setup
```env
MONGODB_URI=mongodb://localhost:27017/auth-app
```

#### JWT Configuration
```env
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-session-secret-here
```

#### OAuth Provider Setup

##### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:8080/auth/google/callback`

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

##### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:8080/auth/github/callback`

```env
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

##### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Set Valid OAuth Redirect URIs: `http://localhost:8080/auth/facebook/callback`

```env
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

##### Twitter OAuth
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Set callback URLs: `http://localhost:8080/auth/twitter/callback`

```env
TWITTER_CONSUMER_KEY=your-twitter-consumer-key
TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret
```

### 3. Database Setup

Make sure MongoDB is running on your system, then the app will automatically connect.

### 4. Email Configuration

Update the email configuration in `config/nodemailer.js` for OTP emails.

### 5. Start the Application

```bash
# Backend (from backend directory)
npm run dev

# Frontend (from frontend directory, in a new terminal)
npm start
```

The backend will run on `http://localhost:8080` and frontend on `http://localhost:3000`.

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/verify-otp` - Verify email with OTP
- `POST /auth/login` - Login user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with OTP

### OAuth
- `GET /auth/google` - Google OAuth login
- `GET /auth/github` - GitHub OAuth login
- `GET /auth/facebook` - Facebook OAuth login
- `GET /auth/twitter` - Twitter OAuth login

## Features Overview

### User Registration Flow
1. User enters name, email, password
2. System sends OTP to email
3. User verifies email with OTP
4. Account is activated

### OAuth Integration
- Users can login with Google, GitHub, Facebook, or Twitter
- Existing users can link their OAuth accounts
- OAuth users are automatically verified
- Profile information is synced

### Security Features
- Password hashing with bcrypt
- JWT tokens for authentication
- OTP-based email verification
- Secure session management
- CORS protection

## UI/UX Features

- 🌙 Dark theme with modern design
- 🔄 Smooth animations and transitions
- 📱 Fully responsive layout
- 🎯 Glassmorphism effects
- 🎨 Gradient accents
- ⚡ Fast and intuitive user experience

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own applications!
