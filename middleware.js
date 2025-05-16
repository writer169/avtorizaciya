// middleware.js
import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware();

export const config = {
  matcher: ["/protected/(.*)", "/dashboard"],
};