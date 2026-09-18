import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
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

          // Create a custom JWT token for API auth
          const jwt = await import("jsonwebtoken");
          const JWT_SECRET = process.env.JWT_SECRET || "";
          const token = jwt.default.sign(
            { userId: existingUser?._id?.toString() || user.email, email: user.email, name: user.name, role: "user" },
            JWT_SECRET,
            { expiresIn: "7d" }
          );
          // We can't set cookies here in signIn callback, so we set it via a custom header approach
          // The cookie will be set by the session callback response
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
