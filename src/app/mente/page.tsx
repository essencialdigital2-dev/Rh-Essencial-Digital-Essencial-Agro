'use client'
import { useEffect, useState, useMemo } from 'react'

// ── TIPOS ────────────────────────────────────────────────────────────────────
type Indicador = 'burnout' | 'estresse' | 'regulacao' | 'proposito' | 'relacional' | 'equilibrio'
type Diagnostico = Record<Indicador, number>
type PulsoDia = { data: string; energia: number; disposicao: number; equilibrio: number }
type DiarioEntry = { data: string; humor: number; gatilho: string; nota: string }
type Aba = 'hoje' | 'radar' | 'pulso' | 'trilha' | 'diario' | 'proposito' | 'habitos'

// ── CONSTANTES ────────────────────────────────────────────────────────────────
const INDICADORES: { key: Indicador; label: string; emoji: string; cor: string; desc: string }[] = [
  { key: 'burnout',    label: 'Burnout',          emoji: '🔥', cor: '#ef4444', desc: 'Esgotamento emocional e físico' },
  { key: 'estresse',   label: 'Estresse',          emoji: '⚡', cor: '#f59e0b', desc: 'Pressão e sobrecarga percebida' },
  { key: 'regulacao',  label: 'Regulação',         emoji: '🧠', cor: '#6366f1', desc: 'Controle emocional sob pressão' },
  { key: 'proposito',  label: 'Propósito',         emoji: '🌱', cor: '#10b981', desc: 'Sentido e alinhamento com valores' },
  { key: 'relacional', label: 'Clima Relacional',  emoji: '🤝', cor: '#8b5cf6', desc: 'Vínculos e pertencimento na equipe' },
  { key: 'equilibrio', label: 'Equilíbrio',        emoji: '⚖️', cor: '#0ea5e9', desc: 'Vida pessoal e profissional' },
]

const PERGUNTAS: { texto: string; indicador: Indicador; invertida?: boolean }[] = [
  { texto: 'Ao final do dia, você se sente completamente esgotado emocionalmente?', indicador: 'burnout' },
  { texto: 'Você sente que não tem energia para começar as tarefas do trabalho?', indicador: 'burnout' },
  { texto: 'Você se sente sobrecarregado com as demandas do seu trabalho?', indicador: 'estresse' },
  { texto: 'Com que frequência você sente tensão física (dor de cabeça, aperto no peito)?', indicador: 'estresse' },
  { texto: 'Quando algo te frustra no trabalho, você consegue manter a calma?', indicador: 'regulacao', invertida: true },
  { texto: 'Você consegue identificar e nomear o que está sentindo no momento?', indicador: 'regulacao', invertida: true },
  { texto: 'Seu trabalho atual tem sentido para você além do salário?', indicador: 'proposito', invertida: true },
  { texto: 'Você acorda motivado na maioria dos dias?', indicador: 'proposito', invertida: true },
  { texto: 'Você se sente parte de uma equipe que se importa uns com os outros?', indicador: 'relacional', invertida: true },
  { texto: 'Você tem relacionamentos de confiança no seu ambiente de trabalho?', indicador: 'relacional', invertida: true },
  { texto: 'Você consegue desconectar do trabalho no seu tempo livre?', indicador: 'equilibrio', invertida: true },
  { texto: 'Sua vida pessoal tem sofrido por causa das demandas do trabalho?', indicador: 'equilibrio' },
]

const OPCOES = ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre']

