import { NextResponse } from 'next/server'
import { PRODUTOS, pesquisarAlvo, gerarAbordagem } from '@/lib/eco-leads-core'

export async function GET() {
  const alvo = 'Colegio Santo Agostinho Belo Horizonte'
  const p = PRODUTOS.edu
  try {
    const pesquisa = await pesquisarAlvo(alvo)
    let abordagemErro = null
    let abordagem = null
    let rawTexto = ''
    try {
      const g2 = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: `Voce e especialista em prospeccao consultiva E em analise preditiva de vendas B2B da Essencial Digital. Sem travessoes, acentuacao correta. PROIBIDO parecer template.

PRODUTO: ${p.nome} (${p.pitch})
PUBLICO TIPICO: ${p.alvo}
ALVO DA PROSPECCAO: ${alvo}
CONTATO (se conhecido): nao informado

PESQUISA NA WEB SOBRE O ALVO:
${pesquisa || 'Nada encontrado.'}

Retorne APENAS JSON valido:
{"score_preditivo": 0, "temperatura": "morno", "justificativa_score": "", "gancho": "", "email": {"assunto":"","corpo":""}, "whatsapp":"", "roteiro_ligacao":[], "melhor_horario":"", "contatos_publicos":{"site":"","telefone":"","email":"","instagram":""}, "objecao_provavel":{"objecao":"","resposta":""}}` }] }] }) }
      )
      const gd2 = await g2.json()
      rawTexto = gd2.candidates?.[0]?.content?.parts?.[0]?.text ?? JSON.stringify(gd2)
      abordagem = JSON.parse(rawTexto.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
    } catch (e: unknown) {
      abordagemErro = e instanceof Error ? e.message : String(e)
    }
    return NextResponse.json({ pesquisa_len: pesquisa.length, pesquisa_preview: pesquisa.slice(0, 200), raw_texto: rawTexto, abordagem, abordagemErro })
  } catch (e: unknown) {
    return NextResponse.json({ erro: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
