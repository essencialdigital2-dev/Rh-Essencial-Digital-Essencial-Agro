import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Confirma que o usuario autenticado na sessao realmente pertence a
// empresa_id que ele esta pedindo. Sem isso, qualquer usuario logado podia
// trocar o empresa_id na URL e ler dados de ISHO/risco de outra empresa.
export async function empresaPertenceAoUsuario(empresaId: string): Promise<boolean> {
  const cookieStore = await cookies()
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set(name, value, options) } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set(name, '', { ...options, maxAge: 0 }) } catch {}
        },
      },
    }
  )

  const { data: { user } } = await sb.auth.getUser()
  if (!user) return false

  const { data: profile } = await sb.from('profiles').select('empresa_id').eq('id', user.id).single()
  return profile?.empresa_id === empresaId
}
