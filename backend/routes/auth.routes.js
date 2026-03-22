import express from "express"
import {
  register,
  verifyOtp,
  login,
  requestPasswordReset,
  resetPassword,resendOTP
} from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/register", register)
router.post("/verify-otp", verifyOtp)
router.post("/login", login)
router.post("/forgot-password", requestPasswordReset)
router.post("/reset-password", resetPassword)
router.post("/resend-otp", resendOTP)

export default router
