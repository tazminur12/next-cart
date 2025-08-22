import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongodb-adapter";
import connectDB from "./mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// Check required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error('NEXTAUTH_SECRET is not set in environment variables');
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('Google OAuth credentials are not set');
}

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
  console.warn('GitHub OAuth credentials are not set');
}

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.avatar,
            role: user.role
          };
        } catch (error) {
          console.error("Credentials auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      // Ensure token.id is set for subsequent requests (e.g., OAuth sessions)
      if (!token.id && token.sub) {
        token.id = token.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to home page after successful authentication
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/`;
      }
      // Allow external redirects (for OAuth providers)
      else if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      return baseUrl;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          await connectDB();
          
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user
            const newUser = new User({
              name: user.name,
              email: user.email,
              avatar: user.image,
              provider: account.provider,
              providerId: profile.sub || profile.id,
              isVerified: true,
              role: "user"
            });
            
            await newUser.save();
          } else if (!existingUser.provider) {
            // Link existing email user with OAuth
            existingUser.provider = account.provider;
            existingUser.providerId = profile.sub || profile.id;
            existingUser.avatar = user.image;
            existingUser.isVerified = true;
            
            await existingUser.save();
          }
          
          return true;
        } catch (error) {
          console.error("OAuth signin error:", error);
          return false;
        }
      }
      
      return true;
    }
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
