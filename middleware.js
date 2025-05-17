import { withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Функция для проверки, является ли путь публичным
function isPublic(path) {
  return (
    path.startsWith('/_next') ||
    path.startsWith('/favicon.ico') ||
    path === '/' ||
    path === '/admin' ||
    path === '/debug' ||
    path === '/api/approve' ||
    path === '/api/check-approval'
  );
}

// Используем withClerkMiddleware для оборачивания нашей middleware функции
export default withClerkMiddleware((req) => {
  const { pathname } = req.nextUrl;
  
  // Проверяем, является ли путь публичным
  if (isPublic(pathname)) {
    return NextResponse.next();
  }
  
  // В противном случае проверка авторизации будет выполнена withClerkMiddleware
  return NextResponse.next();
});

// Конфигурация, какие маршруты обрабатывать
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};