import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

const ROTAS_PROTEGIDAS = ['/sense-app', '/sense-colab']
const LOGIN_URL = '/sense-login'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!ROTAS_PROTEGIDAS.some(r => pathname.startsWith(r))) {
    return NextResponse.next()
  }

  const res = NextResponse.next()

  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return req.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set(name, value, options)
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )

  const { data: { session } } = await sb.auth.getSession()

  if (!session) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = LOGIN_URL
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return res
}

export const config = {
  matcher: ['/sense-app', '/sense-app/:path*', '/sense-colab', '/sense-colab/:path*'],
}
