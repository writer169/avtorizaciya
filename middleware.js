// Обратите внимание: middleware.js должен быть в корне проекта, НЕ в папке pages
// Структура должна быть такой:
//
// project-root/
// ├── middleware.js  <-- этот файл должен быть здесь
// ├── pages/
// │   ├── _app.js
// │   ├── index.js
// │   └── ...
// ├── package.json
// └── ...

import { NextResponse } from 'next/server';

// Минимальная middleware без Clerk для тестирования
export function middleware(request) {
  console.log("Middleware вызван!");
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};