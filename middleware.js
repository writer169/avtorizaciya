import { clerkMiddleware } from "@clerk/nextjs/server";

// Определяем публичные маршруты
export default clerkMiddleware({
  publicRoutes: [
    '/',
    '/admin',
    '/debug',
    '/api/check-approval',
    // '/api/approve' исключен, так как он должен быть защищенным
  ],
});

export const config = {
  matcher: [
    // Применяем middleware ко всем маршрутам, кроме статических файлов и _next
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};