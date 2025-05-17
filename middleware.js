import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from 'next/server';

// Эта функция запускается перед каждым запросом к вашему приложению
export default authMiddleware({
  // Публичные маршруты, доступные без аутентификации
  publicRoutes: ["/", "/api/approve", "/api/check-approval", "/admin", "/debug"],
  
  // Функция для настройки поведения middleware
  afterAuth(auth, req) {
    // Если пользователь не авторизован или маршрут публичный, пропускаем
    if (!auth.userId || auth.isPublicRoute) {
      return NextResponse.next();
    }
    
    // Если пользователь авторизован, мы позволяем запросу продолжиться
    return NextResponse.next();
  },
});

// Конфигурация, какие маршруты обрабатывать
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};