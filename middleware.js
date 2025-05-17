import { NextResponse } from 'next/server';

// Вспомогательная функция для получения JWT токена из cookie
function getAuthToken(req) {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  
  // Получаем __session cookie, который содержит JWT токен Clerk
  return cookies['__session'] || '';
}

export async function middleware(request) {
  const url = new URL(request.url);
  
  // Пропускаем публичные пути
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/favicon.ico') ||
    url.pathname === '/'
  ) {
    return NextResponse.next();
  }
  
  // Admin API не проверяем
  if (url.pathname.startsWith('/api/approve')) {
    return NextResponse.next();
  }
  
  const token = getAuthToken(request);
  
  // Если нет токена, перенаправляем на страницу входа
  if (!token) {
    return NextResponse.redirect(new URL('/', url.origin));
  }
  
  try {
    // Используем собственное API для проверки статуса пользователя
    // Так как у нас нет прямого доступа к userId, создадим новый эндпоинт
    const apiUrl = new URL('/api/check-approval', url.origin);
    const response = await fetch(apiUrl, {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });
    
    if (!response.ok) {
      const data = await response.json();
      if (data.error === 'not_approved') {
        return new Response("Ожидается одобрение администратора", { status: 403 });
      }
      
      // Другие ошибки
      return NextResponse.next();
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images|api/check-approval).*)'],
};