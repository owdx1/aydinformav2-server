import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: ["/shop"]
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/admin', '/(api|trpc)(.*)'],
};