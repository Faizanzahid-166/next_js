import mongoose, { Schema, Document, Model } from "mongoose";

/* ---------------- Message ---------------- */
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema = new Schema<Message>({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

/* ---------------- User ---------------- */
export interface User extends Document {
  _id: string;               // MongoDB ObjectId as string
  username: string;
  email: string;
  password: string;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  message: Message[];
}

const UserSchema = new Schema<User>({
  username: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, unique: true, match: [/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi, 'Use a valid email'] },
  password: { type: String, required: true },
  verifyCode: { type: String },
  verifyCodeExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
  isAcceptingMessage: { type: Boolean, default: true },
  message: [MessageSchema],
});

const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;
