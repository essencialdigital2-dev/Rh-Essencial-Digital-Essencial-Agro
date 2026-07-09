export const PRODUTOS_RADAR: Record<string, { nome: string; contexto: string }> = {
  edu:      { nome: 'Essencial Edu', contexto: 'inteligencia educacional para escolas privadas brasileiras (indices IDE/IAE/IBE/IIE/IPE, IA que compreende cada aluno)' },
  teens:    { nome: 'Essencial Teens', contexto: 'desenvolvimento socioemocional para fundamental II e medio, alinhado a BNCC' },
  estudo:   { nome: 'Essencial Estudo', contexto: 'plataforma de estudo B2C com IA para ENEM e concursos' },
  med:      { nome: 'Essencial Med', contexto: 'preparacao medica com IA, questoes comentadas e trilhas personalizadas' },
  juridico: { nome: 'Essencial Juridico', contexto: 'preparacao para OAB e concursos juridicos com IA' },
  sense:    { nome: 'Essencial Sense AI', contexto: 'inteligencia organizacional com ISHO, saude mental e conformidade NR-1' },
  nexo:     { nome: 'NexoPerform', contexto: 'assessment comportamental DISC proprietario com 6 arquetipos' },
  agro:     { nome: 'Essencial Agro Tech', contexto: 'inteligencia humana para o agronegocio: DISC, neuroinclusao, NR-31, clima organizacional' },
}

export async function gerarRadarProduto(produtoKey: string) {
  const p = PRODUTOS_RADAR[produtoKey]
  if (!p) throw new Error('produto invalido')

  // 1. Pesquisa real na web
  let pesquisa = ''
  try {
    const g = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Pesquise as tendencias mais recentes (ultimos 6 meses) no Brasil sobre: ${p.contexto}. Busque: novas regulamentacoes, movimentos de concorrentes, tecnologias emergentes, dores que o publico esta discutindo, e dados de mercado. Resuma em ate 400 palavras com fatos e fontes.` }] }],
          tools: [{ google_search: {} }],
        }),
      }
    )
    const gd = await g.json()
    pesquisa = gd.candidates?.[0]?.content?.parts?.map((pt: any) => pt.text).filter(Boolean).join('\n') ?? ''
  } catch { pesquisa = '' }

  // 2. Radar acionavel
  const prompt = `Voce e o conselheiro de inovacao da Essencial Digital. Com base na pesquisa de mercado abaixo, gere um radar preditivo acionavel para a fundadora. Sem travessoes, acentuacao correta, zero generalidades.

PRODUTO: ${p.nome}
CONTEXTO: ${p.contexto}

PESQUISA DE MERCADO REAL (web, ultimos meses):
${pesquisa || 'Pesquisa indisponivel. Use conhecimento consolidado do setor, sinalizando que sao tendencias estruturais.'}

Retorne APENAS JSON valido:
{
  "resumo_mercado": "o momento do mercado deste produto em 2 frases",
  "tendencias": [
    { "titulo": "tendencia 1", "descricao": "o que esta acontecendo e a evidencia", "urgencia": "alta" | "media" | "baixa" }
  ],
  "oportunidades_produto": [
    { "funcionalidade": "o que construir", "por_que": "qual tendencia ou dor justifica", "esforco": "pequeno" | "medio" | "grande" }
  ],
  "ameacas": ["ameaca competitiva ou regulatoria 1"],
  "aposta_do_conselheiro": "se so pudesse fazer UMA inovacao nos proximos 60 dias neste produto, qual seria e por que"
}
Limite: 3 tendencias, 3 oportunidades, 2 ameacas.`

  const g2 = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
  )
  const gd2 = await g2.json()
  const raw = gd2.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  const radar = JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())

  return { radar, pesquisaWeb: !!pesquisa, nomeProduto: p.nome }
}
