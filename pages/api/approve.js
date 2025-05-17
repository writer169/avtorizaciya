import { getAuth, clerkClient } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    console.log("clerkClient:", clerkClient);
    console.log("clerkClient.users:", clerkClient?.users);
    console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY ? "Set" : "Not set");

    if (!clerkClient || !clerkClient.users) {
      console.error("clerkClient or clerkClient.users is undefined");
      return res.status(500).json({ error: "Clerk initialization failed" });
    }

    const { userId } = getAuth(req);
    
    if (!userId) {
      console.log("No userId in auth");
      return res.status(401).json({ error: "Не авторизован" });
    }
    
    const currentUser = await clerkClient.users.getUser(userId);
    // ... остальной код без изменений ...
  } catch (error) {
    console.error("Error in /api/approve:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера", message: error.message });
  }
}