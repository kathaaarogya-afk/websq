import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const { connectDB } = await import("@/lib/mongodb");
          const { default: User } = await import("@/models/User");
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              bio: "",
              role: "user",
              active: true,
            });
          } else if (user.image && existingUser.image !== user.image) {
            existingUser.image = user.image;
            await existingUser.save();
          }
        } catch (error) {
          console.error("Google sign-in DB error:", error);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.AUTH_SECRET,
});
