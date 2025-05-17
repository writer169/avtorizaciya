import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  const { userId } = auth(req);
  const currentUser = await clerkClient.users.getUser(userId);

  const isAdmin =
    currentUser.primaryEmailAddress.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!isAdmin) return res.status(403).json({ error: "Нет доступа" });

  if (req.method === "GET") {
    const allUsers = await clerkClient.users.getUserList();
    const pending = allUsers.filter((u) => u.publicMetadata?.approved !== true);
    return res.status(200).json(pending);
  }

  if (req.method === "POST") {
    const { userId: targetId } = req.body;
    if (!targetId) return res.status(400).json({ error: "Нет ID" });

    await clerkClient.users.updateUserMetadata(targetId, {
      publicMetadata: { approved: true },
    });

    return res.status(200).json({ success: true });
  }

  res.status(405).end(); // Method Not Allowed
}