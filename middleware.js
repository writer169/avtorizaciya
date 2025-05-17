import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Определяем публичные маршруты
const isPublicRoute = createRouteMatcher([
  '/',
  '/admin',
  '/debug',
  '/api/check-approval',
  // '/api/approve' исключен, если он должен быть защищенным
]);

export default clerkMiddleware((auth, req) => {
  // Защищаем маршруты, которые не являются публичными
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Применяем middleware ко всем маршрутам, кроме статических файлов и _next
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};