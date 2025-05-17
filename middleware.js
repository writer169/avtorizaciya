import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  beforeAuth: async (req, evt) => {
    const { user } = req.auth;
    if (!user) return;

    const { userId } = req.auth;
    const res = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });
    const userData = await res.json();

    if (userData.public_metadata?.approved !== true) {
      return new Response("Ожидается одобрение администратора", { status: 403 });
    }
  },
});

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};