import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Tenta pegar o token dos cookies
  const token = request.cookies.get('gamelog_token')?.value;

  // 2. Define quais rotas são de autenticação (Login/Register)
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');

  // CENÁRIO A: Usuário NÃO tem token e tenta acessar página protegida
  // (Qualquer página que NÃO seja de auth e NÃO seja pública)
  if (!token && !isAuthPage) {
    // Redireciona para o login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // CENÁRIO B: Usuário JÁ TEM token e tenta acessar Login ou Registro
  // (Não faz sentido logar de novo se já está logado)
  if (token && isAuthPage) {
    // Redireciona para o dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Se estiver tudo certo, deixa passar
  return NextResponse.next();
}

// Configuração: Diz ao Next.js em quais rotas esse middleware deve rodar
export const config = {
  matcher: [
    // Protege estas rotas:
    '/dashboard/:path*', 
    '/games/:path*', 
    '/search/:path*',
    
    // Intercepta estas também para o Cenário B:
    '/login', 
    '/register'
  ],
};