'use client'
import { useState } from 'react'
import Link from 'next/link'

const SECOES = [
  'missao', 'principios', 'pilares', 'ia-decisoes', 'etica', 'privacidade', 'inclusao', 'lideres', 'casos-uso', 'exemplos',
]

const PILARES = [
  {
    letra: 'H', nome: 'Humanizar', cor: '#10b981',
    desc: 'Compreender cada colaborador como indivíduo único, com história, contexto e capacidades próprias. O ponto de partida de toda decisão é a pessoa, não o cargo.',
    principio: 'Antes de qualquer métrica, há um ser humano. O Método HAI reconhece que dados comportamentais são reflexo de vida, não de performance.',
    pratica: 'O gestor acessa o perfil DISC HAI de um colaborador e entende que a resistência a prazos apertados está ligada ao perfil S (Estabilidade alto) e a uma fase de readaptação pós-mudança de área, não à falta de comprometimento.',
  },
  {
    letra: 'A', nome: 'Adaptar', cor: '#0ea5e9',
    desc: 'Adaptar comunicação, liderança e desenvolvimento ao perfil real de cada pessoa. Não existe liderança universal. Existe liderança que funciona para cada pessoa específica.',
    principio: 'A eficácia da liderança é proporcional à sua capacidade de adaptação. Liderar todos da mesma forma é a receita mais comum para o desengajamento silencioso.',
    pratica: 'A IA identifica que um colaborador tem Dominância alta e Conformidade baixa. O sistema sugere ao gestor: evite microgerenciamento, dê autonomia e clareza de objetivos, não de processos.',
  },
  {
    letra: 'I', nome: 'Integrar', cor: '#a78bfa',
    desc: 'Promover inclusão, desempenho e pertencimento por meio da tecnologia. Integração não é uniformidade. É criar as condições para que cada pessoa contribua do seu melhor lugar.',
    principio: 'Pertencimento não é sentir-se igual a todos. É sentir-se valioso sendo diferente. A tecnologia deve amplificar essa condição, não suprimi-la.',
    pratica: 'O índice de Fit Cultural de um colaborador revela baixo alinhamento em Estilo de Trabalho mas alto em Valores. A IA sugere uma conversa de realinhamento sobre dinâmica operacional antes que o desalinhamento evolua para saída.',
  },
  {
    letra: 'IA', nome: 'Inteligência Adaptativa', cor: '#f59e0b',
    desc: 'Aprendizado contínuo baseado em evidências, com o ser humano no centro. A inteligência artificial é ferramenta. A inteligência humana é o destino.',
    principio: 'A IA no Método HAI não substitui o julgamento humano. Ela amplia a percepção do gestor com dados que ele não conseguiria observar manualmente em escala.',
    pratica: 'O sistema detecta que o Human Score de uma equipe caiu 8 pontos em 30 dias, correlacionado com queda no índice de Bem-Estar Relacional. O gestor recebe um alerta antes que isso se torne turnover.',
  },
  {
    letra: 'E', nome: 'Evidenciar', cor: '#34d399',
    desc: 'Transformar inteligência humana em métricas reais. O Human Score HAI é a tradução objetiva de ativos subjetivos. Sentir não basta. Evidenciar transforma.',
    principio: 'O que não é medido não é gerenciado. O Método HAI transforma percepções sobre pessoas em dados estruturados que permitem decisões mais justas e mais eficazes.',
    pratica: 'Dois colaboradores com mesmo cargo e salário. O Human Score revela que um tem potencial não desenvolvido em Liderança Adaptativa enquanto o outro mostra risco de desengajamento. A mesma gestão para ambos seria inequidade.',
  },
]

const INDICES = [
  { sigla: 'IQH', nome: 'Índice de Qualidade Humana', peso: 25, cor: '#10b981', desc: 'Mede o conjunto de competências comportamentais e relacionais que determinam a qualidade das interações de uma pessoa no ambiente de trabalho.' },
  { sigla: 'IEBO', nome: 'Índice de Engajamento e Bem-Estar', peso: 30, cor: '#a78bfa', desc: 'Avalia o estado de engajamento real do colaborador, incluindo segurança psicológica, reconhecimento percebido, propósito e qualidade das relações.' },
  { sigla: 'IEIH', nome: 'Inteligência Emocional e Inclusão Humana', peso: 20, cor: '#f59e0b', desc: 'Mensura a capacidade cognitiva e emocional de adaptação, aprendizagem contínua e contribuição em ambientes de diversidade.' },
  { sigla: 'IHAL™', nome: 'Índice HAI de Liderança Adaptativa', peso: 25, cor: '#0ea5e9', desc: 'Metodologia proprietária desenvolvida pelo Ecossistema Essencial para avaliar e apoiar o desenvolvimento da liderança adaptativa por meio de inteligência artificial e análise de indicadores organizacionais.' },
]

