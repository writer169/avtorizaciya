import { NextResponse } from 'next/server';
import { clerkMiddleware, getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

// This function runs Clerk middleware first, then your custom middleware
export default function middleware(request) {
  // Run Clerk middleware first
  return clerkMiddleware()(request, async () => {
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
    
    // Разрешаем доступ к API endpoints без проверки approval
    if (url.pathname === '/api/approve') {
      return NextResponse.next();
    }
    
    // Получаем информацию об аутентификации
    const auth = getAuth(request);
    
    // Если пользователь не авторизован, пропускаем и позволим Clerk обработать
    if (!auth.userId) {
      return NextResponse.next();
    }
    
    // Для авторизованных пользователей проверяем одобрение через API
    try {
      // Проверяем одобрение пользователя через наш API-эндпоинт
      const approvalCheckUrl = new URL('/api/check-approval', url.origin);
      const response = await fetch(approvalCheckUrl, {
        headers: {
          // Передаем заголовки аутентификации
          cookie: request.headers.get('cookie') || '',
          authorization: request.headers.get('authorization') || '',
        },
      });
      
      // Если статус 403, значит пользователь не одобрен
      if (response.status === 403) {
        return new Response("Ожидается одобрение администратора. Пожалуйста, свяжитесь с администратором.", { 
          status: 403,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
      
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware error:', error);
      // В случае ошибки лучше пропустить пользователя
      return NextResponse.next();
    }
  });
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images).*)', '/api/(.*)', '/'],
};