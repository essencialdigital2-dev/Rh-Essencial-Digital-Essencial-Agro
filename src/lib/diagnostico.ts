export const DIMENSOES: Record<number, { nome: string; qs: number[] }[]> = {
  1: [
    { nome: 'Segurança Psicológica', qs: [0,1,2] },
    { nome: 'Carga de Trabalho', qs: [3,4,5] },
    { nome: 'Liderança e Gestão', qs: [6,7,8] },
    { nome: 'Comunicação Interna', qs: [9,10,11] },
    { nome: 'Relações Interpessoais', qs: [12,13,14] },
    { nome: 'Bem-estar e Saúde', qs: [15,16,17,18,19] },
  ],
  2: [
    { nome: 'Satisfação Geral', qs: [0,1,2,3] },
    { nome: 'Liderança', qs: [4,5,6] },
    { nome: 'Comunicação', qs: [7,8,9] },
    { nome: 'Reconhecimento', qs: [10,11,12] },
    { nome: 'Engajamento', qs: [13,14,15,16,17,18,19] },
  ],
  3: [
    { nome: 'Valores e Ética', qs: [0,1,2,3] },
    { nome: 'Inovação e Aprendizado', qs: [4,5,6,7] },
    { nome: 'Identidade e Pertencimento', qs: [8,9,10,11,12] },
    { nome: 'Liderança Cultural', qs: [13,14] },
    { nome: 'Desenvolvimento e Futuro', qs: [15,16,17,18,19] },
  ],
  4: [
    { nome: 'Perfil Dominância (D)', qs: [0,1,2,3] },
    { nome: 'Perfil Influência (I)', qs: [4,5,6,7] },
    { nome: 'Perfil Estabilidade (S)', qs: [8,9,10,11] },
    { nome: 'Perfil Conformidade (C)', qs: [12,13,14,15] },
    { nome: 'Versatilidade', qs: [16,17,18,19] },
  ],
  5: [
    { nome: 'Condições de Trabalho', qs: [0,1,2,3] },
    { nome: 'Comunicação e Gestão', qs: [4,5,6,7] },
    { nome: 'Valorização e Reconhecimento', qs: [8,9,10,11] },
    { nome: 'Engajamento e Motivação', qs: [12,13,14] },
    { nome: 'Bem-estar Psicossocial', qs: [15,16,17,18,19] },
  ],
}

