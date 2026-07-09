import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ecoAutorizado } from '@/lib/ecoAuth'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const PRODUTOS: Record<string, { nome: string; pitch: string; alvo: string }> = {
  edu:    { nome: 'Essencial Edu', pitch: 'inteligencia educacional com indices proprietarios e IA que compreende cada aluno, previne evasao e engaja familias', alvo: 'diretores e mantenedores de escolas privadas' },
  teens:  { nome: 'Essencial Teens', pitch: 'desenvolvimento socioemocional para fundamental II e medio, alinhado a BNCC, com alertas de risco', alvo: 'diretores e coordenadores de escolas privadas' },
  estudo: { nome: 'Essencial Estudo', pitch: 'plataforma de estudo com IA para ENEM, concursos, OAB e residencia', alvo: 'cursinhos e influenciadores de educacao' },
  med:    { nome: 'Essencial Med', pitch: 'preparacao medica com IA, questoes comentadas e trilhas personalizadas', alvo: 'estudantes de medicina e cursinhos medicos' },
  juridico: { nome: 'Essencial Juridico', pitch: 'preparacao para OAB e concursos juridicos com IA', alvo: 'estudantes de direito e cursinhos juridicos' },
  sense:  { nome: 'Essencial Sense AI', pitch: 'inteligencia organizacional com ISHO e paineis de gestao humana', alvo: 'gestores de RH e donos de empresas' },
  rh:     { nome: 'RH Essencial Digital', pitch: 'gestao humanizada de pessoas com IA', alvo: 'gestores de RH' },
  nexo:   { nome: 'NexoPerform', pitch: 'assessment comportamental proprietario com 6 arquetipos', alvo: 'consultores de RH e lideres' },
  agro:   { nome: 'Essencial Agro Tech', pitch: 'inteligencia humana para o agro: DISC, neuroinclusao, NR-31 e clima', alvo: 'produtores rurais, cooperativas e RH agro' },
}