const TRILHAS: Record<Indicador, { titulo: string; exercicios: string[] }> = {
  burnout: {
    titulo: 'Recuperação do Esgotamento',
    exercicios: [
      'Faça uma lista de 3 coisas que você fez bem hoje, por menores que sejam.',
      'Reserve 15 minutos para uma atividade que te dê prazer sem culpa.',
      'Pratique o "não" gentil: identifique uma demanda que pode ser delegada ou adiada.',
      'Escreva uma carta de autocompaixão: o que você diria a um amigo que estivesse exausto?',
      'Técnica de descompressão: 5 minutos de respiração 4-7-8 (inspire 4s, segure 7s, expire 8s).',
      'Identifique seu maior dreno de energia esta semana. O que está no seu controle?',
      'Estabeleça um ritual de fim de trabalho: feche o computador, diga "terminei por hoje".',
    ],
  },
  estresse: {
    titulo: 'Regulação do Estresse',
    exercicios: [
      'Técnica 5-4-3-2-1: nomeie 5 coisas que vê, 4 que toca, 3 que ouve, 2 que cheira, 1 que sente.',
      'Escreva por 10 minutos tudo que está na sua cabeça, sem filtro. Depois feche o caderno.',
      'Faça uma caminhada de 10 minutos sem celular. Observe o ambiente ao redor.',
      'Identifique seu estressor principal desta semana. Ele está no seu controle? Se não, solte.',
      'Progressive muscle relaxation: tensione e relaxe cada grupo muscular por 5 segundos.',
      'Pratique o "worry time": reserve 15 minutos para se preocupar, fora desse tempo pause o pensamento ansioso.',
      'Hidrate-se e faça 3 pausas de 5 minutos distribuídas no dia.',
    ],
  },
  regulacao: {
    titulo: 'Inteligência Emocional',
    exercicios: [
      'Nomeie sua emoção dominante agora com precisão: não "estou mal", mas "estou frustrado porque..."',
      'Antes de reagir a algo difícil, espere 90 segundos. A onda emocional passa.',
      'Diário de emoções: o que senti, o que causou, como reagi, o que faria diferente.',
      'Identifique um pensamento automático negativo de hoje e questione: qual a evidência?',
      'Pratique a escuta ativa em uma conversa: ouça para entender, não para responder.',
      'Escreva sobre uma emoção difícil recente sem julgamento. Só observe.',
      'Técnica TCC: situação, pensamento, emoção, comportamento. Analise um episódio.',
    ],
  },
  proposito: {
    titulo: 'Reconexão com Propósito',
    exercicios: [
      'Escreva: "O que eu faço impacta a vida de quem?" Seja específico.',
      'Liste 5 valores que são inegociáveis para você. Seu trabalho atual respeita esses valores?',
      'Relembre um momento no trabalho em que você sentiu que fez a diferença. O que aconteceu?',
      'Complete: "Daqui a 5 anos, quero ser conhecido por..." O que você está fazendo hoje nessa direção?',
      'Identifique uma contribuição pequena que você pode fazer hoje que tenha sentido real.',
      'Escreva sua declaração de propósito pessoal em uma frase. Revise até soar verdadeiro.',
      'Gratidão focada: 3 coisas do seu trabalho pelas quais você é genuinamente grato.',
    ],
  },
  relacional: {
    titulo: 'Fortalecimento de Vínculos',
    exercicios: [
      'Entre em contato com um colega que você não fala há tempo. Sem pauta, só conexão.',
      'Expresse reconhecimento genuíno para alguém da equipe hoje.',
      'Pratique vulnerabilidade segura: compartilhe algo desafiante com alguém de confiança.',
      'Observe seus padrões relacionais: você tende a se isolar ou se aproximar sob pressão?',
      'Faça uma pergunta genuína a um colega sobre como ele está. Ouça de verdade.',
      'Identifique um conflito não resolvido. Qual é o primeiro passo pequeno para abordá-lo?',
      'Celebre uma conquista de equipe, mesmo que pequena. Nomear vitórias une pessoas.',
    ],
  },
  equilibrio: {
    titulo: 'Equilíbrio Vida-Trabalho',
    exercicios: [
      'Defina um horário de desconexão digital hoje e cumpra.',
      'Liste o que você tem feito ZERO fora do trabalho. Escolha uma e faça hoje.',
      'Converse com alguém que você ama sobre algo que não seja trabalho.',
      'Revise sua semana: o tempo investido reflete o que você diz ser prioridade?',
      'Crie uma "não-lista" de trabalho: o que você vai parar de fazer fora do horário.',
      'Faça algo que seu corpo peça: alongamento, caminhada, dança, silêncio.',
      'Planeje um momento de prazer garantido para os próximos 7 dias.',
    ],
  },
}

const FE_REFLEXOES = [
  { verso: '"Tudo posso naquele que me fortalece."', ref: 'Filipenses 4:13', reflexao: 'Sua força não vem apenas de você. Há algo maior sustentando cada passo.' },
  { verso: '"A paz de Deus, que excede todo entendimento, guardará o seu coração."', ref: 'Filipenses 4:7', reflexao: 'Em meio ao caos do trabalho, a paz é possível. Ela começa por dentro.' },
  { verso: '"Ele dá força ao cansado e poder ao fraco."', ref: 'Isaías 40:29', reflexao: 'Se você está exausto, este é o momento de pedir força. Ela é oferecida.' },
  { verso: '"Em quietude e confiança está a vossa força."', ref: 'Isaías 30:15', reflexao: 'Às vezes a ação mais poderosa é parar, respirar e confiar.' },
  { verso: '"O Senhor é o meu pastor; nada me faltará."', ref: 'Salmos 23:1', reflexao: 'Você não precisa carregar tudo. Há cuidado disponível para você.' },
  { verso: '"Não te cansas? Não desfaleças. Ele renova as forças."', ref: 'Isaías 40:31', reflexao: 'O cansaço que você sente é real. E a renovação também é.' },
  { verso: '"O coração alegre é bom remédio."', ref: 'Provérbios 17:22', reflexao: 'Alegria não é ingenuidade. É uma escolha de quem sabe onde está sua âncora.' },
]

const HABITOS_PADRAO = [
  { id: 'agua', ico: '💧', label: 'Beber água (8 copos)' },
  { id: 'exercicio', ico: '🏃', label: 'Exercício físico' },
  { id: 'sono', ico: '😴', label: 'Dormir bem (7-8h)' },
  { id: 'pausa', ico: '🧘', label: 'Pausa intencional (5 min)' },
  { id: 'gratidao', ico: '🙏', label: 'Momento de gratidão' },
  { id: 'desconexao', ico: '📵', label: 'Desconexão digital noturna' },
  { id: 'conexao', ico: '❤️', label: 'Conectar com alguém especial' },
  { id: 'leitura', ico: '📖', label: 'Leitura (15 min)' },
]

