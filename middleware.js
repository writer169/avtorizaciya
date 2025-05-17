import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Создаем матчер маршрутов
const isProtectedRoute = createRouteMatcher(['/(.*)', '/api/(.*)']);
const isApproveApiRoute = createRouteMatcher(['/api/approve']);

export default clerkMiddleware(async (req, evt) => {
  const { userId } = req.auth;
  
  // Пропускаем проверку для публичных маршрутов или если пользователь не аутентифицирован
  if (!userId || !isProtectedRoute(req)) {
    return;
  }
  
  // Позволяем доступ к API одобрения для админов
  if (isApproveApiRoute(req)) {
    return;
  }

  // Проверяем статус одобрения пользователя
  try {
    const res = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });
    
    if (!res.ok) {
      return new Response("Ошибка получения данных пользователя", { status: 500 });
    }
    
    const userData = await res.json();
    
    if (userData.public_metadata?.approved !== true) {
      return new Response("Ожидается одобрение администратора", { status: 403 });
    }
  } catch (error) {
    console.error("Ошибка в middleware:", error);
    return new Response("Произошла ошибка", { status: 500 });
  }
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};