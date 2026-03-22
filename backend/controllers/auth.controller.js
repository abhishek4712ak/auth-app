import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import OTP from "../models/otp.model.js"
import { sendOTPMail, sendWelcomeMail, sendRegistrationConfirmationMail } from "../config/nodemailer.js"

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

const createOTP = async (email, purpose) => {
  const otpValue = generateOTP()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

  await OTP.create({ email, otp: otpValue, purpose, expiresAt })

  return otpValue
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(400).json({ message: "Email already registered." })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed, isVerified: false })

    const otp = await createOTP(user.email, "register")
    
    // Send both registration confirmation and OTP email
    await sendRegistrationConfirmationMail(user.email, user.name)
    await sendOTPMail(user.email, otp)

    res.status(201).json({ message: "User created. Confirmation and OTP sent to email.", email: user.email })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error during registration." })
  }
}

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." })
    }

    const otpRecord = await OTP.findOne({ email: email.toLowerCase(), otp, purpose: "register", used: false })
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP." })
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired." })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(400).json({ message: "User not found." })
    }

    user.isVerified = true
    await user.save()

    otpRecord.used = true
    await otpRecord.save()

    await sendWelcomeMail(user.email, user.name)

    res.json({ message: "Email verified and registration complete." })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error during OTP verification." })
  }
}
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." })
    }
    
    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified. Please verify your email before logging in." })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({ token, user: { name: user.name, email: user.email,id:user.id } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error during login." })
  }
}

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ message: "Email is required." })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(404).json({ message: "No account found for this email." })
    }

    const otp = await createOTP(user.email, "reset")
    await sendOTPMail(user.email, otp)

    res.json({ message: "OTP sent to email for password reset." })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error during password reset request." })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required." })
    }

    const otpRecord = await OTP.findOne({ email: email.toLowerCase(), otp, purpose: "reset", used: false })
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP." })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    user.password = await bcrypt.hash(newPassword, 12)
    await user.save()

    otpRecord.used = true
    await otpRecord.save()

    res.json({ message: "Password has been reset successfully." })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error during password reset." })
  }
}

export const resendOTP = async (req, res) => {
  try {
    const { email, purpose } = req.body;
    if (!email || !purpose) {
      return res.status(400).json({ message: "Email and purpose (register/reset) are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const otp = await createOTP(email.toLowerCase(), purpose);
    await sendOTPMail(email, otp);

    res.json({ message: `New OTP sent to ${email} for ${purpose}.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during OTP resend." });
  }
};
