import { clerkMiddleware } from "@clerk/nextjs/server";

// Эта middleware будет применяться ко всем маршрутам, кроме перечисленных в publicRoutes
export default clerkMiddleware({
  // Маршруты, которые будут доступны без авторизации
  publicRoutes: [
    '/', // Ваша главная страница
    '/admin', // Если '/admin' действительно должен быть публичным
    '/debug', // Если '/debug' должен быть публичным
    '/api/approve', // API маршрут для одобрения
    '/api/check-approval', // API маршрут для проверки одобрения
  ],
});

// Конфигурация matcher для определения маршрутов, к которым применяется middleware
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};