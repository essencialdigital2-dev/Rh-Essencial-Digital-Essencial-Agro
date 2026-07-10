import { NextResponse, type NextRequest } from 'next/server'

// /sense-app e /sense-colab sao paginas client-side que guardam a sessao no
// localStorage (nao em cookie), e a propria sense-app.html ja verifica a
// sessao antes de carregar. Um middleware que checa sessao via cookie aqui
// nunca encontra nada e derruba o usuario de volta pro login mesmo logado
// corretamente — por isso essas rotas nao passam mais por gate aqui.
export async function middleware(_req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
