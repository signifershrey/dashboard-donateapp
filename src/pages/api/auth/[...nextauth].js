// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// const users = [
//   {
//     id: 1,
//     name: "Admin User",
//     email: "admin@example.com",
//     password: "adminpass",
//     role: "admin",
//   },
//   {
//     id: 2,
//     name: "Regular User",
//     email: "user@example.com",
//     password: "userpass",
//     role: "user",
//   },
// ];

// export default NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         const user = users.find(
//           (u) =>
//             u.email === credentials.email && u.password === credentials.password
//         );
//         return user || null; // Return user object if found
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role; // Attach role to the token
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.role = token.role; // Attach role to the session
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/login", // Redirect to login page
//     error: "/login?error=CredentialsSignIn", // Redirect to login page on error
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../lib/mongodb";
import User from "../../../app/models/User";
import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase(); // Connect to MongoDB

        const user = await User.findOne({ email: credentials.email });
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return {
            id: user._id,
            email: user.email,
            role: user.role,
          };
        }

        return null; // Return null if authentication failed
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Add role to the token
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role; // Add role to the session
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login?error=CredentialsSignIn",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
