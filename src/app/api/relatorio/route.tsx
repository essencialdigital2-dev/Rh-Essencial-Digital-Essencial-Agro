import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

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
    marginBottom: 32,
    padding: '24 48',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  headerSub: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 3,
  },
  headerDate: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#8B5CF6',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 6,
    marginBottom: 14,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    padding: 14,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#374151',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#8B5CF6',
  },
  cardLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  kpiCard: {
    width: '22%',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#8B5CF6',
  },
  kpiLabel: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 3,
    textAlign: 'center',
  },
  table: {
    marginTop: 6,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#8B5CF6',
    padding: '6 10',
    borderRadius: '4 4 0 0',
  },
  tableHeaderCell: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    padding: '6 10',
    borderBottom: '1px solid #f3f4f6',
  },
  tableRowAlt: {
    flexDirection: 'row',
    padding: '6 10',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #f3f4f6',
  },
  tableCell: {
    fontSize: 9,
    color: '#374151',
    flex: 1,
  },
  badge: {
    fontSize: 8,
    padding: '2 6',
    borderRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '1px solid #e5e7eb',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: '8 10',
    borderRadius: 4,
    marginBottom: 6,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 1,
  },
  alertText: {
    fontSize: 9,
    color: '#374151',
    flex: 1,
  },
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
}

function RelatorioDoc({ dados, data }: { dados: RelatorioDados; data: string }) {
  const colabs = dados.colaboradores_lista || []
  const alertas = dados.alertas_lista || []

  return (
    <Document title={`Relatorio Sense AI — ${dados.empresa || 'Empresa'}`} author="Essencial Sense AI">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Essencial Sense AI</Text>
            <Text style={styles.headerSub}>Relatorio de People Analytics Preditivo</Text>
          </View>
          <View>
            <Text style={styles.headerDate}>{dados.empresa || 'Empresa'}</Text>
            <Text style={styles.headerDate}>Gerado em {data}</Text>
          </View>
        </View>

        {/* KPIs */}
        <Text style={styles.sectionTitle}>Visao Geral da Empresa</Text>
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{dados.colaboradores ?? '—'}</Text>
            <Text style={styles.kpiLabel}>Colaboradores</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{dados.checkins_hoje ?? '—'}</Text>
            <Text style={styles.kpiLabel}>Check-ins Hoje</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{dados.humor_positivo ?? '—'}</Text>
            <Text style={styles.kpiLabel}>Humor Positivo</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{dados.alertas_nr1 ?? '0'}</Text>
            <Text style={styles.kpiLabel}>Alertas NR-1</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{dados.enps ?? '—'}</Text>
            <Text style={styles.kpiLabel}>eNPS</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{dados.engajamento ?? '—'}</Text>
            <Text style={styles.kpiLabel}>Engajamento</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{dados.disc_respondidos ?? '0'}</Text>
            <Text style={styles.kpiLabel}>DISC Respondidos</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{dados.feedbacks ?? '0'}</Text>
            <Text style={styles.kpiLabel}>Feedbacks 360</Text>
          </View>
        </View>

        {/* IA Preditiva */}
        <Text style={styles.sectionTitle}>IA Preditiva — Indicadores de Risco</Text>
        <View style={styles.row}>
          <View style={[styles.card, styles.col]}>
            <Text style={styles.cardTitle}>Score de Risco de Saida</Text>
            <Text style={styles.cardValue}>{dados.score_saida ?? '—'}</Text>
            <Text style={styles.cardLabel}>Media da empresa (0-100)</Text>
          </View>
          <View style={[styles.card, styles.col]}>
            <Text style={styles.cardTitle}>Janela de Demissao</Text>
            <Text style={styles.cardValue}>{dados.janela_demissao ?? '—'}</Text>
            <Text style={styles.cardLabel}>Colaboradores em periodo critico</Text>
          </View>
          <View style={[styles.card, styles.col]}>
            <Text style={styles.cardTitle}>Previsao Absenteismo</Text>
            <Text style={styles.cardValue}>{dados.absenteismo ?? '—'}</Text>
            <Text style={styles.cardLabel}>Probabilidade proximas 2 semanas</Text>
          </View>
          <View style={[styles.card, styles.col]}>
            <Text style={styles.cardTitle}>Coerencia DISC</Text>
            <Text style={styles.cardValue}>{dados.coerencia_disc ?? '—'}</Text>
            <Text style={styles.cardLabel}>Equilibrio de perfis na equipe</Text>
          </View>
        </View>

        {/* Alertas NR-1 */}
        {alertas.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Alertas NR-1 Ativos</Text>
            {alertas.slice(0, 8).map((a, i) => {
              const cor = a.severidade === 'critico' ? '#EF4444' : a.severidade === 'moderado' ? '#F59E0B' : '#10B981'
              return (
                <View key={i} style={[styles.alertRow, { backgroundColor: cor + '10', border: `1px solid ${cor}30` }]}>
                  <View style={[styles.alertDot, { backgroundColor: cor }]} />
                  <Text style={styles.alertText}>{a.descricao}</Text>
                </View>
              )
            })}
          </>
        )}

        {/* Tabela de colaboradores */}
        {colabs.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Ranking de Risco — Colaboradores</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Colaborador</Text>
                <Text style={styles.tableHeaderCell}>Cargo</Text>
                <Text style={styles.tableHeaderCell}>Equipe</Text>
                <Text style={styles.tableHeaderCell}>Score</Text>
                <Text style={styles.tableHeaderCell}>Nivel</Text>
              </View>
              {colabs.slice(0, 15).map((c, i) => {
                const cor = (c.score ?? 0) >= 60 ? '#EF4444' : (c.score ?? 0) >= 35 ? '#F59E0B' : '#10B981'
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

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Essencial Sense AI — rhessencialdigital.com.br</Text>
          <Text style={styles.footerText}>Relatorio gerado automaticamente em {data}</Text>
        </View>
      </Page>
    </Document>
  )
}

export async function POST(req: NextRequest) {
  try {
    const dados: RelatorioDados = await req.json()
    const data = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

    const buffer = await renderToBuffer(<RelatorioDoc dados={dados} data={data} />)
    const uint8 = new Uint8Array(buffer)

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-sense-${new Date().toISOString().split('T')[0]}.pdf"`,
        'Content-Length': uint8.length.toString(),
      },
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
