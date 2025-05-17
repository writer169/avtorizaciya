import { clerkClient } from "@clerk/nextjs/server";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    // Получаем информацию о текущем пользователе
    const { userId } = getAuth(req);
    
    if (!userId) {
      console.log("No userId in auth");
      return res.status(401).json({ error: "Не авторизован" });
    }
    
    const currentUser = await clerkClient.users.getUser(userId);
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    
    console.log("Current user email:", currentUser.primaryEmailAddress?.emailAddress);
    console.log("Admin email from env:", adminEmail);
    
    // Проверяем, является ли пользователь администратором
    const isAdmin = currentUser.primaryEmailAddress?.emailAddress === adminEmail;
    
    if (!isAdmin) {
      console.log("User is not admin");
      return res.status(403).json({ error: "Нет доступа" });
    }
    
    // GET запрос для получения списка пользователей
    if (req.method === "GET") {
      console.log("Getting user list");
      const allUsers = await clerkClient.users.getUserList({
        limit: 100, // Ограничиваем количество для производительности
      });
      
      console.log(`Fetched ${allUsers.length} users`);
      
      // Фильтруем пользователей, которые не одобрены
      const pending = allUsers.filter(u => u.publicMetadata?.approved !== true);
      
      console.log(`Found ${pending.length} pending users`);
      return res.status(200).json(pending);
    }
    
    // POST запрос для одобрения пользователя
    if (req.method === "POST") {
      const { userId: targetId } = req.body;
      
      if (!targetId) {
        console.log("No targetId in request body");
        return res.status(400).json({ error: "Нет ID пользователя" });
      }
      
      console.log(`Approving user ${targetId}`);
      
      // Обновляем метаданные пользователя, устанавливая флаг approved
      await clerkClient.users.updateUser(targetId, {
        publicMetadata: { approved: true },
      });
      
      console.log(`User ${targetId} approved successfully`);
      return res.status(200).json({ success: true });
    }
    
    // Если запрос не GET и не POST, возвращаем ошибку
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    
  } catch (error) {
    console.error("Error in /api/approve:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера", message: error.message });
  }
}