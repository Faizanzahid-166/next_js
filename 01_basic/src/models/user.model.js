import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Provide a username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Provide a password"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPaswordToken: { type: String },
  forgotPaswordTokenExpiry: { type: Date },
  verifyToken: { type: String },
  verifyTokenExpiry: { type: Date },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
