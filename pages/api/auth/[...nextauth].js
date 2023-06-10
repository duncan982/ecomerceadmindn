import NextAuth, { getServerSession } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
const adminEmails = [process.env.EMAIL];
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({ session, token, user }) => {
      // console.log("session:", session, "token:", token, "user:", user);
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      } else {
        // console.log("access denied");
        return false;
      }
    },
  },
};
export default NextAuth(authOptions);

export const isAdminRequest = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!adminEmails?.includes(session?.user?.email)) {
    throw "Not an admin";
  }
};
