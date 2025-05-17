import { authMiddleware } from "@clerk/nextjs";

// Эта middleware будет применяться ко всем маршрутам, кроме перечисленных в publicRoutes
export default authMiddleware({
  // Маршруты, которые будут доступны без авторизации
  publicRoutes: [
    '/', // Ваша главная страница
    '/admin', // Если '/admin' действительно должен быть публичным
    '/debug', // Если '/debug' должен быть публичным
    '/api/approve', // API маршрут для одобрения
    '/api/check-approval', // API маршрут для проверки одобрения
    // Добавьте другие публичные маршруты здесь
  ],
  // Маршруты, которые Clerk middleware будет игнорировать
  // ignoredRoutes: ['/((?!api|trpc|_next).*)'], // Пример: игнорировать все, кроме api, trpc и _next
});

// Конфигурация matcher остается прежней, если она соответствует вашим требованиям
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
