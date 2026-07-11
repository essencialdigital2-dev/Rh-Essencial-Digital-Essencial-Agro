import { NextResponse } from 'next/server'
import { PRODUTOS, sbEcoLeads, descobrirAlvos, pesquisarAlvo, gerarAbordagem } from '@/lib/eco-leads-core'

export async function GET() {
  const passos: any = {}
  try {
    const alvos = await descobrirAlvos(PRODUTOS.edu, 3)
    passos.alvos_encontrados = alvos

    if (!alvos.length) {
      return NextResponse.json({ passos, conclusao: 'descobrirAlvos retornou vazio — falha na descoberta' })
    }

    const alvo = alvos[0]
    let pesquisa = ''
    try {
      pesquisa = await pesquisarAlvo(alvo)
      passos.pesquisa_ok = true
      passos.pesquisa_len = pesquisa.length
    } catch (e: unknown) {
      passos.pesquisa_erro = e instanceof Error ? e.message : String(e)
    }

    let abordagem = null
    try {
      abordagem = await gerarAbordagem(PRODUTOS.edu, alvo, undefined, pesquisa)
      passos.abordagem_ok = true
    } catch (e: unknown) {
      passos.abordagem_erro = e instanceof Error ? e.message : String(e)
      return NextResponse.json({ passos, conclusao: 'gerarAbordagem falhou' })
    }

    try {
      const db = sbEcoLeads()
      const { data: lead, error } = await db.from('edu_leads_maquina').insert({
        produto: 'edu',
        nome: alvo,
        instituicao: alvo,
        email: abordagem?.contatos_publicos?.email || null,
        telefone: abordagem?.contatos_publicos?.telefone || null,
        origem: 'debug_teste',
        score: abordagem?.score_preditivo ?? null,
        temperatura: abordagem?.temperatura ?? null,
        abordagem_ia: { ...abordagem, pesquisa },
        analise_ia: { resumo: abordagem?.justificativa_score || `teste debug: ${alvo}`, pesquisa_web: !!pesquisa },
        status: 'novo',
      }).select().single()
      passos.insert_ok = !error
      passos.insert_erro = error?.message || null
      passos.lead_id = lead?.id || null
    } catch (e: unknown) {
      passos.insert_excecao = e instanceof Error ? e.message : String(e)
    }

    return NextResponse.json({ passos, conclusao: 'pipeline completo executado' })
  } catch (e: unknown) {
    return NextResponse.json({ erro: e instanceof Error ? e.message : String(e), passos }, { status: 500 })
  }
}
