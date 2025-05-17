import { auth } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

// Используем новый асинхронный подход к middleware
export default async function middleware(request) {
  // Получаем объект авторизации
  const { userId, sessionId, getToken } = await auth({ request });
  
  const url = new URL(request.url);
  
  // Публичные маршруты, доступные всем
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/favicon.ico') ||
    url.pathname === '/' ||
    url.pathname === '/admin' ||
    url.pathname === '/debug'
  ) {
    return NextResponse.next();
  }
  
  // Разрешаем доступ к API endpoints
  if (url.pathname === '/api/approve' || 
      url.pathname === '/api/check-approval') {
    return NextResponse.next();
  }
  
  // Если пользователь не авторизован и пытается получить доступ к защищенному маршруту
  // В текущей реализации все запросы обрабатываются API роутами, поэтому просто пропускаем
  return NextResponse.next();
}

// Конфигурация, какие маршруты обрабатывать
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};