const CASOS_USO = [
  { titulo: 'Identificação de Potencial Oculto', icone: '🔍', desc: 'Um colaborador com desempenho mediano apresenta Human Score alto. A IA revela que o ambiente atual suprime suas capacidades. O gestor adapta a dinâmica e o colaborador se torna referência em 90 dias.' },
  { titulo: 'Prevenção de Turnover', icone: '🛡️', desc: 'Queda consecutiva no IEBO sinaliza desengajamento antes que o colaborador peça demissão. O gestor age antecipadamente com uma conversa estruturada, antes da perda irreversível.' },
  { titulo: 'Formação de Times Complementares', icone: '🌐', desc: 'Ao montar uma equipe de projeto, o DISC HAI orienta a composição: alta Dominância na liderança, alta Conformidade na execução, alta Influência na interface com clientes.' },
  { titulo: 'Desenvolvimento Individualizado', icone: '📈', desc: 'Em vez de treinamentos genéricos, o Plano de Desenvolvimento HAI é gerado pela IA para cada perfil, com ações específicas baseadas nos índices mais baixos de cada pessoa.' },
  { titulo: 'Promoções Baseadas em Dados', icone: '🎯', desc: 'Decisões de promoção são embasadas pelo IHAL™ e pelo Human Score, reduzindo vieses inconscientes que historicamente favorecem determinados perfis em detrimento de outros igualmente capazes.' },
  { titulo: 'Diagnóstico de Clima de Equipe', icone: '🌡️', desc: 'O Fit Cultural agregado de uma equipe revela onde os valores coletivos divergem da cultura organizacional declarada, antes que isso se manifeste em conflito ou queda de resultado.' },
]

const ETICA_PRINCIPIOS = [
  { titulo: 'A IA orienta. O humano decide.', desc: 'Nenhuma decisão sobre pessoas é tomada automaticamente. O sistema fornece dados e análises. A decisão final é sempre do gestor ou do RH.' },
  { titulo: 'Dados comportamentais não são destino.', desc: 'Um perfil DISC ou um Human Score é uma fotografia do momento, não um veredicto permanente. A metodologia reconhece que pessoas mudam e crescem.' },
  { titulo: 'Transparência radical.', desc: 'O colaborador tem direito de saber que foi avaliado, quais dados foram coletados e como eles são usados. Não há análise sigilosa contra o avaliado.' },
  { titulo: 'Sem discriminação algorítmica.', desc: 'Os modelos de IA são regularmente auditados para garantir que não reproduzam vieses de gênero, raça, origem ou qualquer outro marcador de discriminação.' },
  { titulo: 'Propósito de desenvolvimento, não punição.', desc: 'Os índices HAI existem para apoiar o crescimento de cada pessoa. O uso punitivo ou eliminatório dos dados viola os princípios do Método e os termos de uso da plataforma.' },
]

