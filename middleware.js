import { NextResponse } from 'next/server';
import { withClerkMiddleware, getAuth } from '@clerk/nextjs/server';

export default withClerkMiddleware(async (req) => {
  const { userId } = getAuth(req);
  
  // Если пользователь не аутентифицирован, пропускаем проверку
  if (!userId) {
    return NextResponse.next();
  }

  // Проверяем статус одобрения
  try {
    const res = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });
    
    if (!res.ok) {
      return NextResponse.next();
    }
    
    const userData = await res.json();
    
    if (userData.public_metadata?.approved !== true) {
      return new Response("Ожидается одобрение администратора", { status: 403 });
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error("Ошибка в middleware:", error);
    return NextResponse.next();
  }
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/approve).*)'],
};