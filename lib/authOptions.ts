import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./dbConfig";
import bcrypt from "bcryptjs";
import User from "@/models/user.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      
      name: "Credintials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or Password");
        }
        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found with these credentials");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account first");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          return {
            id:user._id.toString(),
            email:user.email
          };
        } catch (error) {
            throw error
        }
      },
    }),
  ],
  callbacks:{
    async jwt({user, token}){
      if(user){
        token.id = user.id
        }
        return token
    },
    async session({session, token}){

        if(session.user){
            session.user.id = token.id as string
        }
        return session
    }
  },

  pages:{
    signIn: "/login",
    error: "/login",
    
  },
  session:{
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET
};