export default function DocumentoOficialPage() {
  const [secaoAtiva, setSecaoAtiva] = useState('missao')

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 0', color: '#f0fdf4' }}>

      {/* Header oficial */}
      <div style={{ padding: '40px', borderRadius: 24, background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(52,211,153,0.03))', border: '1px solid rgba(16,185,129,0.15)', marginBottom: 32, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: 300, background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: 9, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Documento Oficial — Ecossistema Essencial Digital</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, marginBottom: 10, lineHeight: 1.1 }}>
          Método Essencial <span style={{ color: '#10b981' }}>HAI™</span>
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.5)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>Human Adaptive Intelligence — Metodologia Proprietária</p>
        <div style={{ padding: '18px 20px', borderRadius: 16, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(16,185,129,0.1)', maxWidth: 680 }}>
          <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.75)', lineHeight: 1.85, margin: 0, fontStyle: 'italic' }}>
            "Nossa IA é guiada pelo Método Essencial HAI™, uma metodologia proprietária desenvolvida para ajudar líderes a compreender pessoas, respeitar suas diferenças e desenvolver equipes de forma ética, inclusiva e baseada em evidências."
          </p>
        </div>
        <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {['5 Pilares', '4 Índices Proprietários', 'IA com Ética', 'Desenvolvimento Humano'].map((t, i) => (
            <span key={i} style={{ fontSize: 10, padding: '4px 12px', borderRadius: 99, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 800 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Navegação por seções */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 32 }}>
        {[
          { id: 'missao', label: 'Missão' },
          { id: 'principios', label: 'Princípios' },
          { id: 'pilares', label: 'Pilares' },
          { id: 'indices', label: 'Índices HAI' },
          { id: 'ia-decisoes', label: 'Como a IA Decide' },
          { id: 'etica', label: 'Ética' },
          { id: 'privacidade', label: 'Privacidade' },
          { id: 'inclusao', label: 'Inclusão' },
          { id: 'lideres', label: 'Para Líderes' },
          { id: 'casos-uso', label: 'Casos de Uso' },
          { id: 'exemplos', label: 'Exemplos' },
        ].map(s => (
          <button key={s.id} onClick={() => setSecaoAtiva(s.id)} style={{
            padding: '6px 14px', borderRadius: 99, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'all 0.15s',
            background: secaoAtiva === s.id ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
            color: secaoAtiva === s.id ? '#10b981' : 'rgba(240,253,244,0.4)',
            outline: secaoAtiva === s.id ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(255,255,255,0.05)',
          }}>{s.label}</button>
        ))}
      </div>

      {/* MISSÃO */}
      {secaoAtiva === 'missao' && (
        <div>
          <SectionTitle numero="01" titulo="Missão do Método Essencial HAI" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div style={{ padding: '28px', borderRadius: 20, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Missão Central</div>
              <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.75)', lineHeight: 1.9 }}>
                Transformar a forma como organizações compreendem e desenvolvem pessoas, colocando a inteligência humana no centro de todas as decisões estratégicas de RH e liderança.
              </p>
            </div>
            <div style={{ padding: '28px', borderRadius: 20, background: 'rgba(52,211,153,0.04)', border: '1px solid rgba(52,211,153,0.1)' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Visão de Futuro</div>
              <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.75)', lineHeight: 1.9 }}>
                Um mundo onde nenhum potencial humano é desperdiçado por falta de compreensão. Onde líderes têm as ferramentas para reconhecer, adaptar e desenvolver cada pessoa de forma genuína.
              </p>
            </div>
          </div>
          <div style={{ padding: '28px', borderRadius: 20, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(240,253,244,0.35)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>Por que o Método HAI existe</div>
            {[
              { icon: '🔴', ponto: 'O problema que resolve', texto: '72% dos colaboradores que pedem demissão afirmam que o motivo principal foi a relação com a liderança direta. Não salário. Não benefícios. Liderança. O Método HAI existe porque gestores precisam de mais do que boa vontade — precisam de dados e ferramentas para liderar com precisão.' },
              { icon: '🟡', ponto: 'O que estava faltando', texto: 'As ferramentas de RH disponíveis no mercado são fragmentadas: uma para DISC, outra para clima, outra para feedback. Nenhuma integra comportamento, bem-estar, liderança e cultura em um único sistema com IA no centro.' },
              { icon: '🟢', ponto: 'O que o HAI entrega', texto: 'Uma plataforma proprietária que unifica assessment comportamental, análise de bem-estar, avaliação de liderança e fit cultural em um Human Score único, com inteligência artificial que traduz dados em ações concretas para cada gestor.' },
            ].map((p, i) => (
              <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(240,253,244,0.5)', marginBottom: 6 }}>{p.icon} {p.ponto}</div>
                <p style={{ fontSize: 13, color: 'rgba(240,253,244,0.6)', lineHeight: 1.8, margin: 0 }}>{p.texto}</p>
              </div>
            ))}
          </div>
          <FraseAncora />
        </div>
      )}

      {/* PRINCÍPIOS */}
      {secaoAtiva === 'principios' && (
        <div>
          <SectionTitle numero="02" titulo="Princípios Fundadores" />
          <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.5)', lineHeight: 1.8, marginBottom: 24 }}>Os princípios do Método HAI não são aspirações. São restrições operacionais que guiam cada funcionalidade, cada algoritmo e cada recomendação gerada pelo sistema.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { num: '01', titulo: 'A pessoa vem antes do dado', cor: '#10b981', texto: 'Dados comportamentais existem para servir o desenvolvimento humano, nunca para rotular, excluir ou punir. Qualquer uso que inverta essa ordem viola os princípios do Método.' },
              { num: '02', titulo: 'Diferença é ativo, não risco', cor: '#0ea5e9', texto: 'Perfis diferentes produzem equipes mais resilientes. O Método HAI não busca a uniformidade comportamental. Busca a complementaridade consciente entre pessoas diferentes.' },
              { num: '03', titulo: 'Liderança é adaptação, não autoridade', cor: '#a78bfa', texto: 'A eficácia de um líder é medida pela sua capacidade de se adaptar ao perfil de cada liderado, não pela consistência de seu próprio estilo. O HAI ensina líderes a mudar sua abordagem, não suas pessoas.' },
              { num: '04', titulo: 'IA amplifica, humano decide', cor: '#f59e0b', texto: 'Nenhuma recomendação gerada pela IA deve ser executada sem avaliação humana. O sistema fornece análise. A decisão — sobre promoção, desenvolvimento, realocação — é sempre do gestor ou do RH.' },
              { num: '05', titulo: 'Evidência antes de opinião', cor: '#34d399', texto: 'Decisões sobre pessoas devem ser baseadas em dados coletados eticamente, não em impressões, preferências ou afinidades pessoais. O HAI transforma percepção subjetiva em evidência objetiva.' },
              { num: '06', titulo: 'Desenvolvimento é contínuo', cor: '#f97316', texto: 'Nenhum score é definitivo. Uma pessoa com Human Score 45 hoje pode alcançar 78 em 90 dias com o desenvolvimento correto. O Método trata todo índice como ponto de partida, não de chegada.' },
            ].map((p, i) => (
              <div key={i} style={{ padding: '20px 24px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: `1px solid ${p.cor}15`, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 11, fontWeight: 900, color: p.cor, minWidth: 28, opacity: 0.6 }}>{p.num}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: p.cor, marginBottom: 6 }}>{p.titulo}</div>
                  <p style={{ fontSize: 13, color: 'rgba(240,253,244,0.55)', lineHeight: 1.8, margin: 0 }}>{p.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PILARES */}
      {secaoAtiva === 'pilares' && (
        <div>
          <SectionTitle numero="03" titulo="Os 5 Pilares do Método Essencial HAI" />
          <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.5)', lineHeight: 1.8, marginBottom: 24 }}>
            H-A-I-IA-E formam o ciclo completo de inteligência humana aplicada à liderança. Cada pilar é ao mesmo tempo um princípio filosófico e uma funcionalidade operacional da plataforma.
          </p>
          {PILARES.map((p, i) => (
            <div key={i} style={{ marginBottom: 20, padding: '28px', borderRadius: 20, background: `${p.cor}06`, border: `1px solid ${p.cor}18` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${p.cor}15`, border: `2px solid ${p.cor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: p.cor, flexShrink: 0 }}>{p.letra}</div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: p.cor, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>Pilar {i + 1}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#f0fdf4' }}>{p.nome}</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.7)', lineHeight: 1.8, marginBottom: 16 }}>{p.desc}</p>
              <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(0,0,0,0.2)', marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: p.cor, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Princípio operacional</div>
                <p style={{ fontSize: 12, color: 'rgba(240,253,244,0.5)', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>{p.principio}</p>
              </div>
              <div style={{ padding: '14px 16px', borderRadius: 12, background: `${p.cor}08` }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: p.cor, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Exemplo prático</div>
                <p style={{ fontSize: 12, color: 'rgba(240,253,244,0.5)', lineHeight: 1.7, margin: 0 }}>{p.pratica}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ÍNDICES */}
      {secaoAtiva === 'indices' && (
        <div>
          <SectionTitle numero="04" titulo="Os 4 Índices Proprietários HAI" />
          <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.5)', lineHeight: 1.8, marginBottom: 24 }}>Os índices HAI são as unidades de medida do Método. Cada um avalia uma dimensão crítica do ativo humano e, juntos, compõem o Human Score HAI.</p>
          <div style={{ padding: '18px 24px', borderRadius: 16, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(240,253,244,0.3)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Fórmula do Human Score HAI</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', fontSize: 13, fontWeight: 700 }}>
              {INDICES.map((idx, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: idx.cor }}>{idx.sigla} × {idx.peso}%</span>
                  {i < INDICES.length - 1 && <span style={{ color: 'rgba(240,253,244,0.2)' }}>+</span>}
                </div>
              ))}
              <span style={{ color: 'rgba(240,253,244,0.2)' }}>=</span>
              <span style={{ color: '#34d399', fontWeight: 900 }}>Human Score HAI</span>
            </div>
          </div>
          {INDICES.map((idx, i) => (
            <div key={i} style={{ marginBottom: 14, padding: '22px 24px', borderRadius: 18, background: `${idx.cor}06`, border: `1px solid ${idx.cor}18` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: idx.cor, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>{idx.sigla}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#f0fdf4' }}>{idx.nome}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: idx.cor, lineHeight: 1 }}>{idx.peso}%</div>
                  <div style={{ fontSize: 9, color: 'rgba(240,253,244,0.3)', fontWeight: 700 }}>peso no Human Score</div>
                </div>
              </div>
              <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)', marginBottom: 14 }}>
                <div style={{ height: '100%', width: `${idx.peso * 2}%`, background: idx.cor, borderRadius: 99 }} />
              </div>
              <p style={{ fontSize: 13, color: 'rgba(240,253,244,0.55)', lineHeight: 1.75, margin: 0 }}>{idx.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* IA DECISOES */}
      {secaoAtiva === 'ia-decisoes' && (
        <div>
          <SectionTitle numero="05" titulo="Como a IA Toma Decisões" />
          <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.5)', lineHeight: 1.8, marginBottom: 24 }}>A IA do Ecossistema Essencial HAI não é uma caixa preta. Cada análise, recomendação e alerta tem uma lógica transparente e auditável.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
            {[
              { passo: '01', titulo: 'Coleta estruturada', cor: '#10b981', texto: 'O colaborador responde assessments padronizados (DISC, Liderança, Inteligência, Bem-Estar, Fit Cultural). As respostas são pontuadas em escalas validadas e convertidas em scores por dimensão.' },
              { passo: '02', titulo: 'Ponderação proprietária', cor: '#0ea5e9', texto: 'Os 4 índices HAI (IQH, IEBO, IEIH, IHAL™) são calculados a partir dos scores de cada assessment, ponderados pelos pesos definidos pela metodologia (25%/30%/20%/25%).' },
              { passo: '03', titulo: 'Análise contextual', cor: '#f59e0b', texto: 'O modelo de linguagem (Gemini) recebe os dados estruturados e os interpreta considerando o contexto: módulo avaliado, combinação de dimensões, padrões de resposta.' },
              { passo: '04', titulo: 'Geração de insights', cor: '#a78bfa', texto: 'A IA produz análises em linguagem natural, estruturadas em blocos específicos: perfil atual, pontos cegos, alavancas de desenvolvimento, ações concretas para o gestor.' },
              { passo: '05', titulo: 'Validação humana', cor: '#34d399', texto: 'Toda análise gerada é apresentada ao gestor como recomendação, não como verdade. O gestor contextualize com o conhecimento que tem da pessoa real antes de agir.' },
              { passo: '06', titulo: 'Sem decisão autônoma', cor: '#f97316', texto: 'A IA não move pessoas de cargo, não encerra contratos, não aprova promoções. Ela informa. A decisão final é sempre humana. Sempre.' },
            ].map((p, i) => (
              <div key={i} style={{ padding: '20px', borderRadius: 16, background: `${p.cor}06`, border: `1px solid ${p.cor}12` }}>
                <div style={{ fontSize: 9, fontWeight: 900, color: p.cor, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Etapa {p.passo}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#f0fdf4', marginBottom: 8 }}>{p.titulo}</div>
                <p style={{ fontSize: 12, color: 'rgba(240,253,244,0.5)', lineHeight: 1.75, margin: 0 }}>{p.texto}</p>
              </div>
            ))}
          </div>
          <FraseAncora />
        </div>
      )}

      {/* ETICA */}
      {secaoAtiva === 'etica' && (
        <div>
          <SectionTitle numero="06" titulo="Limites Éticos do Método HAI" />
          <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.5)', lineHeight: 1.8, marginBottom: 24 }}>O Método HAI opera com limites éticos não negociáveis. Esses limites estão codificados na plataforma, nos contratos e na cultura do Ecossistema Essencial Digital.</p>
          {ETICA_PRINCIPIOS.map((p, i) => (
            <div key={i} style={{ marginBottom: 12, padding: '20px 24px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 16 }}>
              <div style={{ fontSize: 20, flexShrink: 0 }}>⚖️</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#10b981', marginBottom: 6 }}>{p.titulo}</div>
                <p style={{ fontSize: 13, color: 'rgba(240,253,244,0.55)', lineHeight: 1.8, margin: 0 }}>{p.desc}</p>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 20, padding: '20px 24px', borderRadius: 18, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#ef4444', marginBottom: 10 }}>Usos Proibidos da Plataforma</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Usar scores HAI como critério exclusivo de demissão',
                'Compartilhar dados individuais sem consentimento do colaborador',
                'Aplicar assessments sem comunicar o propósito ao avaliado',
                'Criar ranking de colaboradores baseado apenas no Human Score',
                'Usar análises de IA para justificar decisões já tomadas por outros motivos',
              ].map((u, i) => (
                <div key={i} style={{ fontSize: 12, color: 'rgba(240,253,244,0.45)', display: 'flex', gap: 8 }}>
                  <span style={{ color: '#ef4444', fontWeight: 900 }}>✕</span>
                  <span>{u}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRIVACIDADE */}
      {secaoAtiva === 'privacidade' && (
        <div>
          <SectionTitle numero="07" titulo="Como o Método HAI Protege a Privacidade" />
          <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.5)', lineHeight: 1.8, marginBottom: 24 }}>Dados comportamentais são dados sensíveis. O Método HAI trata a privacidade do colaborador como condição inegociável para a operação da plataforma.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            {[
              { titulo: 'Consentimento explícito', icone: '✅', desc: 'Nenhum assessment é aplicado sem que o colaborador saiba o propósito, quem terá acesso e como os dados serão usados.' },
              { titulo: 'Acesso segmentado', icone: '🔐', desc: 'Gestores acessam apenas os dados de seus liderados. RH acessa dados agregados. Nenhum colega vê o perfil do outro.' },
              { titulo: 'Dados não vendidos', icone: '🚫', desc: 'Dados comportamentais individuais não são vendidos, compartilhados com terceiros ou usados para treinar modelos externos sem consentimento.' },
              { titulo: 'Direito de acesso', icone: '📋', desc: 'O colaborador pode solicitar a qualquer momento uma cópia de todos os dados coletados sobre ele na plataforma.' },
              { titulo: 'Direito ao esquecimento', icone: '🗑️', desc: 'O colaborador pode solicitar a exclusão total de seus dados. A exclusão é irreversível e ocorre em até 30 dias.' },
              { titulo: 'Relatórios anonimizados', icone: '🔒', desc: 'Análises coletivas e benchmarks são sempre anonimizados, sem possibilidade de identificação individual.' },
            ].map((p, i) => (
              <div key={i} style={{ padding: '18px 20px', borderRadius: 16, background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.1)' }}>
                <div style={{ fontSize: 18, marginBottom: 8 }}>{p.icone}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#10b981', marginBottom: 6 }}>{p.titulo}</div>
                <p style={{ fontSize: 12, color: 'rgba(240,253,244,0.5)', lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: '18px 20px', borderRadius: 14, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', fontSize: 12, color: 'rgba(240,253,244,0.35)', lineHeight: 1.7 }}>
            O Ecossistema Essencial Digital opera em conformidade com a LGPD (Lei Geral de Proteção de Dados, Lei 13.709/2018) e com os princípios do GDPR para clientes internacionais.
          </div>
        </div>
      )}

      {/* INCLUSAO */}
      {secaoAtiva === 'inclusao' && (
        <div>
          <SectionTitle numero="08" titulo="Como o Método HAI Promove Inclusão" />
          <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.5)', lineHeight: 1.8, marginBottom: 24 }}>Inclusão no HAI não é política de diversidade. É arquitetura de liderança. O Método foi construído para que cada pessoa possa contribuir de um lugar de autenticidade.</p>
          {[
            { titulo: 'Diversidade de perfis como estratégia', cor: '#10b981', desc: 'O Método HAI demonstra quantitativamente que equipes com perfis DISC complementares (D+I+S+C) entregam maior resiliência e criatividade do que equipes homogêneas. Diversidade comportamental é vantagem competitiva, não obrigação legal.' },
            { titulo: 'Eliminação de vieses na gestão', cor: '#0ea5e9', desc: 'Gestores tendem a desenvolver mais as pessoas que se parecem com eles. O DISC HAI e o Human Score criam uma base objetiva que contrapõe esse viés, revelando potenciais que seriam ignorados em gestão puramente intuitiva.' },
            { titulo: 'Adaptação como padrão de liderança', cor: '#a78bfa', desc: 'O pilar A do Método (Adaptar) torna a adaptação do líder ao liderado o comportamento esperado, não a exceção. Isso cria condições equitativas para pessoas com estilos diferentes de aprender, se comunicar e entregar.' },
            { titulo: 'Segurança psicológica como índice', cor: '#f59e0b', desc: 'O IEBO inclui Segurança Psicológica como dimensão mensurada. Isso torna visível um problema que costuma ser invisível até que seja tarde. Ambientes com baixa segurança psicológica são ambientes que excluem silenciosamente.' },
            { titulo: 'Inclusão de perfis fora do padrão', cor: '#34d399', desc: 'O HAI foi projetado para revelar o valor de colaboradores que não se encaixam no perfil "ideal" imaginado pelo gestor. Um profissional com Conformidade alta e Influência baixa raramente vira destaque em avaliações subjetivas, mas pode ser essencial para a qualidade dos processos.' },
          ].map((p, i) => (
            <div key={i} style={{ marginBottom: 12, padding: '22px 24px', borderRadius: 18, background: `${p.cor}06`, border: `1px solid ${p.cor}12` }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: p.cor, marginBottom: 8 }}>{p.titulo}</div>
              <p style={{ fontSize: 13, color: 'rgba(240,253,244,0.55)', lineHeight: 1.8, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* LIDERES */}
      {secaoAtiva === 'lideres' && (
        <div>
          <SectionTitle numero="09" titulo="Como o Método HAI Apoia Líderes" />
          <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.5)', lineHeight: 1.8, marginBottom: 24 }}>O Método HAI foi construído para o gestor que quer liderar bem, mas não tem tempo nem ferramentas para compreender cada pessoa em profundidade. Nós resolvemos isso.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 24 }}>
            {[
              { icone: '🔍', titulo: 'Compreensão profunda', desc: 'Em 20 minutos, o gestor acessa um perfil comportamental completo do colaborador, com interpretação em linguagem natural gerada pela IA.' },
              { icone: '🎯', titulo: 'Ações específicas', desc: 'Cada análise entrega ações práticas para as próximas semanas. Não "dê feedback". Sim: "numa conversa 1:1, aborde o ponto X desta forma, com esta linguagem."' },
              { icone: '🚨', titulo: 'Alertas antecipados', desc: 'O sistema identifica quedas de índice antes que virem problema. O gestor recebe o sinal quando ainda há tempo de agir.' },
              { icone: '📊', titulo: 'Visão de equipe', desc: 'Além do indivíduo, o gestor vê padrões coletivos: distribuição de perfis DISC, saúde geral da equipe, riscos de desalinhamento cultural.' },
              { icone: '🧭', titulo: 'Desenvolvimento orientado', desc: 'O Plano de Desenvolvimento HAI é gerado especificamente para cada perfil. Não é um treinamento genérico. É o próximo passo certo para esta pessoa, agora.' },
              { icone: '🌱', titulo: 'Autodesenvolvimento do líder', desc: 'O Assessment IHAL™ avalia o próprio gestor. O sistema revela os pontos cegos de liderança que o gestor não consegue ver sozinho.' },
            ].map((p, i) => (
              <div key={i} style={{ padding: '20px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{p.icone}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#f0fdf4', marginBottom: 6 }}>{p.titulo}</div>
                <p style={{ fontSize: 12, color: 'rgba(240,253,244,0.45)', lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
          <FraseAncora />
        </div>
      )}

      {/* CASOS DE USO */}
      {secaoAtiva === 'casos-uso' && (
        <div>
          <SectionTitle numero="10" titulo="Casos de Uso do Método HAI" />
          <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.5)', lineHeight: 1.8, marginBottom: 24 }}>O Método HAI resolve problemas reais de gestão de pessoas. Estes são os cenários mais frequentes onde a plataforma entrega impacto mensurável.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {CASOS_USO.map((c, i) => (
              <div key={i} style={{ padding: '22px', borderRadius: 18, background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.1)' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icone}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#10b981', marginBottom: 8 }}>{c.titulo}</div>
                <p style={{ fontSize: 12, color: 'rgba(240,253,244,0.5)', lineHeight: 1.75, margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXEMPLOS PRÁTICOS */}
      {secaoAtiva === 'exemplos' && (
        <div>
          <SectionTitle numero="11" titulo="Exemplos Práticos em Ação" />
          <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.5)', lineHeight: 1.8, marginBottom: 24 }}>Situações reais de gestão e como o Método HAI muda o desfecho de cada uma.</p>
          {[
            {
              situacao: 'Colaborador com baixo rendimento mas alto potencial',
              sem: 'Sem o Método HAI: o gestor percebe queda de performance, aplica feedback genérico sobre "comprometimento", o colaborador se sente incompreendido e pede demissão.',
              com: 'Com o Método HAI: o DISC revela perfil S alto (precisa de estabilidade). O Bem-Estar mostra Segurança Psicológica em 38/100. A IA indica que a queda está ligada à mudança recente de liderança, não à falta de capacidade. O gestor adapta a abordagem. O colaborador se recupera.',
              cor: '#10b981',
            },
            {
              situacao: 'Formação de equipe para projeto crítico',
              sem: 'Sem o Método HAI: o gestor escala os colaboradores disponíveis ou com quem tem mais afinidade. O time tem perfis parecidos e falha em momentos que exigem diversidade de perspectiva.',
              com: 'Com o Método HAI: o DISC HAI orienta a composição com D alta para decisões, C alta para execução, I alta para alinhamento com stakeholders, S alta para estabilidade do processo. O time entrega dentro do prazo.',
              cor: '#0ea5e9',
            },
            {
              situacao: 'Decisão de promoção justa',
              sem: 'Sem o Método HAI: dois candidatos concorrem. O gestor promove quem tem mais visibilidade e que se comunica melhor em reuniões, sem perceber que o critério favorece perfis extrovertidos.',
              com: 'Com o Método HAI: o Human Score revela que o candidato menos visível tem IHAL™ 78/100 (Liderança Adaptativa alta) e IQH 82/100, enquanto o candidato mais vocal tem IEBO 52/100 (risco de desengajamento). A promoção é baseada em dados, não em impressão.',
              cor: '#a78bfa',
            },
            {
              situacao: 'Prevenção de crise de cultura',
              sem: 'Sem o Método HAI: o RH percebe turnover crescente apenas quando os números aparecem no relatório trimestral. Já perdeu 4 pessoas-chave.',
              com: 'Com o Método HAI: a queda do Fit Cultural coletivo aparece 2 meses antes do turnover. O RH identifica que a nova política de home office conflita com o Estilo de Trabalho predominante na equipe e age antes da saída.',
              cor: '#f59e0b',
            },
          ].map((e, i) => (
            <div key={i} style={{ marginBottom: 20, padding: '24px', borderRadius: 20, background: `${e.cor}05`, border: `1px solid ${e.cor}12` }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: e.cor, marginBottom: 16 }}>Situação: {e.situacao}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Sem o Método HAI</div>
                  <p style={{ fontSize: 12, color: 'rgba(240,253,244,0.5)', lineHeight: 1.75, margin: 0 }}>{e.sem}</p>
                </div>
                <div style={{ padding: '14px 16px', borderRadius: 12, background: `${e.cor}08`, border: `1px solid ${e.cor}15` }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: e.cor, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Com o Método HAI</div>
                  <p style={{ fontSize: 12, color: 'rgba(240,253,244,0.5)', lineHeight: 1.75, margin: 0 }}>{e.com}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer do documento */}
      <div style={{ marginTop: 40, padding: '24px', borderRadius: 18, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(240,253,244,0.4)' }}>Método Essencial HAI™ — Documento Oficial</div>
          <div style={{ fontSize: 10, color: 'rgba(240,253,244,0.2)', marginTop: 2 }}>Ecossistema Essencial Digital · essencialdigital2@gmail.com · 2026</div>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(16,185,129,0.5)', fontStyle: 'italic', maxWidth: 300, textAlign: 'right' }}>
          "A IA reconhece padrões. O Método Essencial HAI ensina líderes a reconhecer pessoas."
        </div>
      </div>

      {/* Navegação entre seções */}
      <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
        <Link href="/dashboard/metodologia-hai" style={{ padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(240,253,244,0.4)', fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>
          ← Visão Geral do Método HAI
        </Link>
        <Link href="/dashboard/nexoperform" style={{ padding: '10px 20px', borderRadius: 12, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', fontWeight: 800, fontSize: 12, textDecoration: 'none' }}>
          🎯 Acessar NexoPerform HAI
        </Link>
      </div>
    </div>
  )
}

function SectionTitle({ numero, titulo }: { numero: string; titulo: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(16,185,129,0.5)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>Seção {numero}</div>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: '#f0fdf4', marginBottom: 0 }}>{titulo}</h2>
    </div>
  )
}

function FraseAncora() {
  return (
    <div style={{ padding: '18px 20px', borderRadius: 16, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', marginTop: 20 }}>
      <p style={{ fontSize: 14, margin: 0, lineHeight: 1.6 }}>
        <span style={{ color: 'rgba(240,253,244,0.4)' }}>A IA reconhece padrões. </span>
        <span style={{ color: '#10b981', fontWeight: 800 }}>O Método Essencial HAI ensina líderes a reconhecer pessoas.</span>
      </p>
    </div>
  )
}