// ── HELPERS ──────────────────────────────────────────────────────────────────
function getDiaKey() { return new Date().toISOString().slice(0, 10) }
function getDiaSemana() { return new Date().getDay() }
function nivelLabel(v: number) {
  if (v >= 80) return { label: 'Crítico', cor: '#ef4444' }
  if (v >= 60) return { label: 'Alto', cor: '#f97316' }
  if (v >= 40) return { label: 'Moderado', cor: '#f59e0b' }
  if (v >= 20) return { label: 'Baixo', cor: '#10b981' }
  return { label: 'Saudável', cor: '#059669' }
}
function pioreIndicador(d: Diagnostico): Indicador {
  return (Object.entries(d) as [Indicador, number][]).sort((a, b) => b[1] - a[1])[0][0]
}

// ── RADAR SVG ────────────────────────────────────────────────────────────────
function RadarSVG({ diagnostico, size = 240 }: { diagnostico: Diagnostico; size?: number }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38
  const n = INDICADORES.length
  const pts = INDICADORES.map((ind, i) => {
    const ang = (Math.PI * 2 * i / n) - Math.PI / 2
    const val = (diagnostico[ind.key] || 0) / 100
    return { x: cx + Math.cos(ang) * r * val, y: cy + Math.sin(ang) * r * val, ax: cx + Math.cos(ang) * r, ay: cy + Math.sin(ang) * r, ind, val }
  })
  const polygon = pts.map(p => `${p.x},${p.y}`).join(' ')
  const rings = [0.25, 0.5, 0.75, 1]
  return (
    <svg width={size + 48} height={size + 48} viewBox={`-24 -24 ${size + 48} ${size + 48}`} style={{ display: 'block', margin: '0 auto' }}>
      {rings.map(f => (
        <polygon key={f} points={INDICADORES.map((_, i) => { const a = (Math.PI * 2 * i / n) - Math.PI / 2; return `${cx + Math.cos(a) * r * f},${cy + Math.sin(a) * r * f}` }).join(' ')} fill="none" stroke="rgba(99,102,241,0.12)" strokeWidth="1" />
      ))}
      {pts.map(p => <line key={p.ind.key} x1={cx} y1={cy} x2={p.ax} y2={p.ay} stroke="rgba(99,102,241,0.08)" strokeWidth="1" />)}
      <polygon points={polygon} fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth="2" />
      {pts.map(p => (
        <g key={p.ind.key}>
          <circle cx={p.x} cy={p.y} r={5} fill={p.ind.cor} stroke="white" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  )
}

// ── PULSO CHART ───────────────────────────────────────────────────────────────
function PulsoChart({ historico }: { historico: PulsoDia[] }) {
  const h = historico.slice(-7)
  if (h.length < 2) return <div className="text-center text-sm text-gray-400 py-8">Registre pelo menos 2 dias para ver o gráfico.</div>
  const W = 300, H = 120, pad = 16
  const xs = h.map((_, i) => pad + i * ((W - pad * 2) / (h.length - 1)))
  const toY = (v: number) => H - pad - (v / 10) * (H - pad * 2)
  const line = (key: keyof Omit<PulsoDia, 'data'>, cor: string) => (
    <g key={key}>
      <polyline points={h.map((d, i) => `${xs[i]},${toY(d[key])}`).join(' ')} fill="none" stroke={cor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {h.map((d, i) => <circle key={i} cx={xs[i]} cy={toY(d[key])} r={3} fill={cor} />)}
    </g>
  )
  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
        {[2, 4, 6, 8, 10].map(v => <line key={v} x1={pad} y1={toY(v)} x2={W - pad} y2={toY(v)} stroke="#f3f4f6" strokeWidth="1" />)}
        {line('energia', '#f59e0b')}
        {line('disposicao', '#6366f1')}
        {line('equilibrio', '#10b981')}
        {h.map((d, i) => <text key={i} x={xs[i]} y={H - 2} textAnchor="middle" fontSize="8" fill="#9ca3af">{d.data.slice(5)}</text>)}
      </svg>
      <div className="flex gap-4 justify-center mt-2">
        {[['#f59e0b', 'Energia'], ['#6366f1', 'Disposição'], ['#10b981', 'Equilíbrio']].map(([cor, label]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: cor }} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SELO PRIVACIDADE ──────────────────────────────────────────────────────────
function PrivacySeal() {
  const [aberto, setAberto] = useState(false)
  return (
    <>
      <button onClick={() => setAberto(true)}
        className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-all">
        🔒 Modo Confidencial
      </button>
      {aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setAberto(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🔒</div>
              <h3 className="text-xl font-black text-gray-900">Modo Confidencial</h3>
              <p className="text-sm text-gray-500 mt-1">Seus dados emocionais são 100% privados</p>
            </div>
            <div className="space-y-3 mb-6">
              {[
                ['✅', 'Seus dados nunca chegam ao seu gestor de forma individual'],
                ['✅', 'O painel da empresa mostra apenas médias anônimas da equipe'],
                ['✅', 'Você é o único que vê seu radar emocional completo'],
                ['✅', 'Seus diários e respostas são privados e criptografados'],
                ['✅', 'Tratamento de dados conforme a LGPD (Lei 13.709/2018)'],
              ].map(([ico, txt]) => (
                <div key={txt} className="flex items-start gap-3">
                  <span className="flex-shrink-0">{ico}</span>
                  <p className="text-sm text-gray-700">{txt}</p>
                </div>
              ))}
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center mb-4">
              <div className="text-xs font-black text-emerald-700 uppercase tracking-wider">Certificado Essencial Mente</div>
              <div className="text-xs text-emerald-600 mt-1">Privacidade Garantida · RH Essencial Digital · {new Date().getFullYear()}</div>
            </div>
            <button onClick={() => setAberto(false)} className="w-full bg-gray-900 text-white font-bold py-3 rounded-2xl text-sm">
              Entendido ✓
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function EssencialMente() {
  const [aba, setAba] = useState<Aba>('hoje')
  const [diagnostico, setDiagnostico] = useState<Diagnostico | null>(null)
  const [fazendoDiagnostico, setFazendoDiagnostico] = useState(false)
  const [questaoAtual, setQuestaoAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [pulsoHoje, setPulsoHoje] = useState<PulsoDia | null>(null)
  const [pulsoHistorico, setPulsoHistorico] = useState<PulsoDia[]>([])
  const [fazendoPulso, setFazendoPulso] = useState(false)
  const [pulsoStep, setPulsoStep] = useState(0)
  const [pulsoTemp, setPulsoTemp] = useState({ energia: 5, disposicao: 5, equilibrio: 5 })
  const [diario, setDiario] = useState<DiarioEntry[]>([])
  const [diarioHumor, setDiarioHumor] = useState(5)
  const [diarioGatilho, setDiarioGatilho] = useState('')
  const [diarioNota, setDiarioNota] = useState('')
  const [diarioSalvo, setDiarioSalvo] = useState(false)
  const [habitos, setHabitos] = useState<Record<string, boolean>>({})
  const [trilhaDia, setTrilhaDia] = useState(0)
  const [plano21, setPlano21] = useState<{ ativo: boolean; inicio: string; indicador: Indicador } | null>(null)
  const [saudacao, setSaudacao] = useState('')

  useEffect(() => {
    const h = new Date().getHours()
    setSaudacao(h >= 5 && h < 12 ? 'Bom dia' : h >= 12 && h < 18 ? 'Boa tarde' : 'Boa noite')
    const diag = localStorage.getItem('mente_diagnostico')
    if (diag) setDiagnostico(JSON.parse(diag))
    const pulsoHist = localStorage.getItem('mente_pulso_historico')
    if (pulsoHist) {
      const hist: PulsoDia[] = JSON.parse(pulsoHist)
      setPulsoHistorico(hist)
      const hoje = hist.find(p => p.data === getDiaKey())
      if (hoje) setPulsoHoje(hoje)
    }
    const diarioSaved = localStorage.getItem('mente_diario')
    if (diarioSaved) setDiario(JSON.parse(diarioSaved))
    const habitosSaved = localStorage.getItem('mente_habitos_' + getDiaKey())
    if (habitosSaved) setHabitos(JSON.parse(habitosSaved))
    const trilha = localStorage.getItem('mente_trilha_dia')
    if (trilha) setTrilhaDia(parseInt(trilha))
    const p21 = localStorage.getItem('mente_plano21')
    if (p21) setPlano21(JSON.parse(p21))
  }, [])

  function responderQuestao(valor: number) {
    const novas = [...respostas, valor]
    if (questaoAtual < PERGUNTAS.length - 1) {
      setRespostas(novas)
      setQuestaoAtual(questaoAtual + 1)
    } else {
      const scores: Record<Indicador, number[]> = { burnout: [], estresse: [], regulacao: [], proposito: [], relacional: [], equilibrio: [] }
      PERGUNTAS.forEach((q, i) => {
        const r = novas[i] ?? 0
        const norm = q.invertida ? (4 - r) * 25 : r * 25
        scores[q.indicador].push(norm)
      })
      const diag: Diagnostico = {} as Diagnostico
      INDICADORES.forEach(ind => {
        const arr = scores[ind.key]
        diag[ind.key] = arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 50
      })
      setDiagnostico(diag)
      localStorage.setItem('mente_diagnostico', JSON.stringify(diag))
      setFazendoDiagnostico(false)
      setQuestaoAtual(0)
      setRespostas([])
    }
  }

  function salvarPulso() {
    const nova: PulsoDia = { data: getDiaKey(), ...pulsoTemp }
    const hist = pulsoHistorico.filter(p => p.data !== getDiaKey())
    hist.push(nova)
    const ordered = hist.sort((a, b) => a.data.localeCompare(b.data))
    setPulsoHoje(nova)
    setPulsoHistorico(ordered)
    localStorage.setItem('mente_pulso_historico', JSON.stringify(ordered))
    setFazendoPulso(false)
    setPulsoStep(0)
    setPulsoTemp({ energia: 5, disposicao: 5, equilibrio: 5 })
  }

  function salvarDiario() {
    const entry: DiarioEntry = { data: getDiaKey(), humor: diarioHumor, gatilho: diarioGatilho, nota: diarioNota }
    const novo = [...diario.filter(d => d.data !== getDiaKey()), entry]
    setDiario(novo)
    localStorage.setItem('mente_diario', JSON.stringify(novo))
    setDiarioSalvo(true)
    setTimeout(() => setDiarioSalvo(false), 2000)
    setDiarioGatilho('')
    setDiarioNota('')
  }

  function toggleHabito(id: string) {
    const novo = { ...habitos, [id]: !habitos[id] }
    setHabitos(novo)
    localStorage.setItem('mente_habitos_' + getDiaKey(), JSON.stringify(novo))
  }

  function iniciarPlano21() {
    if (!diagnostico) return
    const ind = pioreIndicador(diagnostico)
    const p = { ativo: true, inicio: getDiaKey(), indicador: ind }
    setPlano21(p)
    localStorage.setItem('mente_plano21', JSON.stringify(p))
  }

  function avancarTrilha() {
    const novo = trilhaDia + 1
    setTrilhaDia(novo)
    localStorage.setItem('mente_trilha_dia', String(novo))
  }

  const insights = useMemo(() => {
    if (pulsoHistorico.length < 3) return []
    const msgs: string[] = []
    const medias = { energia: 0, disposicao: 0, equilibrio: 0 }
    pulsoHistorico.slice(-7).forEach(p => { medias.energia += p.energia; medias.disposicao += p.disposicao; medias.equilibrio += p.equilibrio })
    const n = pulsoHistorico.slice(-7).length
    medias.energia /= n; medias.disposicao /= n; medias.equilibrio /= n
    if (medias.energia < 5) msgs.push('⚡ Sua energia média esta semana está abaixo de 5. Sinais de esgotamento.')
    if (medias.equilibrio < 4) msgs.push('⚖️ Equilíbrio crítico: seus dados sugerem sobrecarga constante.')
    if (medias.disposicao > 7) msgs.push('🌟 Boa semana! Sua disposição está acima da média.')
    const trend = pulsoHistorico.slice(-3).map(p => p.energia)
    if (trend.length === 3 && trend[2] < trend[0]) msgs.push('📉 Sua energia caiu ao longo dos últimos 3 dias. Atenção.')
    return msgs
  }, [pulsoHistorico])

  const habitosConcluidos = HABITOS_PADRAO.filter(h => habitos[h.id]).length
  const pctHabitos = Math.round((habitosConcluidos / HABITOS_PADRAO.length) * 100)
  const piore = diagnostico ? pioreIndicador(diagnostico) : null
  const trilhaAtual = piore ? TRILHAS[piore] : null
  const feIdx = getDiaSemana()
  const plano21DiaAtual = plano21 ? Math.min(Math.floor((new Date().getTime() - new Date(plano21.inicio + 'T12:00:00').getTime()) / 86400000), 20) : 0

  // ── DIAGNÓSTICO ───────────────────────────────────────────────────────────
  if (fazendoDiagnostico) {
    const q = PERGUNTAS[questaoAtual]
    const pct = Math.round((questaoAtual / PERGUNTAS.length) * 100)
    const ind = INDICADORES.find(i => i.key === q.indicador)!
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-lg w-full space-y-6">
          <div className="flex items-center justify-between">
            <button onClick={() => { setFazendoDiagnostico(false); setQuestaoAtual(0); setRespostas([]) }} className="text-sm text-gray-400 hover:text-gray-600">✕ Cancelar</button>
            <span className="text-sm font-bold text-gray-400">{questaoAtual + 1} / {PERGUNTAS.length}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#6366f1,#a5b4fc)' }} />
          </div>
          <div className="text-center py-4">
            <div className="text-4xl mb-2">{ind.emoji}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">{ind.label}</div>
            <h2 className="text-lg font-black text-gray-900 leading-snug">{q.texto}</h2>
          </div>
          <div className="space-y-2">
            {OPCOES.map((op, i) => (
              <button key={i} onClick={() => responderQuestao(i)}
                className="w-full py-3.5 px-5 rounded-2xl border-2 border-gray-100 bg-white text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left">
                {op}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center">🔒 Suas respostas são privadas e nunca compartilhadas individualmente</p>
        </div>
      </div>
    )
  }

  // ── PULSO ────────────────────────────────────────────────────────────────
  if (fazendoPulso) {
    const pulsoPerguntas = [
      { key: 'energia' as const, label: 'Como está sua energia agora?', emoji: '⚡', low: 'Sem energia', high: 'Com muita energia' },
      { key: 'disposicao' as const, label: 'Qual sua disposição para o trabalho hoje?', emoji: '💼', low: 'Sem disposição', high: 'Muito disposto' },
      { key: 'equilibrio' as const, label: 'Você se sente equilibrado hoje?', emoji: '⚖️', low: 'Desequilibrado', high: 'Em equilíbrio' },
    ]
    const pq = pulsoPerguntas[pulsoStep]
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="text-5xl mb-3">{pq.emoji}</div>
            <h2 className="text-lg font-black text-gray-900">{pq.label}</h2>
            <p className="text-xs text-gray-400 mt-1">Pergunta {pulsoStep + 1} de 3 · 30 segundos</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-xs text-gray-400 font-medium">
              <span>{pq.low}</span><span>{pq.high}</span>
            </div>
            <input type="range" min={1} max={10} value={pulsoTemp[pq.key]}
              onChange={e => setPulsoTemp(prev => ({ ...prev, [pq.key]: parseInt(e.target.value) }))}
              className="w-full accent-indigo-600" />
            <div className="text-center text-3xl font-black text-indigo-600">{pulsoTemp[pq.key]}<span className="text-lg text-gray-300">/10</span></div>
          </div>
          <button onClick={() => { if (pulsoStep < 2) setPulsoStep(pulsoStep + 1); else salvarPulso() }}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all">
            {pulsoStep < 2 ? 'Próxima →' : 'Registrar PulsoMente ✓'}
          </button>
          <button onClick={() => { setFazendoPulso(false); setPulsoStep(0) }} className="w-full text-sm text-gray-400 hover:text-gray-600">Cancelar</button>
        </div>
      </div>
    )
  }

  // ── LAYOUT PRINCIPAL ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed,#0ea5e9)' }}>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">RH Essencial Digital</p>
              <h1 className="text-2xl font-black">🧠 Essencial Mente</h1>
              <p className="text-white/70 text-sm mt-1">{saudacao} · {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            <PrivacySeal />
          </div>
          {diagnostico && piore && (
            <div className="bg-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
              <span className="text-2xl">{INDICADORES.find(i => i.key === piore)?.emoji}</span>
              <div>
                <p className="text-xs text-white/60">Foco desta semana</p>
                <p className="text-sm font-black">{TRILHAS[piore].titulo}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4 pb-12">

        {/* Abas */}
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-1 bg-white border border-gray-100 shadow-sm p-1 rounded-2xl min-w-max">
            {([
              { key: 'hoje', ico: '🏠', label: 'Hoje' },
              { key: 'radar', ico: '📊', label: 'Radar' },
              { key: 'pulso', ico: '🧬', label: 'PulsoMente' },
              { key: 'trilha', ico: '🎯', label: 'Trilha 21d' },
              { key: 'diario', ico: '📓', label: 'Diário' },
              { key: 'proposito', ico: '🌱', label: 'Propósito' },
              { key: 'habitos', ico: '✅', label: 'Hábitos' },
            ] as const).map(a => (
              <button key={a.key} onClick={() => setAba(a.key)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${aba === a.key ? 'bg-indigo-600 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}>
                {a.ico} {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── ABA: HOJE ── */}
        {aba === 'hoje' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">🧬 PulsoMente</p>
                  <p className="text-sm text-gray-500 mt-0.5">Check-in emocional diário (30s)</p>
                </div>
                {!pulsoHoje && (
                  <button onClick={() => setFazendoPulso(true)} className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all">
                    Registrar
                  </button>
                )}
              </div>
              {pulsoHoje ? (
                <div className="grid grid-cols-3 gap-3">
                  {[['⚡', 'Energia', pulsoHoje.energia], ['💼', 'Disposição', pulsoHoje.disposicao], ['⚖️', 'Equilíbrio', pulsoHoje.equilibrio]].map(([ico, label, val]) => (
                    <div key={String(label)} className="bg-indigo-50 rounded-2xl p-3 text-center">
                      <div className="text-xl mb-1">{ico}</div>
                      <div className="text-lg font-black text-indigo-700">{val}<span className="text-xs text-gray-400">/10</span></div>
                      <div className="text-xs text-gray-500">{label}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-indigo-50 rounded-2xl p-4 text-center text-sm text-gray-500">
                  Você ainda não registrou o pulso de hoje. Leva 30 segundos!
                </div>
              )}
            </div>

            {diagnostico && piore && trilhaAtual && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">🧘 Exercício do dia</p>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-4">
                  <div className="text-sm font-bold text-indigo-800 mb-2">{trilhaAtual.titulo}</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{trilhaAtual.exercicios[trilhaDia % trilhaAtual.exercicios.length]}</p>
                </div>
                <button onClick={avancarTrilha} className="mt-3 w-full text-xs font-bold text-indigo-600 hover:underline">
                  Concluir e ver próximo exercício →
                </button>
              </div>
            )}

            {!diagnostico && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="text-5xl mb-3">🔍</div>
                <h3 className="font-black text-gray-900 mb-2">Faça seu diagnóstico emocional</h3>
                <p className="text-sm text-gray-500 mb-4 max-w-xs mx-auto">12 perguntas · 3 minutos · Resultado imediato com seu radar personalizado</p>
                <button onClick={() => setFazendoDiagnostico(true)} className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-indigo-700 transition-all">
                  Começar diagnóstico →
                </button>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">✅ Hábitos hoje</p>
                <span className="text-xs font-bold text-indigo-600">{habitosConcluidos}/{HABITOS_PADRAO.length}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                <div className="h-2 rounded-full transition-all" style={{ width: `${pctHabitos}%`, background: 'linear-gradient(90deg,#6366f1,#a5b4fc)' }} />
              </div>
              <button onClick={() => setAba('habitos')} className="text-xs text-indigo-600 font-bold hover:underline">Ver hábitos →</button>
            </div>
          </div>
        )}

        {/* ── ABA: RADAR ── */}
        {aba === 'radar' && (
          <div className="space-y-4">
            {diagnostico ? (
              <>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Seu Radar Emocional</p>
                  <RadarSVG diagnostico={diagnostico} size={220} />
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {INDICADORES.map(ind => {
                      const val = diagnostico[ind.key]
                      const nivel = nivelLabel(val)
                      return (
                        <div key={ind.key} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2.5">
                          <span className="text-lg">{ind.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-gray-700 truncate">{ind.label}</span>
                              <span className="text-xs font-black ml-1" style={{ color: nivel.cor }}>{nivel.label}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div className="h-1.5 rounded-full" style={{ width: `${val}%`, background: ind.cor }} />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <button onClick={() => { setFazendoDiagnostico(true); setDiagnostico(null); localStorage.removeItem('mente_diagnostico') }}
                  className="w-full text-sm text-gray-400 font-medium hover:text-gray-600 border border-gray-200 bg-white rounded-2xl py-2.5">
                  Refazer diagnóstico
                </button>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="font-black text-gray-900 mb-2">Sem diagnóstico ainda</h3>
                <p className="text-sm text-gray-500 mb-4">Faça o diagnóstico para ver seu radar emocional personalizado.</p>
                <button onClick={() => setFazendoDiagnostico(true)} className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-indigo-700 transition-all">
                  Iniciar diagnóstico →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── ABA: PULSAMENTE ── */}
        {aba === 'pulso' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">🧬 PulsoMente</p>
                  <p className="text-sm font-black text-gray-900 mt-0.5">Leitura Emocional Semanal</p>
                </div>
                {!pulsoHoje && (
                  <button onClick={() => setFazendoPulso(true)} className="bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-xl">
                    + Registrar hoje
                  </button>
                )}
              </div>
              <PulsoChart historico={pulsoHistorico} />
            </div>
            {insights.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">💡 Insights</p>
                <div className="space-y-2">
                  {insights.map((msg, i) => (
                    <div key={i} className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-sm text-indigo-900 font-medium">{msg}</div>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
              <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-2">Como funciona</p>
              <p className="text-sm text-gray-600 leading-relaxed">3 perguntas por dia, 30 segundos. Com o tempo, a IA identifica padrões invisíveis no seu bem-estar emocional.</p>
            </div>
          </div>
        )}

        {/* ── ABA: TRILHA 21 DIAS ── */}
        {aba === 'trilha' && (
          <div className="space-y-4">
            {!diagnostico ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="text-5xl mb-3">🎯</div>
                <p className="text-gray-500 mb-4">Faça o diagnóstico primeiro para gerar seu plano personalizado.</p>
                <button onClick={() => { setAba('radar'); setFazendoDiagnostico(true) }} className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-2xl">Fazer diagnóstico →</button>
              </div>
            ) : !plano21 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center space-y-4">
                <div className="text-5xl">🎯</div>
                <h3 className="font-black text-gray-900 text-lg">Plano de 21 Dias</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Baseado no seu diagnóstico, um plano personalizado focado em <strong className="text-indigo-700">{TRILHAS[pioreIndicador(diagnostico)].titulo}</strong>.
                </p>
                <button onClick={iniciarPlano21} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all">
                  🚀 Iniciar meu Plano de 21 Dias
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Progresso</p>
                      <p className="text-lg font-black text-gray-900">Dia {plano21DiaAtual + 1} de 21</p>
                    </div>
                    <div className="text-3xl font-black text-indigo-600">{Math.round(((plano21DiaAtual + 1) / 21) * 100)}%</div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
                    <div className="h-3 rounded-full transition-all" style={{ width: `${((plano21DiaAtual + 1) / 21) * 100}%`, background: 'linear-gradient(90deg,#6366f1,#a5b4fc)' }} />
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 21 }).map((_, i) => (
                      <div key={i} className={`h-6 rounded-md flex items-center justify-center text-xs font-bold ${i < plano21DiaAtual ? 'bg-indigo-600 text-white' : i === plano21DiaAtual ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-400' : 'bg-gray-100 text-gray-400'}`}>
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">🧘 Exercício · Dia {plano21DiaAtual + 1}</p>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5">
                    <div className="text-sm font-black text-indigo-800 mb-3">{TRILHAS[plano21.indicador].titulo}</div>
                    <p className="text-base text-gray-800 leading-relaxed font-medium">
                      {TRILHAS[plano21.indicador].exercicios[plano21DiaAtual % TRILHAS[plano21.indicador].exercicios.length]}
                    </p>
                  </div>
                  <button onClick={avancarTrilha} className="mt-4 w-full bg-indigo-600 text-white font-bold py-3 rounded-2xl hover:bg-indigo-700 transition-all">
                    ✓ Concluído · Avançar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ABA: DIÁRIO ── */}
        {aba === 'diario' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">📓 Diário Emocional de Hoje</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Como você está emocionalmente? {diarioHumor}/10</label>
                  <input type="range" min={1} max={10} value={diarioHumor} onChange={e => setDiarioHumor(parseInt(e.target.value))} className="w-full accent-indigo-600 mt-2" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1"><span>😔 Muito mal</span><span>😊 Muito bem</span></div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">O que mais pesou hoje?</label>
                  <input className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" placeholder="Ex: reunião difícil, excesso de demandas..." value={diarioGatilho} onChange={e => setDiarioGatilho(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Sua nota do dia (livre)</label>
                  <textarea className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" rows={4} placeholder="Como foi o dia? O que você sentiu? O que aprendeu sobre si mesmo?" value={diarioNota} onChange={e => setDiarioNota(e.target.value)} />
                </div>
                <button onClick={salvarDiario} disabled={!diarioNota} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-40">
                  {diarioSalvo ? '✓ Salvo!' : 'Salvar registro'}
                </button>
              </div>
            </div>
            {diario.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Histórico recente</p>
                <div className="space-y-3">
                  {diario.slice(-5).reverse().map(e => (
                    <div key={e.data} className="bg-gray-50 rounded-2xl p-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-400">{new Date(e.data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                        <span className="text-xs font-black text-indigo-600">Humor {e.humor}/10</span>
                      </div>
                      {e.gatilho && <p className="text-xs text-gray-500 mb-1">⚡ {e.gatilho}</p>}
                      <p className="text-sm text-gray-700 line-clamp-2">{e.nota}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ABA: PROPÓSITO ── */}
        {aba === 'proposito' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center py-8">
              <div className="text-4xl mb-3">🙏</div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Reflexão de hoje</p>
              <p className="text-xl font-black text-gray-900 italic leading-relaxed mb-2">{FE_REFLEXOES[feIdx].verso}</p>
              <p className="text-xs text-gray-400 mb-5">{FE_REFLEXOES[feIdx].ref}</p>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">{FE_REFLEXOES[feIdx].reflexao}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">🌱 Perguntas de propósito</p>
              <div className="space-y-3">
                {[
                  'O que o meu trabalho possibilita na vida de outras pessoas?',
                  'Quais valores são inegociáveis para mim? Meu trabalho respeita isso?',
                  'O que eu gostaria de ser lembrado por fazer bem?',
                  'Se não fosse o dinheiro, o que eu escolheria fazer?',
                ].map((q, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 bg-indigo-50 rounded-xl border border-indigo-100">
                    <span className="text-indigo-400 font-black text-sm mt-0.5">{i + 1}.</span>
                    <p className="text-sm text-gray-700 leading-relaxed">{q}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">💚 Aviso importante</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                O Essencial Mente é uma plataforma de bem-estar emocional e não substitui avaliação médica, psicológica ou psiquiátrica. Em caso de sofrimento intenso, procure um profissional qualificado. CVV: <strong>188</strong> (24h, gratuito).
              </p>
            </div>
          </div>
        )}

        {/* ── ABA: HÁBITOS ── */}
        {aba === 'habitos' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
              <div className="text-4xl font-black mb-1 text-indigo-600">{pctHabitos}%</div>
              <p className="text-sm text-gray-500 mb-3">{habitosConcluidos} de {HABITOS_PADRAO.length} hábitos concluídos hoje</p>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="h-3 rounded-full transition-all" style={{ width: `${pctHabitos}%`, background: 'linear-gradient(90deg,#6366f1,#a5b4fc)' }} />
              </div>
              {pctHabitos === 100 && <p className="text-sm font-bold text-emerald-600 mt-3">🎉 Dia completo! Você cuidou de si hoje.</p>}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-2">
              {HABITOS_PADRAO.map(h => (
                <button key={h.id} onClick={() => toggleHabito(h.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all text-left ${habitos[h.id] ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-100 hover:border-gray-200'}`}>
                  <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${habitos[h.id] ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                    {habitos[h.id] && <span className="text-white text-xs font-black">✓</span>}
                  </span>
                  <span className="text-lg">{h.ico}</span>
                  <span className={`text-sm font-medium ${habitos[h.id] ? 'text-green-700 line-through' : 'text-gray-700'}`}>{h.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center">💡 Hábitos resetam diariamente à meia-noite</p>
          </div>
        )}

        {/* Footer LGPD */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            🔒 Dados tratados conforme a LGPD (Lei 13.709/2018) · RH Essencial Digital<br />
            Não substitui avaliação médica, psicológica ou psiquiátrica · CVV: 188
          </p>
        </div>

      </div>
    </div>
  )
}
