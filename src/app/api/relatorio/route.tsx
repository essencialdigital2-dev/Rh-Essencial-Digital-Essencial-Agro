import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 48,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1e1e2e',
  },
  header: {
    backgroundColor: '#8B5CF6',
    margin: -48,
    marginBottom: 28,
    padding: '24 48',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  headerSub: { fontSize: 9, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
  headerDate: { fontSize: 9, color: 'rgba(255,255,255,0.7)', textAlign: 'right' },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#8B5CF6',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 5,
    marginBottom: 12,
    marginTop: 18,
  },
  card: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  cardTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#374151', marginBottom: 3 },
  cardValue: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#8B5CF6' },
  cardLabel: { fontSize: 8, color: '#6b7280', marginTop: 2 },
  row: { flexDirection: 'row', gap: 8 },
  col: { flex: 1 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  kpiCard: {
    width: '22%',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  kpiValue: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#8B5CF6' },
  kpiLabel: { fontSize: 8, color: '#6b7280', marginTop: 2, textAlign: 'center' },
  table: { marginTop: 4 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#8B5CF6',
    padding: '5 8',
    borderRadius: '4 4 0 0',
  },
  tableHeaderCell: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#ffffff', flex: 1 },
  tableRow: { flexDirection: 'row', padding: '5 8', borderBottom: '1px solid #f3f4f6' },
  tableRowAlt: { flexDirection: 'row', padding: '5 8', backgroundColor: '#f9fafb', borderBottom: '1px solid #f3f4f6' },
  tableCell: { fontSize: 8, color: '#374151', flex: 1 },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '1px solid #e5e7eb',
    paddingTop: 6,
  },
  footerText: { fontSize: 7, color: '#9ca3af' },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    padding: '7 8',
    borderRadius: 4,
    marginBottom: 5,
  },
  alertDot: { width: 7, height: 7, borderRadius: 4, marginTop: 1 },
  alertText: { fontSize: 9, color: '#374151', flex: 1 },
  // NR-1 compliance box
  nr1Box: {
    backgroundColor: '#f0fdf4',
    border: '1.5px solid #16a34a',
    borderRadius: 8,
    padding: '12 14',
    marginBottom: 8,
  },
  nr1BoxAlert: {
    backgroundColor: '#fef9c3',
    border: '1.5px solid #ca8a04',
    borderRadius: 8,
    padding: '12 14',
    marginBottom: 8,
  },
  nr1Title: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#16a34a', marginBottom: 5 },
  nr1TitleAlert: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#ca8a04', marginBottom: 5 },
  nr1Text: { fontSize: 8.5, color: '#374151', lineHeight: 1.5 },
  nr1Item: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  nr1Check: { fontSize: 9, color: '#16a34a', fontFamily: 'Helvetica-Bold', width: 12 },
  nr1CheckAlert: { fontSize: 9, color: '#ca8a04', fontFamily: 'Helvetica-Bold', width: 12 },
  // ISHO
  ishoBox: {
    backgroundColor: '#faf5ff',
    border: '1px solid #d8b4fe',
    borderRadius: 8,
    padding: '12 14',
    marginBottom: 8,
  },
  ishoScore: { fontSize: 28, fontFamily: 'Helvetica-Bold', color: '#8B5CF6' },
  // IA box
  iaBox: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: 8,
    padding: '12 14',
    marginBottom: 8,
  },
  iaTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#1d4ed8', marginBottom: 6 },
  iaText: { fontSize: 9, color: '#374151', lineHeight: 1.6 },
  // Período
  periodoBox: {
    backgroundColor: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: 6,
    padding: '8 12',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodoText: { fontSize: 8.5, color: '#64748b' },
  periodoVal: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#1e1e2e' },
  // Recomendações
  recBox: {
    backgroundColor: '#fff7ed',
    border: '1px solid #fed7aa',
    borderRadius: 6,
    padding: '8 12',
    marginBottom: 6,
    flexDirection: 'row',
    gap: 8,
  },
  recNum: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#ea580c', width: 14 },
  recText: { fontSize: 8.5, color: '#374151', flex: 1, lineHeight: 1.5 },
  // Compliance status
  complianceRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  complianceItem: {
    flex: 1,
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    padding: '8 10',
    alignItems: 'center',
  },
  complianceIcon: { fontSize: 14, marginBottom: 3 },
  complianceLabel: { fontSize: 7.5, color: '#6b7280', textAlign: 'center' },
  complianceStatus: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginTop: 2 },
})

type Colaborador = {
  nome: string
  cargo?: string
  equipe?: string
  score?: number
  risco?: string
}

type Alerta = {
  descricao: string
  severidade: string
}

