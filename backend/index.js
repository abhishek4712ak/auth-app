import express from "express"
import cors from "cors"
import session from "express-session"
import dotenv from "dotenv"
import connectDB from "./config/db.js"

// Load environment variables BEFORE importing passport
dotenv.config()

import passport from "passport"
import "./passport.js"

import authRoutes from "./routes/auth.routes.js"
import oauthRoutes from "./routes/oauth.routes.js"
import oauthTest from "./test-oauth.js"

const app = express()
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}
app.use(cors(corsOptions))

// Session middleware for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))

// Initialize Passport.js
app.use(passport.initialize())
app.use(passport.session())


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.use("/auth", authRoutes)
app.use("/auth", oauthRoutes)

// Test endpoint to check OAuth providers configuration
app.use("/oauth",oauthTest)




const PORT = process.env.PORT || 8080

app.listen(PORT, async () => {
  await connectDB()
  console.log(`Server is listening on port ${PORT}`)
})
