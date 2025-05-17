import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from 'next/server';

// Создаем промежуточное ПО с обновленным синтаксисом
export default authMiddleware({
  publicRoutes: [
    '/',
    '/admin',
    '/debug',
    '/_next(.*)',
    '/favicon.ico',
    '/api/approve',
    '/api/check-approval',
  ],
  
  // Необязательная функция для выполнения дополнительной логики
  afterAuth(auth, req) {
    // Здесь можно добавить дополнительную логику, если нужно
    return NextResponse.next();
  }
});

// Конфигурация, какие маршруты обрабатывать
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};