type RelatorioDados = {
  empresa?: string
  plano?: string
  colaboradores?: number
  checkins_hoje?: number
  humor_positivo?: string
  disc_respondidos?: number
  perfil_dominante?: string
  alertas_nr1?: number
  enps?: number | string
  engajamento?: string
  seguranca?: string
  feedbacks?: number
  score_saida?: number | string
  janela_demissao?: number | string
  absenteismo?: string
  coerencia_disc?: string
  colaboradores_lista?: Colaborador[]
  alertas_lista?: Alerta[]
  // Novos campos
  isho_score?: number
  isho_nivel?: string
  isho_tendencia?: string
  diagnostico_ia?: string
  recomendacoes_ia?: string[]
  periodo_inicio?: string
  periodo_fim?: string
  responsavel_rh?: string
}

function nivelCor(nivel?: string) {
  if (nivel === 'saudavel') return '#16a34a'
  if (nivel === 'critico') return '#dc2626'
  return '#ca8a04'
}

function nivelLabel(nivel?: string) {
  if (nivel === 'saudavel') return 'Saudável'
  if (nivel === 'critico') return 'Crítico'
  return 'Atenção'
}

function tendenciaLabel(t?: string) {
  if (t === 'subindo') return '↑ Subindo'
  if (t === 'caindo') return '↓ Caindo'
  return '→ Estável'
}

