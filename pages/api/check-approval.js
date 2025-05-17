import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY ? "Set" : "Not set");
    console.log("clerkClient:", clerkClient);

    const { userId } = getAuth(req);
    
    if (!userId) {
      console.log("No userId in auth");
      return res.status(401).json({ error: "Не авторизован" });
    }
    
    const user = await clerkClient.users.getUser(userId);
    const isApproved = user.publicMetadata?.approved === true;
    
    console.log(`User ${userId} approval status: ${isApproved}`);
    
    return res.status(200).json({ approved: isApproved });
  } catch (error) {
    console.error("Check approval error:", error);
    res.status(500).json({ error: "server_error", message: error.message });
  }
}