// GET: lista de leads (todo o ecossistema, sem IA, carregamento rapido)
export async function GET(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  try {
    const db = sb()
    const { data: leads } = await db.from('edu_leads_maquina').select('*').order('criado_em', { ascending: false }).limit(200)
    return NextResponse.json({ leads: leads || [] })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}

async function pesquisarAlvo(alvo: string) {
  try {
    const g = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Pesquise sobre "${alvo}" no Brasil. Resuma em ate 250 palavras: o que e, porte, localizacao, proposta pedagogica ou de negocio, diferenciais que divulgam, noticias recentes relevantes, e liste contatos publicos (site, telefone, whatsapp, email, instagram) se encontrar.` }] }],
          tools: [{ google_search: {} }],
        }),
      }
    )
    const gd = await g.json()
    return gd.candidates?.[0]?.content?.parts?.map((pt: any) => pt.text).filter(Boolean).join('\n') ?? ''
  } catch { return '' }
}

async function gerarAbordagem(p: { nome: string; pitch: string; alvo: string }, alvo: string, contato: string | undefined, pesquisa: string) {
  const prompt = `Voce e especialista em prospeccao consultiva E em analise preditiva de vendas B2B da Essencial Digital. Sem travessoes, acentuacao correta. PROIBIDO parecer template.

PRODUTO: ${p.nome} (${p.pitch})
PUBLICO TIPICO: ${p.alvo}
ALVO DA PROSPECCAO: ${alvo}
CONTATO (se conhecido): ${contato || 'nao informado'}

PESQUISA NA WEB SOBRE O ALVO:
${pesquisa || 'Nada encontrado. Crie abordagem baseada no perfil tipico do publico, sem inventar fatos.'}

Retorne APENAS JSON valido:
{
  "score_preditivo": numero de 0 a 100 (probabilidade estimada de conversao, baseada em porte, sinais encontrados na pesquisa e fit com o produto),
  "temperatura": "quente" | "morno" | "frio",
  "justificativa_score": "por que esse score, em 1-2 frases, citando sinais concretos",
  "gancho": "o fato ou angulo especifico usado como abertura",
  "email": { "assunto": "assunto curto", "corpo": "email de prospeccao ate 130 palavras, assinado Alana Carvalho, fundadora da Essencial Digital" },
  "whatsapp": "mensagem de WhatsApp ate 60 palavras",
  "roteiro_ligacao": ["abertura em 1 frase", "pergunta de descoberta", "conexao com a dor", "pedido da reuniao"],
  "melhor_horario": "sugestao de dia e horario",
  "contatos_publicos": { "site": "", "telefone": "", "email": "", "instagram": "" },
  "objecao_provavel": { "objecao": "", "resposta": "" }
}`

  const g2 = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
  )
  const gd2 = await g2.json()
  const raw = gd2.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  return JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
}

// Descobre N alvos reais na web para o produto, sem precisar digitar nome
async function descobrirAlvos(p: { nome: string; pitch: string; alvo: string }, quantidade: number) {
  const prompt = `Busque na web e liste ${quantidade} instituicoes/empresas REAIS e distintas no Brasil que se encaixam no publico "${p.alvo}", candidatas a contratar "${p.nome}" (${p.pitch}). Varie cidade/estado. Nao invente nomes, use apenas resultados reais da busca.

Retorne APENAS um JSON array de strings com os nomes encontrados, ex: ["Nome 1", "Nome 2"]`
  const g = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], tools: [{ google_search: {} }] }),
    }
  )
  const gd = await g.json()
  const raw = gd.candidates?.[0]?.content?.parts?.map((pt: any) => pt.text).filter(Boolean).join('\n') ?? '[]'
  try {
    const match = raw.match(/\[[\s\S]*\]/)
    return match ? JSON.parse(match[0]) as string[] : []
  } catch { return [] }
}

// POST: gera abordagem personalizada + score preditivo de conversao via IA, e salva o lead
// Modo manual: { alvo, produto, contato } | Modo automatico: { produto, auto: true, quantidade? }
export async function POST(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  try {
    const body = await req.json()
    const { produto } = body
    if (!produto || !PRODUTOS[produto]) {
      return NextResponse.json({ error: 'produto obrigatorio' }, { status: 400 })
    }
    const p = PRODUTOS[produto]
    const db = sb()

    if (body.auto) {
      const quantidade = Math.min(body.quantidade || 5, 10)
      const alvos = await descobrirAlvos(p, quantidade)
      if (!alvos.length) return NextResponse.json({ error: 'IA nao encontrou alvos reais agora. Tente de novo em instantes.' }, { status: 500 })

      const gerados: any[] = []
      for (const alvo of alvos) {
        try {
          const pesquisa = await pesquisarAlvo(alvo)
          const abordagem = await gerarAbordagem(p, alvo, undefined, pesquisa)
          const { data: lead, error } = await db.from('edu_leads_maquina').insert({
            produto,
            nome: alvo,
            instituicao: alvo,
            email: abordagem?.contatos_publicos?.email || null,
            telefone: abordagem?.contatos_publicos?.telefone || null,
            origem: 'ecossistema_auto',
            score: abordagem?.score_preditivo ?? null,
            temperatura: abordagem?.temperatura ?? null,
            abordagem_ia: { ...abordagem, pesquisa },
            analise_ia: { resumo: abordagem?.justificativa_score || `Prospeccao automatica: ${alvo}`, pesquisa_web: !!pesquisa },
            status: 'novo',
          }).select().single()
          if (!error) gerados.push(lead)
        } catch (e) {
          console.error('Erro ao gerar lead automatico para', alvo, e)
        }
      }
      return NextResponse.json({ ok: true, total: gerados.length, leads: gerados })
    }

    const { alvo, contato } = body
    if (!alvo) return NextResponse.json({ error: 'alvo obrigatorio' }, { status: 400 })

    const pesquisa = await pesquisarAlvo(alvo)
    const abordagem = await gerarAbordagem(p, alvo, contato, pesquisa)

    const { data: lead, error } = await db.from('edu_leads_maquina').insert({
      produto,
      nome: contato || alvo,
      instituicao: alvo,
      email: abordagem?.contatos_publicos?.email || null,
      telefone: abordagem?.contatos_publicos?.telefone || null,
      origem: 'ecossistema',
      score: abordagem?.score_preditivo ?? null,
      temperatura: abordagem?.temperatura ?? null,
      abordagem_ia: { ...abordagem, pesquisa },
      analise_ia: { resumo: abordagem?.justificativa_score || `Prospeccao: ${alvo}`, pesquisa_web: !!pesquisa },
      status: 'novo',
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, lead_id: lead.id, abordagem, pesquisa_encontrada: !!pesquisa })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
