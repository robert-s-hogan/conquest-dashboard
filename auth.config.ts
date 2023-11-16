import NextAuth from "next-auth";

interface CustomAuthType {
  user: {
    // Define the structure based on your user object
    id: string;
    name: string;
    email: string;
    // ...other user properties
  };
}

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({
      auth,
      request: { nextUrl },
    }: {
      auth: CustomAuthType;
      request: { nextUrl: URL };
    }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
};

export default NextAuth(authConfig);
