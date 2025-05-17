import { getAuth, clerkClient } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY ? "Set" : "Not set");
    console.log("clerkClient:", clerkClient);
    console.log("clerkClient.users:", clerkClient?.users);

    if (!clerkClient || !clerkClient.users) {
      console.error("clerkClient or clerkClient.users is undefined");
      return res.status(500).json({
        error: "Clerk initialization failed",
        details: {
          clerkClient: !!clerkClient,
          clerkClientUsers: !!clerkClient?.users,
          secretKeySet: !!process.env.CLERK_SECRET_KEY,
        },
      });
    }

    const { userId } = getAuth(req);
    
    if (!userId) {
      console.log("No userId in auth");
      return res.status(401).json({ error: "Не авторизован" });
    }
    
    const currentUser = await clerkClient.users.getUser(userId);
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    
    console.log("Current user email:", currentUser.primaryEmailAddress?.emailAddress);
    console.log("Admin email from env:", adminEmail);
    
    const isAdmin = currentUser.primaryEmailAddress?.emailAddress === adminEmail;
    
    if (!isAdmin) {
      console.log("User is not admin");
      return res.status(403).json({ error: "Нет доступа" });
    }
    
    if (req.method === "GET") {
      console.log("Getting user list");
      const allUsers = await clerkClient.users.getUserList({
        limit: 100,
      });
      
      console.log(`Fetched ${allUsers.length} users`);
      
      const pending = allUsers.filter(u => u.publicMetadata?.approved !== true);
      
      console.log(`Found ${pending.length} pending users`);
      return res.status(200).json(pending);
    }
    
    if (req.method === "POST") {
      const { userId: targetId } = req.body;
      
      if (!targetId) {
        console.log("No targetId in request body");
        return res.status(400).json({ error: "Нет ID пользователя" });
      }
      
      console.log(`Approving user ${targetId}`);
      
      await clerkClient.users.updateUser(targetId, {
        publicMetadata: { approved: true },
      });
      
      console.log(`User ${targetId} approved successfully`);
      return res.status(200).json({ success: true });
    }
    
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    
  } catch (error) {
    console.error("Error in /api/approve:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера", message: error.message });
  }
}