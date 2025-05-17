import { clerkMiddleware } from "@clerk/nextjs";
import { NextResponse } from 'next/server';

// Используем clerkMiddleware для аутентификации
export default clerkMiddleware({
  // Определяем публичные пути
  publicRoutes: [
    '/',
    '/admin',
    '/debug',
    '/api/approve',
    '/api/check-approval'
  ],
  
  // Опционально: обработка после аутентификации
  afterAuth(auth, req, evt) {
    return NextResponse.next();
  },
});

// Конфигурация, какие маршруты обрабатывать
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};