export const PLANO_ACAO: Record<string, string[]> = {
  'Segurança Psicológica': [
    'Realizar reuniões de escuta ativa quinzenais com a equipe.',
    'Criar canal anônimo para sugestões e feedbacks.',
    'Capacitar lideranças em comunicação não violenta.',
    'Estabelecer acordos de convivência e segurança emocional.',
  ],
  'Carga de Trabalho': [
    'Mapear e redistribuir demandas sobrecarregadas na equipe.',
    'Implementar reunião semanal de priorização de tarefas.',
    'Revisar prazos e metas com base na capacidade real da equipe.',
    'Oferecer suporte de gestão do tempo e produtividade.',
  ],
  'Liderança e Gestão': [
    'Promover programa de desenvolvimento de lideranças.',
    'Estabelecer rotina de feedback individual mensal.',
    'Alinhar expectativas entre líderes e equipe.',
    'Criar espaço de diálogo entre líderes e colaboradores.',
  ],
  'Comunicação Interna': [
    'Criar boletim semanal com informações relevantes da empresa.',
    'Padronizar canais de comunicação internos.',
    'Promover reuniões de alinhamento com toda a equipe.',
    'Treinar líderes em comunicação assertiva e transparente.',
  ],
  'Relações Interpessoais': [
    'Organizar dinâmicas de integração e teambuilding.',
    'Criar política clara de resolução de conflitos.',
    'Promover cultura de respeito e valorização das diferenças.',
    'Implementar programa de reconhecimento entre pares.',
  ],
  'Bem-estar e Saúde': [
    'Oferecer programa de apoio psicológico ou EAP.',
    'Promover ações de qualidade de vida no trabalho.',
    'Capacitar líderes para identificar sinais de esgotamento.',
    'Revisar política de horas extras e descanso.',
  ],
  'Satisfação Geral': [
    'Aplicar pesquisa de satisfação detalhada por área.',
    'Criar plano de ação coletivo com base nos resultados.',
    'Fortalecer o senso de propósito e pertencimento.',
    'Reconhecer publicamente conquistas e contribuições.',
  ],
  'Liderança': [
    'Investir em treinamento de liderança situacional.',
    'Criar rituais de feedback entre líder e equipe.',
    'Alinhar estilo de liderança aos valores da empresa.',
    'Desenvolver plano de sucessão e desenvolvimento de líderes.',
  ],
  'Comunicação': [
    'Mapear gaps de comunicação entre áreas.',
    'Implementar ferramentas colaborativas de comunicação.',
    'Treinar equipe em escuta ativa e comunicação eficaz.',
    'Criar rituais de alinhamento e transparência.',
  ],
  'Reconhecimento': [
    'Criar programa formal de reconhecimento e premiação.',
    'Treinar líderes para reconhecer resultados no dia a dia.',
    'Vincular reconhecimento aos valores organizacionais.',
    'Celebrar marcos e conquistas da equipe.',
  ],
  'Engajamento': [
    'Mapear o que engaja e desengaja cada perfil da equipe.',
    'Criar desafios e projetos que estimulem protagonismo.',
    'Alinhar funções às forças e interesses individuais.',
    'Estabelecer metas claras e com propósito compartilhado.',
  ],
  'Valores e Ética': [
    'Reforçar valores organizacionais em treinamentos e rituais.',
    'Criar código de conduta acessível e aplicado.',
    'Promover debates sobre ética e tomada de decisão.',
    'Reconhecer comportamentos alinhados aos valores da empresa.',
  ],
  'Inovação e Aprendizado': [
    'Criar cultura de experimentação e tolerância ao erro.',
    'Investir em capacitação contínua das equipes.',
    'Criar espaços para compartilhamento de ideias.',
    'Reconhecer e implementar sugestões dos colaboradores.',
  ],
  'Identidade e Pertencimento': [
    'Reforçar missão, visão e valores de forma vivencial.',
    'Promover eventos de integração e celebração cultural.',
    'Envolver equipe nas decisões estratégicas da empresa.',
    'Criar rituais que fortaleçam o senso de comunidade.',
  ],
  'Liderança Cultural': [
    'Desenvolver líderes como embaixadores da cultura.',
    'Alinhar práticas de gestão aos valores declarados.',
    'Avaliar líderes pelo exemplo cultural que transmitem.',
    'Criar programa de mentoria cultural interna.',
  ],
  'Desenvolvimento e Futuro': [
    'Criar planos individuais de desenvolvimento (PDI).',
    'Mapear trilhas de carreira claras e acessíveis.',
    'Investir em mentoria e coaching interno.',
    'Comunicar a visão de futuro da empresa com clareza.',
  ],
  'Condições de Trabalho': [
    'Revisar equipamentos, ferramentas e condições do campo.',
    'Implementar protocolo de segurança rural.',
    'Garantir adequação das condições climáticas e ergonômicas.',
    'Realizar inspeções periódicas de segurança no trabalho.',
  ],
  'Comunicação e Gestão': [
    'Promover reuniões regulares de alinhamento no campo.',
    'Criar canais de comunicação acessíveis para a equipe rural.',
    'Treinar lideranças rurais em gestão de pessoas.',
    'Estabelecer fluxo claro de informações e decisões.',
  ],
  'Valorização e Reconhecimento': [
    'Criar programa de reconhecimento para equipes rurais.',
    'Celebrar resultados da safra e metas alcançadas.',
    'Incluir colaboradores rurais em decisões estratégicas.',
    'Desenvolver trilha de crescimento para o agro.',
  ],
  'Engajamento e Motivação': [
    'Reforçar o propósito do trabalho no agronegócio.',
    'Criar desafios e metas estimulantes para a equipe.',
    'Promover espírito de equipe entre trabalhadores rurais.',
    'Reconhecer o orgulho e a identidade do trabalhador do campo.',
  ],
  'Bem-estar Psicossocial': [
    'Implementar programa de saúde mental para trabalhadores rurais.',
    'Capacitar líderes para identificar sinais de sobrecarga.',
    'Garantir períodos adequados de descanso e lazer.',
    'Criar rede de apoio entre colegas de equipe no campo.',
  ],
  'Perfil Dominância (D)': [
    'Canalizar energia de liderança para projetos desafiadores.',
    'Oferecer autonomia e espaço para tomada de decisão.',
    'Equilibrar assertividade com escuta e empatia.',
    'Desenvolver habilidade de delegação e paciência.',
  ],
  'Perfil Influência (I)': [
    'Usar a comunicação natural como ferramenta de engajamento.',
    'Desenvolver foco e disciplina para resultados concretos.',
    'Canalizar entusiasmo para motivar a equipe.',
    'Equilibrar criatividade com organização e planejamento.',
  ],
  'Perfil Estabilidade (S)': [
    'Valorizar a lealdade e consistência como diferencial.',
    'Desenvolver assertividade e posicionamento em conflitos.',
    'Usar a empatia para fortalecer relacionamentos.',
    'Estimular adaptação a mudanças de forma gradual.',
  ],
  'Perfil Conformidade (C)': [
    'Usar o perfil analítico para decisões baseadas em dados.',
    'Desenvolver flexibilidade e tolerância à ambiguidade.',
    'Equilibrar busca por qualidade com agilidade.',
    'Comunicar análises de forma clara e acessível.',
  ],
  'Versatilidade': [
    'Reconhecer e potencializar a adaptabilidade como competência.',
    'Desenvolver identidade de liderança consistente.',
    'Usar versatilidade para mediar conflitos e integrar equipes.',
    'Criar plano de desenvolvimento que honre múltiplas forças.',
  ],
}

export function calcularDimensoes(formId: number, itens: any[]) {
  const dims = DIMENSOES[formId] || []
  return dims.map(d => {
    const vals = d.qs.map(q => itens[q]?.valor_escala).filter(Boolean)
    const media = vals.length ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : 0
    return { ...d, media: parseFloat(media.toFixed(2)) }
  })
}

export function getNivel(media: number) {
  if (media >= 4.5) return { label: 'Excelente', cor: '#16a34a', emoji: '🟢' }
  if (media >= 3.5) return { label: 'Bom', cor: '#65a30d', emoji: '🟡' }
  if (media >= 2.5) return { label: 'Regular', cor: '#d97706', emoji: '🟠' }
  return { label: 'Crítico', cor: '#dc2626', emoji: '🔴' }
}
