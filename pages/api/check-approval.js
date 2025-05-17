import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs";

export default async function handler(req, res) {
  try {
    // Используем auth()
    const { userId } = auth();
    
    if (!userId) {
      console.log("No userId found in auth");
      return res.status(401).json({ error: 'unauthorized' });
    }
    
    const user = await clerkClient.users.getUser(userId);
    
    if (!user) {
      console.log(`User not found for ID: ${userId}`);
      return res.status(404).json({ error: 'user_not_found' });
    }
    
    console.log(`User metadata for ${userId}:`, JSON.stringify(user.publicMetadata));
    
    // Проверяем, является ли пользователь администратором
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const isAdmin = user.primaryEmailAddress?.emailAddress === adminEmail;
    
    // Админы всегда одобрены
    if (isAdmin) {
      console.log(`User ${userId} is admin and automatically approved`);
      return res.status(200).json({ approved: true });
    }
    
    // Проверяем флаг одобрения для обычных пользователей
    if (user.publicMetadata?.approved !== true) {
      console.log(`User ${userId} is not approved`);
      return res.status(403).json({ error: 'not_approved' });
    }
    
    console.log(`User ${userId} is approved`);
    return res.status(200).json({ approved: true });
  } catch (error) {
    console.error('Check approval error:', error);
    return res.status(500).json({ error: 'server_error', message: error.message });
  }
}