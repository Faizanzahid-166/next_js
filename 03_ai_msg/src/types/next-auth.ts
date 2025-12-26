import 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;                 // required by NextAuth
    _id?: string;               // MongoDB ObjectId
    username?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
  }

  interface Session {
    user: {
      id: string;               // required by NextAuth
      _id?: string;             // MongoDB ObjectId
      username?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
  }
}
