import { NextResponse } from 'next/server';

export async function middleware(request) {
  const url = new URL(request.url);
  
  // Разрешаем доступ к публичным маршрутам
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/favicon.ico') ||
    url.pathname === '/' ||
    url.pathname === '/api/approve' ||
    url.pathname === '/admin'
  ) {
    return NextResponse.next();
  }
  
  // Проверяем одобрение пользователя через наш API-эндпоинт
  try {
    const approvalCheckUrl = new URL('/api/check-approval', url.origin);
    const response = await fetch(approvalCheckUrl, {
      headers: {
        cookie: request.headers.get('cookie') || '',
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
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images).*)'],
};