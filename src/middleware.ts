// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    // allow /login and /register unauthenticated
    authorized: ({ req, token }) =>
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register") ||
      !!token,
  },
});

export const config = { matcher: ["/new", "/chat/:path*"] };