function RelatorioDoc({ dados, dataGeracao }: { dados: RelatorioDados; dataGeracao: string }) {
  const colabs = dados.colaboradores_lista || []
  const alertas = dados.alertas_lista || []
  const recomendacoes = dados.recomendacoes_ia || [
    'Realizar reuniões individuais com colaboradores em risco alto nas próximas 2 semanas',
    'Implementar pausas estruturadas para equipes com energia abaixo de 3,0',
    'Revisar distribuição de carga de trabalho nos setores com maior índice de estresse',
    'Estimular participação no check-in diário para aumentar engajamento e precisão do ISHO',
  ]

  const periodoInicio = dados.periodo_inicio || new Date(new Date().setDate(1)).toLocaleDateString('pt-BR')
  const periodoFim = dados.periodo_fim || new Date().toLocaleDateString('pt-BR')
  const ishoNivelCor = nivelCor(dados.isho_nivel)
  const temAlertas = alertas.length > 0
  const alertasCriticos = alertas.filter(a => a.severidade === 'critico').length

  return (
    <Document title={`Relatório NR-1 — ${dados.empresa || 'Empresa'} — ${dataGeracao}`} author="Essencial Sense AI">
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Essencial Sense AI</Text>
            <Text style={styles.headerSub}>Relatório de Saúde Organizacional e Conformidade NR-1</Text>
          </View>
          <View>
            <Text style={styles.headerDate}>{dados.empresa || 'Empresa'}</Text>
            <Text style={styles.headerDate}>Gerado em {dataGeracao}</Text>
            {dados.responsavel_rh && <Text style={styles.headerDate}>RH: {dados.responsavel_rh}</Text>}
          </View>
        </View>

        {/* Período de referência */}
        <View style={styles.periodoBox}>
          <View>
            <Text style={styles.periodoText}>Período de referência</Text>
            <Text style={styles.periodoVal}>{periodoInicio} a {periodoFim}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.periodoText}>Documento gerado por</Text>
            <Text style={styles.periodoVal}>Essencial Sense AI — IA Preditiva de RH</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.periodoText}>Plano</Text>
            <Text style={[styles.periodoVal, { color: '#8B5CF6' }]}>{dados.plano || 'Growth'}</Text>
          </View>
        </View>

        {/* Conformidade NR-1 */}
        <Text style={styles.sectionTitle}>Conformidade NR-1 — Riscos Psicossociais (MTE 2025)</Text>

        <View style={temAlertas && alertasCriticos > 0 ? styles.nr1BoxAlert : styles.nr1Box}>
          <Text style={temAlertas && alertasCriticos > 0 ? styles.nr1TitleAlert : styles.nr1Title}>
            {temAlertas && alertasCriticos > 0
              ? `⚠ Atenção — ${alertasCriticos} risco(s) crítico(s) identificado(s)`
              : '✓ Empresa monitorando riscos psicossociais — NR-1 Atualizada (vigência maio/2025)'}
          </Text>
          <Text style={styles.nr1Text}>
            A NR-1 (Norma Regulamentadora nº 1 do MTE), atualizada pela Portaria MTE nº 1.419/2024 com vigência a partir de 26/05/2025,
            passou a exigir que todas as empresas identifiquem, avaliem e gerenciem os riscos psicossociais no ambiente de trabalho,
            incluindo estresse ocupacional, assédio, sobrecarga e esgotamento (burnout). Este relatório documenta o cumprimento
            dessas obrigações com base nos dados coletados pelo sistema Essencial Sense AI.
          </Text>
        </View>

        <View style={styles.complianceRow}>
          {[
            { icon: dados.checkins_hoje ? '✓' : '○', label: 'Monitoramento\ncontínuo', status: dados.checkins_hoje ? 'Ativo' : 'Pendente', ok: !!dados.checkins_hoje },
            { icon: dados.disc_respondidos ? '✓' : '○', label: 'Mapeamento\ncomportamental', status: dados.disc_respondidos ? 'Realizado' : 'Pendente', ok: !!dados.disc_respondidos },
            { icon: dados.alertas_nr1 === 0 ? '✓' : '⚠', label: 'Alertas\nNR-1', status: dados.alertas_nr1 === 0 ? 'Sem alertas' : `${dados.alertas_nr1} alertas`, ok: dados.alertas_nr1 === 0 },
            { icon: dados.isho_score ? '✓' : '○', label: 'ISHO\nOrganizacional', status: dados.isho_score ? `Score ${dados.isho_score}` : 'Não calculado', ok: !!dados.isho_score },
            { icon: recomendacoes.length > 0 ? '✓' : '○', label: 'Plano de\nação', status: 'Gerado por IA', ok: true },
          ].map((item, i) => (
            <View key={i} style={styles.complianceItem}>
              <Text style={[styles.complianceIcon, { color: item.ok ? '#16a34a' : '#ca8a04' }]}>{item.icon}</Text>
              <Text style={styles.complianceLabel}>{item.label}</Text>
              <Text style={[styles.complianceStatus, { color: item.ok ? '#16a34a' : '#ca8a04' }]}>{item.status}</Text>
            </View>
          ))}
        </View>

        {/* KPIs */}
        <Text style={styles.sectionTitle}>Indicadores do Período</Text>
        <View style={styles.kpiGrid}>
          {[
            { val: dados.colaboradores ?? '—', label: 'Colaboradores' },
            { val: dados.checkins_hoje ?? '—', label: 'Check-ins' },
            { val: dados.humor_positivo ?? '—', label: 'Humor Positivo' },
            { val: dados.alertas_nr1 ?? '0', label: 'Alertas NR-1' },
            { val: dados.enps ?? '—', label: 'eNPS' },
            { val: dados.engajamento ?? '—', label: 'Engajamento' },
            { val: dados.disc_respondidos ?? '0', label: 'DISC Feitos' },
            { val: dados.feedbacks ?? '0', label: 'Feedbacks 360' },
          ].map((k, i) => (
            <View key={i} style={styles.kpiCard}>
              <Text style={styles.kpiValue}>{String(k.val)}</Text>
              <Text style={styles.kpiLabel}>{k.label}</Text>
            </View>
          ))}
        </View>

        {/* ISHO */}
        {dados.isho_score != null && (
          <>
            <Text style={styles.sectionTitle}>ISHO — Índice de Saúde Humana Organizacional</Text>
            <View style={[styles.ishoBox, { borderColor: ishoNivelCor + '80' }]}>
              <View style={styles.row}>
                <View style={{ width: 90, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={[styles.ishoScore, { color: ishoNivelCor }]}>{dados.isho_score}</Text>
                  <Text style={{ fontSize: 8, color: '#6b7280' }}>/100</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                    <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: ishoNivelCor }}>
                      {nivelLabel(dados.isho_nivel)}
                    </Text>
                    <Text style={{ fontSize: 10, color: '#6b7280' }}>
                      {tendenciaLabel(dados.isho_tendencia)}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 8.5, color: '#374151', lineHeight: 1.5 }}>
                    O ISHO mede a saúde coletiva da equipe com base em humor (25%), energia (20%), foco (20%),
                    estresse invertido (20%) e engajamento (15%). Scores abaixo de 55 indicam necessidade de
                    intervenção imediata conforme orientações NR-1.
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* IA Preditiva */}
        <Text style={styles.sectionTitle}>IA Preditiva — Indicadores de Risco</Text>
        <View style={styles.row}>
          {[
            { title: 'Score de Risco de Saída', val: dados.score_saida ?? '—', label: 'Média da empresa (0–100)' },
            { title: 'Janela de Demissão', val: dados.janela_demissao ?? '—', label: 'Colaboradores em período crítico' },
            { title: 'Previsão Absenteísmo', val: dados.absenteismo ?? '—', label: 'Prob. próximas 2 semanas' },
            { title: 'Coerência DISC', val: dados.coerencia_disc ?? '—', label: 'Equilíbrio de perfis na equipe' },
          ].map((c, i) => (
            <View key={i} style={[styles.card, styles.col]}>
              <Text style={styles.cardTitle}>{c.title}</Text>
              <Text style={styles.cardValue}>{String(c.val)}</Text>
              <Text style={styles.cardLabel}>{c.label}</Text>
            </View>
          ))}
        </View>

        {/* Diagnóstico IA */}
        {dados.diagnostico_ia && (
          <>
            <Text style={styles.sectionTitle}>Diagnóstico — Gemini AI</Text>
            <View style={styles.iaBox}>
              <Text style={styles.iaTitle}>🤖 Análise gerada por Inteligência Artificial</Text>
              <Text style={styles.iaText}>{dados.diagnostico_ia}</Text>
            </View>
          </>
        )}

        {/* Recomendações */}
        <Text style={styles.sectionTitle}>Plano de Ação — Recomendações da IA</Text>
        {recomendacoes.slice(0, 5).map((r, i) => (
          <View key={i} style={styles.recBox}>
            <Text style={styles.recNum}>{i + 1}.</Text>
            <Text style={styles.recText}>{r}</Text>
          </View>
        ))}

        {/* Alertas NR-1 */}
        {alertas.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Alertas NR-1 Ativos — Ação Obrigatória</Text>
            {alertas.slice(0, 8).map((a, i) => {
              const cor = a.severidade === 'critico' ? '#dc2626' : a.severidade === 'moderado' ? '#ca8a04' : '#16a34a'
              return (
                <View key={i} style={[styles.alertRow, { backgroundColor: cor + '12', border: `1px solid ${cor}30` }]}>
                  <View style={[styles.alertDot, { backgroundColor: cor }]} />
                  <Text style={styles.alertText}>{a.descricao}</Text>
                </View>
              )
            })}
          </>
        )}

        {/* Tabela colaboradores */}
        {colabs.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Ranking de Risco — Colaboradores</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Colaborador</Text>
                <Text style={styles.tableHeaderCell}>Cargo</Text>
                <Text style={styles.tableHeaderCell}>Equipe</Text>
                <Text style={styles.tableHeaderCell}>Score</Text>
                <Text style={styles.tableHeaderCell}>Nível</Text>
              </View>
              {colabs.slice(0, 15).map((c, i) => {
                const cor = (c.score ?? 0) >= 60 ? '#dc2626' : (c.score ?? 0) >= 35 ? '#ca8a04' : '#16a34a'
                return (
                  <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                    <Text style={[styles.tableCell, { flex: 2, fontFamily: 'Helvetica-Bold' }]}>{c.nome}</Text>
                    <Text style={styles.tableCell}>{c.cargo || 'Colaborador'}</Text>
                    <Text style={styles.tableCell}>{c.equipe || 'Geral'}</Text>
                    <Text style={[styles.tableCell, { color: cor, fontFamily: 'Helvetica-Bold' }]}>{c.score ?? '—'}%</Text>
                    <Text style={[styles.tableCell, { color: cor }]}>{c.risco || '—'}</Text>
                  </View>
                )
              })}
            </View>
          </>
        )}

        {/* Declaração de conformidade */}
        <View style={{ marginTop: 16, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '10 12' }}>
          <Text style={{ fontSize: 8, color: '#64748b', lineHeight: 1.6 }}>
            DECLARAÇÃO DE CONFORMIDADE: Este relatório foi gerado automaticamente pelo sistema Essencial Sense AI com base nos dados
            coletados no período indicado. As informações aqui contidas documentam as ações de identificação e monitoramento de riscos
            psicossociais realizadas pela empresa em cumprimento à NR-1 (Portaria MTE nº 1.419/2024, vigência 26/05/2025).
            Este documento pode ser apresentado em inspeções do Ministério do Trabalho e Emprego (MTE) como evidência de
            conformidade com as obrigações de gerenciamento de riscos ocupacionais. Essencial Sense AI — essencialestudo.com.br
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Essencial Sense AI — rhessencialdigital.com.br · Confidencial</Text>
          <Text style={styles.footerText}>Relatório gerado automaticamente em {dataGeracao} · NR-1 Portaria MTE 1.419/2024</Text>
        </View>

      </Page>
    </Document>
  )
}

export async function POST(req: NextRequest) {
  try {
    const dados: RelatorioDados = await req.json()
    const dataGeracao = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

    const buffer = await renderToBuffer(<RelatorioDoc dados={dados} dataGeracao={dataGeracao} />)
    const uint8 = new Uint8Array(buffer)

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-nr1-sense-${new Date().toISOString().split('T')[0]}.pdf"`,
        'Content-Length': uint8.length.toString(),
      },
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
