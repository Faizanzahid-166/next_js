import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import UserModel, { User } from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    // Credentials Login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        if (!credentials?.email || !credentials?.password) return null;

        const user: User | null = await UserModel.findOne({
          email: credentials.email.toLowerCase(),
        });

        if (!user || !user.isVerified) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) return null;

        return {
          id: user._id.toString(),
          _id: user._id.toString(),
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
          isAcceptingMessage: user.isAcceptingMessage,
        };
      },
    }),

    // Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id ?? token.id;
        token._id = user._id ?? token._id;
        token.username = user.username ?? token.username;
        token.email = user.email ?? token.email;
        token.isVerified = user.isVerified ?? token.isVerified;
        token.isAcceptingMessage =
          user.isAcceptingMessage ?? token.isAcceptingMessage;
      }

      // Optional: flag for Google login
      if (account?.provider === "google") {
        token.isGoogle = true;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user._id = token._id as string | undefined;
      session.user.username = token.username;
      session.user.email = token.email;
      session.user.isVerified = token.isVerified;
      session.user.isAcceptingMessage = token.isAcceptingMessage;
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};
