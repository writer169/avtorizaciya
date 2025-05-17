import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    
    const user = await clerkClient.users.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'user_not_found' });
    }
    
    if (user.publicMetadata?.approved !== true) {
      return res.status(403).json({ error: 'not_approved' });
    }
    
    return res.status(200).json({ approved: true });
  } catch (error) {
    console.error('Check approval error:', error);
    return res.status(500).json({ error: 'server_error' });
  }
}