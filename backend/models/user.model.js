import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.provider; // Password required only for local auth
    },
  },
  isVerified: {
    type: Boolean,
    default: function() {
      return !!this.provider; // OAuth users are automatically verified
    },
  },
  provider: {
    type: String,
    enum: ['local', 'google', 'github', 'facebook', 'twitter'],
    default: 'local',
  },
  providerId: {
    type: String,
    sparse: true, // Allows null values but ensures uniqueness when present
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

const User = mongoose.model("User", userSchema)

export default User

