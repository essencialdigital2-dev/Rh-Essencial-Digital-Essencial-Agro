export interface Empresa {
  id: string
  nome: string
  cnpj?: string
  segmento?: string
  responsavel?: string
  email?: string
  telefone?: string
  cidade?: string
  estado?: string
  status: string
  observacoes?: string
  senha_cliente?: string
  created_at: string
}

export interface Colaborador {
  id: string
  nome: string
  cargo?: string
  setor?: string
  empresa_id: string
  email?: string
  telefone?: string
  observacoes?: string
  tipo_pcd?: '' | 'Visual' | 'Auditiva' | 'Motora'
  token_formulario: string
  created_at: string
  empresa?: Empresa
}

export interface Lead {
  id: string
  nome?: string
  empresa?: string
  cargo?: string
  email?: string
  whatsapp?: string
  linkedin?: string
  segmento?: string
  origem?: string
  servico_interesse?: string
  temperatura: 'frio' | 'morno' | 'quente'
  status: 'novo' | 'em_contato' | 'reuniao_agendada' | 'proposta_enviada' | 'fechado' | 'perdido'
  valor_estimado?: number
  proximo_contato?: string
  observacoes?: string
  created_at: string
}

export interface Financeiro {
  id: string
  empresa_id?: string
  descricao: string
  valor: number
  tipo: 'receita' | 'despesa'
  status: 'pendente' | 'pago' | 'vencido' | 'cancelado'
  vencimento?: string
  pago_em?: string
  forma_pagamento?: string
  observacoes?: string
  created_at: string
  empresa?: Empresa
}

export interface Resposta {
  id: string
  colaborador_id: string
  formulario_id: number
  empresa_id: string
  concluido: boolean
  created_at: string
  colaborador?: Colaborador
  empresa?: Empresa
}

export interface RespostaItem {
  id: string
  resposta_id: string
  pergunta_id: number
  valor_escala?: number
  valor_texto?: string
}

export interface Formulario {
  id: number
  nome: string
  descricao?: string
  tipo: string
  ativo: boolean
}

export interface Relatorio {
  id: string
  resposta_id: string
  colaborador_id: string
  empresa_id: string
  formulario_id: number
  media_geral: number
  nivel: string
  resumo: string
  pontos_fortes: string[]
  pontos_atenção: string[]
  plano_acao: any
  created_at: string
}
