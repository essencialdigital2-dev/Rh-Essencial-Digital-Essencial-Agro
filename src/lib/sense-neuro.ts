export type NeuroPerfil = 'TDAH' | 'TEA' | 'Dislexia' | 'AltasHabilidades' | 'Descobrindo'
export type DiscTipo = 'D' | 'I' | 'S' | 'C'

export interface ConstelacaoEmocional {
  id: string
  perfil: NeuroPerfil
  disc: DiscTipo
  nome: string
  frase: string
  neurociencia: string
  saudeEmocional: {
    pontosForca: string[]
    vulnerabilidades: string[]
    sinaisBurnout: string[]
  }
  janelaNeuro: {
    melhorHorario: string
    ambienteIdeal: string
    ritmoOtimo: string
  }
  polivagal: {
    estadoDominante: string
    gatilhosOrganizacionais: string[]
    estrategiaRegulacao: string[]
  }
  proposito: {
    motivadores: string[]
    flow: string
    sentidoNoTrabalho: string
  }
  estrategiasCuidado: string[]
  paraOGestor: {
    comunicação: string
    ambiente: string
    evitar: string[]
    potencializar: string[]
  }
  acomodacoesRazoaveis: string[]
  ishoN: string
  mensagemPertencimento: string
}

const constelacoes: ConstelacaoEmocional[] = [

  // ============================================================
  // TDAH × D - O Pioneiro Acelerado
  // ============================================================
  {
    id: 'TDAH-D',
    perfil: 'TDAH',
    disc: 'D',
    nome: 'O Pioneiro Acelerado',
    frase: 'Meu cérebro não para porque ele já está no próximo passo.',
    neurociencia: 'Dopamina e noradrenalina em circuitos fronto-estriatais operam de forma atípica, criando busca intensa por novidade e recompensa imediata. O córtex pré-frontal dorsolateral tem menor ativação em tarefas rotineiras, mas dispara com intensidade diante de desafios reais e urgência genuína.',
    saudeEmocional: {
      pontosForca: ['Energia criativa explosiva em crises', 'Liderança instintiva em situações novas', 'Pensamento hiperconectado entre ideias distantes', 'Resiliência emocional após falhas - recomeça rápido'],
      vulnerabilidades: ['Dificuldade de regular frustração em ambientes lentos', 'Impulsividade emocional que pode parecer agressividade', 'Ciclos de hiperfoco seguidos de esgotamento', 'Sensibilidade intensa à rejeição (RSD - Rejection Sensitive Dysphoria)'],
      sinaisBurnout: ['Irritabilidade extrema e explosões curtas', 'Procrastinação por paralisia de decisão', 'Sensação de "estar no piloto automático"', 'Conflitos interpessoais frequentes sem motivo claro']
    },
    janelaNeuro: {
      melhorHorario: 'Final da manhã (9h–12h) e início da noite (19h–21h) - quando dopamina natural está em pico',
      ambienteIdeal: 'Espaço com estímulos visuais moderados, possibilidade de movimento, metas curtas e feedback imediato',
      ritmoOtimo: 'Sprints de 25 min com pausas ativas de 5 min (Pomodoro adaptado) - evitar blocos acima de 90 min'
    },
    polivagal: {
      estadoDominante: 'Sistema simpático ativado cronicamente - estado de mobilização que pode virar luta/fuga',
      gatilhosOrganizacionais: ['Reuniões sem pauta clara', 'Tarefas repetitivas sem variação', 'Críticas na frente de outros', 'Prazos ambíguos ou mudança de última hora'],
      estrategiaRegulacao: ['Micro-pausas com movimento físico (2 min)', 'Respiração 4-7-8 antes de reuniões de alta pressão', 'Âncoras sensoriais no ambiente de trabalho', 'Espaço para verbalizar pensamentos antes de decidir']
    },
    proposito: {
      motivadores: ['Desafios novos com impacto visível', 'Autonomia para executar do seu jeito', 'Competição saudável e metas claras', 'Reconhecimento imediato por resultados'],
      flow: 'Projetos de alto risco com prazo real e liberdade criativa - entra em flow quando sente urgência genuína',
      sentidoNoTrabalho: 'Precisa ver que seu trabalho muda algo de verdade - resultados concretos são seu combustível emocional'
    },
    estrategiasCuidado: [
      'Body doubling: trabalhar na presença de outra pessoa aumenta foco em 40%',
      'Gamificar tarefas chatas: pontos, timers, desafios pessoais',
      'Externalizar memória: post-its físicos, áudio-notas, checklists visuais',
      'Nomear emoções antes de reagir: "estou frustrado porque..."',
      'Rituais de encerramento do dia para desativar o modo trabalho'
    ],
    paraOGestor: {
      comunicação: 'Direto, objetivo e com contexto do impacto. Evite e-mails longos - prefira mensagens curtas com uma ação clara.',
      ambiente: 'Ofereça metas semanais mensuráveis, check-ins rápidos (15 min) e espaço para apresentar ideias sem julgamento imediato.',
      evitar: ['Microgerenciamento', 'Reuniões longas sem propósito claro', 'Críticas públicas', 'Tarefas sem prazo definido'],
      potencializar: ['Colocar em projetos de inovação', 'Dar liderança de sprints curtos', 'Usar energia para resolver crises', 'Criar desafios internos e reconhecimento público por resultado']
    },
    acomodacoesRazoaveis: [
      'Espaço de trabalho com isolamento acústico opcional (fones ou sala silenciosa)',
      'Flexibilidade de horário para aproveitamento das janelas neurológicas',
      'Check-ins semanais estruturados em vez de supervisão contínua',
      'Permissão para uso de ferramentas de gestão visual (Kanban físico, timers)',
      'Prazos comunicados com antecedência mínima de 48h para mudanças',
      'Lei 8.213/91: TDAH com CID F90 pode configurar deficiência funcional para fins de cota'
    ],
    ishoN: 'Alto potencial de ISHO elevado quando em ambiente de autonomia e desafio. Risco de colapso abrupto em ambientes rígidos - monitorar indicadores de estresse agudo quinzenalmente.',
    mensagemPertencimento: 'Seu cérebro não é defeituoso - ele é um motor de Fórmula 1 em uma estrada de barro. O problema nunca foi você. Foi a pista.'
  },

  // ============================================================
  // TDAH × I - O Catalisador Infinito
  // ============================================================
  {
    id: 'TDAH-I',
    perfil: 'TDAH',
    disc: 'I',
    nome: 'O Catalisador Infinito',
    frase: 'Eu não me distraio - eu conecto tudo ao mesmo tempo.',
    neurociencia: 'Combinação de baixa inibição de resposta com alta reatividade do sistema de recompensa límbica. O hipocampo processa emoções com intensidade amplificada, tornando cada interação social carregada de significado emocional - fonte de empatia extraordinária e também de esgotamento social.',
    saudeEmocional: {
      pontosForca: ['Carisma natural que mobiliza equipes', 'Criatividade verbal e narrativa poderosa', 'Capacidade de criar conexões emocionais rapidamente', 'Otimismo resiliente mesmo após fracassos'],
      vulnerabilidades: ['Esgotamento após excesso de interações sociais (mesmo sendo extrovertido)', 'Dificuldade em completar projetos após a fase de entusiasmo inicial', 'Comprometer-se além da capacidade real', 'Desregulação emocional em rejeição social'],
      sinaisBurnout: ['Falsa alegria - sorrir por fora, colapsar por dentro', 'Evitação de compromissos que antes eram prazerosos', 'Dispersão extrema sem conseguir iniciar nada', 'Choro sem causa aparente ou irritabilidade disfarçada']
    },
    janelaNeuro: {
      melhorHorario: 'Manhã (8h–11h) para criação e conexão; tarde para tarefas menos exigentes cognitivamente',
      ambienteIdeal: 'Espaços colaborativos com estímulo social moderado, cores e elementos visuais, música de fundo permitida',
      ritmoOtimo: 'Alternância entre atividade social (reuniões, co-criação) e blocos solitários curtos de foco profundo'
    },
    polivagal: {
      estadoDominante: 'Sistema nervoso ventral ativo na conexão social, mas com colapso em dorsal vagal quando sobrecarregado',
      gatilhosOrganizacionais: ['Silêncio social prolongado', 'Feedback negativo sem contexto afetivo', 'Isolamento em home office sem rituais de conexão', 'Comparação pública com colegas'],
      estrategiaRegulacao: ['Contato visual e conversa breve antes de grandes tarefas', 'Movimento físico leve (caminhada) como reset emocional', 'Journaling rápido de 5 min ao fim do dia', 'Técnica de "nome + emoção" para regular RSD']
    },
    proposito: {
      motivadores: ['Impacto em pessoas - ver transformação no outro', 'Reconhecimento público e genuíno', 'Projetos criativos com liberdade de expressão', 'Colaboração real, não só presença em grupo'],
      flow: 'Facilitação, apresentações, brainstorming - quando pode falar, criar e inspirar simultaneamente',
      sentidoNoTrabalho: 'Precisa sentir que pertence e que faz diferença na vida das pessoas - o "por quê" emocional é seu motor'
    },
    estrategiasCuidado: [
      'Estabelecer rituais de início e fim do dia para criar fronteiras entre trabalho e descanso',
      'Dizer "deixa eu pensar" antes de aceitar novas responsabilidades',
      'Usar gravações de voz para capturar ideias em movimento',
      'Criar um "deck de projetos": painel visual dos comprometimentos ativos',
      'Praticar desconexão intencional: 1h sem telas e sem interação social por dia'
    ],
    paraOGestor: {
      comunicação: 'Caloroso, empático e com reforço positivo genuíno. Explique o "para quê" antes do "como". Valorize em público.',
      ambiente: 'Inclua em projetos colaborativos, reuniões de ideação e apresentações. Dê protagonismo em momentos de impacto.',
      evitar: ['Crítica fria sem contexto emocional', 'Isolamento em tarefas solitárias longas', 'Reuniões sem espaço para fala', 'Ignorar suas contribuições criativas'],
      potencializar: ['Embaixador de cultura e engajamento', 'Facilitador de workshops e treinamentos', 'Porta-voz de projetos com stakeholders', 'Mentor de integração de novos colaboradores']
    },
    acomodacoesRazoaveis: [
      'Flexibilidade de formato de entrega (oral, visual, escrito)',
      'Espaço para co-working híbrido - reduz isolamento',
      'Check-ins emocionais periódicos com liderança de confiança',
      'Permissão para usar fones com música instrumental em trabalho individual',
      'Tarefas com prazo estruturado e marcos intermediários visíveis'
    ],
    ishoN: 'ISHO tende a mascarar sofrimento real com alta energia social. Monitorar indicadores de sono, humor e frequência de faltas - podem ser primeiros sinais de colapso.',
    mensagemPertencimento: 'Você não é agitado demais. Você é um ser humano que sente tudo em alta definição - e isso é raro e valioso.'
  },

  // ============================================================
  // TDAH × S - O Guardião Impulsivo
  // ============================================================
  {
    id: 'TDAH-S',
    perfil: 'TDAH',
    disc: 'S',
    nome: 'O Guardião Impulsivo',
    frase: 'Cuido de todo mundo enquanto esqueço de cuidar de mim.',
    neurociencia: 'A combinação de déficit executivo frontal com alta ativação do sistema de cuidado (ocitocina elevada) cria um perfil que se sacrifica pelos outros enquanto luta internamente com desorganização e procrastinação. A culpa é amplificada pelo RSD - qualquer percepção de decepcionamento o outro é devastadora.',
    saudeEmocional: {
      pontosForca: ['Empatia profunda e autêntica', 'Lealdade inabalável à equipe', 'Paciência genuína com pessoas em dificuldade', 'Capacidade de perceber subtextos emocionais no grupo'],
      vulnerabilidades: ['Dificuldade em estabelecer limites por medo de desapontar', 'Procrastinação disfarçada de "vou ajudar os outros primeiro"', 'Acúmulo silencioso de sobrecarga até o colapso', 'Autocrítica severa por não conseguir "ser suficiente"'],
      sinaisBurnout: ['Isolamento progressivo mesmo sendo sociável', 'Choro repentino por situações pequenas', 'Incapacidade de iniciar qualquer tarefa (paralisia total)', 'Somatização: dores físicas sem causa médica clara']
    },
    janelaNeuro: {
      melhorHorario: 'Manhã (9h–11h) para tarefas que exigem foco; períodos de conexão com a equipe no meio do dia',
      ambienteIdeal: 'Ambiente acolhedor, previsível, com rosto humano - open space colaborativo com espaços de silêncio acessíveis',
      ritmoOtimo: 'Fluxo contínuo leve intercalado com pausas de conexão - evitar isolamento prolongado'
    },
    polivagal: {
      estadoDominante: 'Oscila entre ventral vagal (conexão) e dorsal vagal (colapso silencioso) - raramente chega ao simpático explícito',
      gatilhosOrganizacionais: ['Conflito interpessoal não resolvido', 'Percepção de que decepcionou alguém', 'Ambiente competitivo sem cooperação', 'Mudanças abruptas de rotina ou equipe'],
      estrategiaRegulacao: ['Técnica "o que está no meu controle agora?" para reduzir ruminação', 'Conversa de apoio com alguém de confiança antes de grandes decisões', 'Grounding físico: 5 coisas que vejo, 4 que ouço...', 'Limites compassivos: "Posso ajudar nisso, mas não consigo fazer tudo hoje"']
    },
    proposito: {
      motivadores: ['Ver o bem-estar dos colegas melhorar', 'Fazer parte de algo maior com valores claros', 'Relacionamentos profundos e duradouros no trabalho', 'Sentir que sua contribuição foi notada'],
      flow: 'Mentoria, suporte emocional, trabalho em equipe integrado - quando pode cuidar e ser visto cuidando',
      sentidoNoTrabalho: 'Precisa sentir que pertence e que seu cuidado importa - o reconhecimento emocional é mais valioso que o financeiro'
    },
    estrategiasCuidado: [
      'Criar lista diária de 3 prioridades pessoais - antes de ajudar outros',
      'Praticar o "não compassivo": recusar com afeto e sem culpa',
      'Estabelecer horário de "modo avião" para foco sem interrupção',
      'Journaling de gratidão própria: o que fiz BEM hoje?',
      'Checar necessidades físicas básicas: água, alimentação, sono - antes de trabalhar'
    ],
    paraOGestor: {
      comunicação: 'Gentil, com contexto emocional. Pergunte como está antes de atribuir tarefas. Demonstre que você se importa com ele, não apenas com a entrega.',
      ambiente: 'Proteja do excesso de demandas. Valide verbalmente o esforço, mesmo quando o resultado não foi perfeito.',
      evitar: ['Sobrecarregar por ser "confiável"', 'Feedback seco sem contexto afetivo', 'Ignorar sinais de esgotamento silencioso', 'Colocar em ambientes competitivos sem suporte'],
      potencializar: ['Papel de integrador de equipe', 'Onboarding de novos colaboradores', 'Projetos de bem-estar organizacional', 'Escuta ativa em processos de feedback 360°']
    },
    acomodacoesRazoaveis: [
      'Check-ins regulares com liderança sobre carga de trabalho real',
      'Clareza sobre escopo de responsabilidades - evitar "acúmulo por bondade"',
      'Acesso a suporte psicológico organizacional',
      'Comunicação antecipada de mudanças na equipe',
      'Espaço de descompressão acessível no ambiente de trabalho'
    ],
    ishoN: 'Perfil de alto risco para burnout silencioso. O ISHO-N pode se manter aparentemente estável enquanto o sofrimento real é mascarado por cuidado excessivo. Check-in adaptado quinzenal obrigatório.',
    mensagemPertencimento: 'Cuidar dos outros é lindo. Mas você também merece ser cuidado. Você não precisa se esvaziar para ser valorizado.'
  },

  // ============================================================
  // TDAH × C - O Analítico Tempestuoso
  // ============================================================
  {
    id: 'TDAH-C',
    perfil: 'TDAH',
    disc: 'C',
    nome: 'O Analítico Tempestuoso',
    frase: 'Minha mente analisa mil variáveis ao mesmo tempo - e isso é uma dádiva e uma tortura.',
    neurociencia: 'O perfil TDAH-C vive uma tensão entre o sistema executivo frontal (que quer precisão e controle) e o sistema dopaminérgico atípico (que não consegue sustentar foco em tarefas sem recompensa imediata). Hiperfoco em áreas de interesse intenso, mas paralisia em tarefas percebidas como irrelevantes.',
    saudeEmocional: {
      pontosForca: ['Análise profunda e detalhista quando em hiperfoco', 'Capacidade de identificar erros que outros perdem', 'Pensamento sistêmico e lógico refinado', 'Padrão de qualidade elevado que eleva o grupo'],
      vulnerabilidades: ['Perfeccionismo paralisante - "se não posso fazer perfeito, não começo"', 'Ruminação excessiva sobre erros passados', 'Dificuldade em delegar por desconfiança no padrão alheio', 'Isolamento emocional em momentos de sobrecarga cognitiva'],
      sinaisBurnout: ['Paralisia de análise - não consegue decidir nada', 'Irritabilidade por erros mínimos alheios', 'Sono fragmentado com ruminação noturna', 'Recusa em entregar trabalho por não estar "perfeito"']
    },
    janelaNeuro: {
      melhorHorario: 'Final da manhã (10h–13h) e tarde (15h–18h) - janelas de maior ativação cortical para análise',
      ambienteIdeal: 'Silêncio ou ruído branco, mesa organizada, tarefas com escopo claro e critérios de qualidade definidos',
      ritmoOtimo: 'Blocos de foco de 45–60 min com pausas de 10 min - sem interrupções externas durante o bloco'
    },
    polivagal: {
      estadoDominante: 'Sistema simpático em alerta constante de "monitoramento de erros" - pode chegar ao colapso dorsal em sobrecarga',
      gatilhosOrganizacionais: ['Prazos irrealistas para trabalho de qualidade', 'Feedback vago sem critérios claros', 'Ambiguidade em instruções ou expectativas', 'Interrupções durante foco profundo'],
      estrategiaRegulacao: ['Protocolo "bom o suficiente": definir critério mínimo aceitável antes de começar', 'Técnica de externalização: escrever preocupações antes de dormir', 'Movimento rítmico (caminhada) para reduzir ruminação', 'Compartimentalização: "agora só penso nisso"']
    },
    proposito: {
      motivadores: ['Resolver problemas complexos com rigor', 'Ser reconhecido pela qualidade e profundidade', 'Autonomia para trabalhar no seu ritmo e padrão', 'Contribuir com expertise técnica real'],
      flow: 'Pesquisa, análise de dados, diagnóstico de sistemas - quando pode mergulhar fundo sem interrupção',
      sentidoNoTrabalho: 'Precisa sentir que seu trabalho tem excelência real - entrega medíocre causa sofrimento genuíno'
    },
    estrategiasCuidado: [
      'Técnica "feito é melhor que perfeito" com critério mínimo definido antes de começar',
      'Separar tempo de análise do tempo de execução - não misturar os dois',
      'Criar "arquivo de conquistas": registrar o que funcionou bem',
      'Estabelecer horário de corte de trabalho - sem exceções',
      'Praticar autocompaixão: errar é dado, não identidade'
    ],
    paraOGestor: {
      comunicação: 'Preciso, técnico e com justificativa lógica. Forneça critérios de qualidade claros. Respeite o tempo de processamento antes de cobrar resposta.',
      ambiente: 'Ambiente com menos interrupções. Reuniões com pauta prévia. Espaço para revisão antes de entrega final.',
      evitar: ['Prazos impossíveis', 'Feedback impreciso ou emocional', 'Cobrar velocidade em detrimento de qualidade', 'Mudar escopo no meio do projeto'],
      potencializar: ['Auditoria de processos e qualidade', 'Análise de dados e indicadores', 'Desenvolvimento de protocolos e documentação', 'Revisão técnica de projetos críticos']
    },
    acomodacoesRazoaveis: [
      'Critérios de entrega claros e acordados previamente',
      'Ambiente com proteção de foco (sem interrupções em blocos definidos)',
      'Prazo realista compatível com padrão de qualidade esperado',
      'Acesso a ferramentas de organização e gestão de tarefas',
      'Feedback estruturado por escrito para processamento adequado'
    ],
    ishoN: 'Risco elevado de burnout por perfeccionismo. O ISHO-N pode mostrar engajamento alto enquanto o sofrimento real é mascarado por hiperperformance. Monitorar sinais de rigidez crescente.',
    mensagemPertencimento: 'Sua mente analítica não é um problema para domar. É uma ferramenta extraordinária - que precisa de descanso, não de punição.'
  },

  // ============================================================
  // TEA × D - O Estrategista Direto
  // ============================================================
  {
    id: 'TEA-D',
    perfil: 'TEA',
    disc: 'D',
    nome: 'O Estrategista Direto',
    frase: 'Não tenho tempo para rodeios - diga o que precisa, farei acontecer.',
    neurociencia: 'O TEA envolve processamento atípico da amígdala e menor ativação do sistema de neurônios-espelho, resultando em menor decodificação automática de subtextos sociais. Combinado com perfil D, surge uma comunicação direta que é genuína, não hostil. O sistema de recompensa responde fortemente a lógica, resultados e competência.',
    saudeEmocional: {
      pontosForca: ['Comunicação direta sem agenda oculta', 'Foco intenso em resultados e execução', 'Alta tolerância a ambientes de alta pressão quando as regras são claras', 'Lealdade e confiabilidade absolutas'],
      vulnerabilidades: ['Leitura equivocada de intenções sociais pode gerar conflitos involuntários', 'Dificuldade com feedbacks implícitos ou "nas entrelinhas"', 'Sobrecarga sensorial em ambientes de alto estímulo', 'Esgotamento por masking - fingir ser "normal" consome energia enorme'],
      sinaisBurnout: ['Explosões de frustração por injustiça percebida', 'Retração social completa', 'Hiperfoco compensatório em trabalho como fuga', 'Colapso físico e emocional após longos períodos de masking']
    },
    janelaNeuro: {
      melhorHorario: 'Períodos previsíveis com rotina estabelecida - manhã estruturada é ideal',
      ambienteIdeal: 'Espaço com controle de iluminação, baixo ruído, sem open space caótico; preferência por mesa própria e demarcada',
      ritmoOtimo: 'Blocos longos de trabalho focado (60–90 min) com transições suaves e previsíveis'
    },
    polivagal: {
      estadoDominante: 'Sistema nervoso em alerta constante de processamento sensorial - hipervigilância ambiental',
      gatilhosOrganizacionais: ['Mudanças de rotina sem aviso prévio', 'Ambiguidade em regras ou expectativas', 'Sobrecarga sensorial (barulho, luz fluorescente, cheiros)', 'Interações sociais imprevisíveis ou com duplo sentido'],
      estrategiaRegulacao: ['Estimming permitido (objetos táteis, movimento rítmico)', 'Rotina clara como âncora de segurança', 'Espaço de descompressão sensorial acessível', 'Comunicação escrita como alternativa à oral em situações de sobrecarga']
    },
    proposito: {
      motivadores: ['Domínio técnico de alto nível', 'Impacto mensurável com critérios objetivos', 'Reconhecimento por competência real', 'Autonomia para executar sem interferência desnecessária'],
      flow: 'Execução de projetos complexos com escopo claro e critérios objetivos de sucesso',
      sentidoNoTrabalho: 'Precisa de propósito lógico e claro - "por que isso importa" deve ser racional, não apenas emocional'
    },
    estrategiasCuidado: [
      'Criar manual pessoal de preferências de comunicação para compartilhar com equipe',
      'Definir rituais de início e fim do dia que sinalizem transições',
      'Kit sensorial de trabalho: fones de cancelamento, luz ajustável, objetos táteis',
      'Check-in semanal com liderança de confiança para calibrar expectativas sociais',
      'Permitir pausas de recuperação sensorial sem culpa'
    ],
    paraOGestor: {
      comunicação: 'Direta, literal e específica. Diga exatamente o que espera, quando e com qual critério. Evite ironia, metáforas ou feedbacks implícitos.',
      ambiente: 'Rotina previsível, espaço físico delimitado, comunicação preferencial por escrito para registros claros.',
      evitar: ['Mudanças de última hora sem aviso', 'Feedbacks vagos ou indiretos', 'Ambientes sensorialmente caóticos', 'Exigir performance social em situações sociais imprevisíveis'],
      potencializar: ['Liderança técnica de projetos complexos', 'Desenvolvimento de sistemas e processos', 'Análise estratégica de longo prazo', 'Especialização profunda em área de interesse']
    },
    acomodacoesRazoaveis: [
      'Espaço de trabalho com controle sensorial (luz, som)',
      'Comunicação de mudanças com antecedência mínima de 48–72h',
      'Formato escrito para instruções e feedbacks importantes',
      'Permissão para uso de fones de cancelamento de ruído',
      'Clareza explícita sobre regras, expectativas e critérios de avaliação',
      'Lei 8.213/91: TEA (CID F84) é deficiência para fins de cota - direito garantido'
    ],
    ishoN: 'ISHO-N deve incluir indicador de "custo de masking" - energia gasta em adaptação social. Ambientes inclusivos reduzem esse custo em até 60%, elevando engajamento real.',
    mensagemPertencimento: 'Sua forma de pensar não é errada - é diferente. E diferente, no lugar certo, é irreplacível.'
  },

  // ============================================================
  // TEA × I - O Conector Autêntico
  // ============================================================
  {
    id: 'TEA-I',
    perfil: 'TEA',
    disc: 'I',
    nome: 'O Conector Autêntico',
    frase: 'Me importo profundamente com as pessoas - só não sei sempre como mostrar isso do jeito que esperam.',
    neurociencia: 'Perfil raro: o desejo genuíno de conexão (perfil I) coexiste com o processamento social atípico do TEA. O resultado é uma pessoa que quer profundamente pertencer, mas que frequentemente lê errado os sinais sociais, gerando ansiedade crônica de rejeição. Empatia cognitiva pode ser alta; empatia afetiva automática é atípica.',
    saudeEmocional: {
      pontosForca: ['Conexões profundas e leais com pessoas de confiança', 'Criatividade singular e perspectiva original', 'Entusiasmo genuíno por interesses compartilhados', 'Honestidade que gera confiança autêntica'],
      vulnerabilidades: ['Ansiedade social por incerteza sobre "estar fazendo certo"', 'Esgotamento pós-interação social intensa', 'Interpretação literal que pode gerar mal-entendidos', 'Sensação de ser "muito" ou "de menos" para os grupos sociais'],
      sinaisBurnout: ['Retraimento social após período de intensa interação', 'Ansiedade generalizada com foco em relações sociais', 'Hiperfoco em interesse especial como refúgio', 'Masking intenso com colapso no ambiente seguro (casa)']
    },
    janelaNeuro: {
      melhorHorario: 'Manhã para atividades que exigem interação social planejada; tarde para trabalho individual',
      ambienteIdeal: 'Grupos pequenos e conhecidos, com papéis claros. Evitar grandes eventos sociais sem estrutura prévia.',
      ritmoOtimo: 'Interação planejada seguida de recuperação solitária - equilibrar "estar com" e "estar sozinho"'
    },
    polivagal: {
      estadoDominante: 'Ventral vagal em conexões seguras; simpático em situações sociais imprevisíveis',
      gatilhosOrganizacionais: ['Dinâmicas de grupo não estruturadas', 'Mudanças de interlocutor frequentes', 'Feedback ambíguo sobre performance social', 'Exclusão não verbalizada de grupos informais'],
      estrategiaRegulacao: ['Scripts sociais: preparar frases para situações típicas', 'Debrief pós-interação: revisar o que aconteceu sem catastrofizar', 'Tempo de recuperação sensorial após reuniões longas', 'Mentoria de "tradutor social": colega de confiança que ajuda a decodificar']
    },
    proposito: {
      motivadores: ['Fazer parte de algo com propósito humano claro', 'Conexões profundas com um grupo pequeno', 'Expressão criativa com audiência acolhedora', 'Ver impacto real nas pessoas próximas'],
      flow: 'Criação de conteúdo, design, facilitação de pequenos grupos, comunicação escrita aprofundada',
      sentidoNoTrabalho: 'Precisa de pertencimento genuíno - não superficial. Quando sente que "é de verdade", entrega tudo.'
    },
    estrategiasCuidado: [
      'Criar "manual do eu": documento que explica suas preferências, limites e melhor forma de colaboração',
      'Praticar interações sociais planejadas com baixo risco antes de eventos maiores',
      'Diário emocional para nomear e processar experiências sociais',
      'Construir "tribo" de 2–3 pessoas de confiança no trabalho',
      'Definir limite de interações sociais por dia e respeitá-lo'
    ],
    paraOGestor: {
      comunicação: 'Direta e calorosa ao mesmo tempo. Evite ironia. Quando der feedback, seja específico sobre o comportamento, não sobre a pessoa.',
      ambiente: 'Inclua em grupos pequenos e estruturados. Avise antecipadamente sobre eventos sociais. Valorize a contribuição única.',
      evitar: ['Grandes eventos sociais sem preparação', 'Feedback implícito ou em tom de piada', 'Pressão para "se soltar" ou "ser mais social"', 'Ignorar sinais de esgotamento social'],
      potencializar: ['Comunicação escrita e criação de conteúdo', 'Conexão profunda com clientes ou colaboradores-chave', 'Projetos criativos com autonomia', 'Representação de valores da empresa com autenticidade']
    },
    acomodacoesRazoaveis: [
      'Pauta prévia de reuniões enviada com antecedência',
      'Opção de participação por escrito em dinâmicas de grupo',
      'Espaço de recuperação pós-eventos sociais intensos',
      'Comunicação preferencial por texto para registros e processamento',
      'Mentoria de integração com colega de confiança designado'
    ],
    ishoN: 'Monitorar indicador de "custo de masking social" e frequência de recuperação pós-interação. Ambientes que valorizam autenticidade elevam ISHO-N significativamente.',
    mensagemPertencimento: 'Você se importa de um jeito raro e profundo. Isso não é fraqueza - é uma forma de amor que o mundo precisa mais.'
  },

  // ============================================================
  // TEA × S - O Guardião Fiel
  // ============================================================
  {
    id: 'TEA-S',
    perfil: 'TEA',
    disc: 'S',
    nome: 'O Guardião Fiel',
    frase: 'Sou de poucas palavras, mas quando assumo um compromisso, cumpro.',
    neurociencia: 'A combinação TEA + perfil S cria um ser de rotina, lealdade e consistência profundas. O processamento atípico do TEA reforça a preferência por ambientes previsíveis. A ocitocina é liberada em vínculos estabelecidos, não em novidades sociais. Mudanças abruptas ativam a amígdala de forma intensa.',
    saudeEmocional: {
      pontosForca: ['Confiabilidade e consistência absolutas', 'Atenção a detalhes que garantem qualidade', 'Lealdade profunda a vínculos de confiança', 'Calma em situações de crise quando a rotina está preservada'],
      vulnerabilidades: ['Ansiedade elevada diante de mudanças não previstas', 'Dificuldade em expressar necessidades próprias verbalmente', 'Esgotamento silencioso por adaptar comportamento ao ambiente', 'Tendência ao shutdown emocional em sobrecarga'],
      sinaisBurnout: ['Ausências por problemas físicos sem diagnóstico claro', 'Rigidez crescente em comportamentos e rotinas', 'Silêncio prolongado onde antes havia participação', 'Irritabilidade rara, mas intensa quando o limite é ultrapassado']
    },
    janelaNeuro: {
      melhorHorario: 'Manhã estruturada com rotina fixa - mesmo horário todo dia é âncora de segurança',
      ambienteIdeal: 'Mesa própria, ambiente silencioso, colegas conhecidos, poucos estímulos sensoriais',
      ritmoOtimo: 'Fluxo previsível com pausas nos mesmos horários - evitar variações bruscas de agenda'
    },
    polivagal: {
      estadoDominante: 'Dorsal vagal em situações novas; ventral vagal em ambiente seguro e previsível',
      gatilhosOrganizacionais: ['Mudanças de equipe ou liderança', 'Ruídos imprevisíveis ou ambiente sensorialmente caótico', 'Conflitos interpessoais não resolvidos', 'Tarefas indefinidas ou papéis ambíguos'],
      estrategiaRegulacao: ['Rituais de início de trabalho como âncora (mesmo café, mesmo lugar)', 'Comunicação de mudanças com máxima antecedência possível', 'Espaço de processamento silencioso antes de responder', 'Expressão por escrito quando a fala é difícil']
    },
    proposito: {
      motivadores: ['Ser parte de uma equipe estável e de confiança', 'Contribuir de forma concreta e visível', 'Ambiente que respeita seu ritmo e modo de ser', 'Reconhecimento discreto e genuíno'],
      flow: 'Trabalho de execução consistente, processos bem definidos, suporte a projetos de longo prazo',
      sentidoNoTrabalho: 'Segurança e pertencimento estável - quando sente que "aqui é meu lugar", entrega com excelência silenciosa'
    },
    estrategiasCuidado: [
      'Manter rituais diários imutáveis como âncoras de regulação',
      'Criar "arquivo de segurança": lista de coisas que sempre funcionam',
      'Praticar expressão de necessidades por escrito quando a fala é difícil',
      'Estabelecer 1 pessoa de confiança no trabalho para decodificação social',
      'Respeitar o próprio limite sensorial sem se culpar'
    ],
    paraOGestor: {
      comunicação: 'Suave, previsível e consistente. Avise mudanças com antecedência. Não pressione por respostas imediatas.',
      ambiente: 'Proteja a rotina. Espaço físico estável. Não inclua em dinâmicas sociais imprevisíveis sem preparação.',
      evitar: ['Mudanças de última hora', 'Ambientes sensorialmente intensos', 'Pressionar por "mais proatividade social"', 'Feedbacks em público'],
      potencializar: ['Guardião de processos e qualidade', 'Suporte técnico consistente', 'Referência de confiabilidade na equipe', 'Projetos de longo prazo com escopo estável']
    },
    acomodacoesRazoaveis: [
      'Comunicação antecipada de qualquer mudança de rotina, equipe ou espaço',
      'Espaço de trabalho fixo e com controle sensorial',
      'Opção de home office em dias de sobrecarga sensorial',
      'Check-ins regulares e breves com liderança direta',
      'Clareza total sobre papéis, responsabilidades e expectativas'
    ],
    ishoN: 'Perfil de alto risco para shutdown silencioso. O ISHO-N pode parecer estável enquanto o colaborador está em colapso interno. Check-in adaptado por escrito é mais efetivo que entrevista oral.',
    mensagemPertencimento: 'Você não precisa ser extrovertido para ser valioso. Sua consistência silenciosa é o que mantém tudo funcionando.'
  },

  // ============================================================
  // TEA × C - O Arquiteto do Conhecimento
  // ============================================================
  {
    id: 'TEA-C',
    perfil: 'TEA',
    disc: 'C',
    nome: 'O Arquiteto do Conhecimento',
    frase: 'Se eu entender o sistema completamente, posso melhorá-lo completamente.',
    neurociencia: 'Hiperconectividade de redes corticais locais no TEA, combinada com o perfil C analítico, cria capacidade extraordinária de processamento sistêmico e detalhado. O interesse especial do TEA frequentemente se alinha com a expertise técnica do perfil C, gerando desempenho de nível de especialista em domínios específicos.',
    saudeEmocional: {
      pontosForca: ['Expertise técnica de nível excepcional em área de interesse', 'Pensamento sistêmico e lógico altamente refinado', 'Detecção de inconsistências e erros com precisão notável', 'Aprendizado autônomo intenso e autodidatismo'],
      vulnerabilidades: ['Dificuldade em aceitar soluções "boas o suficiente"', 'Inflexibilidade quando regras ou lógicas são violadas', 'Isolamento por dificuldade de compartilhar conhecimento de forma acessível', 'Meltdown ou shutdown diante de ilógico e injustiça percebida'],
      sinaisBurnout: ['Paralisia total por sobrecarga de processamento', 'Irritabilidade extrema com incompetência ou inconsistência', 'Isolamento progressivo até desconexão total', 'Somatização: cefaleias, problemas gastrointestinais']
    },
    janelaNeuro: {
      melhorHorario: 'Tarde (13h–18h) para trabalho de análise profunda; manhã para organização e planejamento',
      ambienteIdeal: 'Silêncio total ou ruído branco, espaço organizado por sistema próprio, sem interrupções',
      ritmoOtimo: 'Blocos de 90–120 min de foco profundo com recuperação de 20–30 min entre blocos'
    },
    polivagal: {
      estadoDominante: 'Simpático em estados de "injustiça lógica"; dorsal vagal em sobrecarga sensorial e social',
      gatilhosOrganizacionais: ['Decisões sem lógica clara ou critérios explícitos', 'Interrupções de foco profundo', 'Inconsistência entre o que é dito e o que é feito', 'Ambientes sensorialmente caóticos'],
      estrategiaRegulacao: ['Criação de sistemas e protocolos para organizar o mundo', 'Movimento físico rítmico (caminhada, ciclismo) para processar', 'Tempo de recuperação sensorial após reuniões', 'Estimming permitido como regulação autônoma']
    },
    proposito: {
      motivadores: ['Domínio profundo de conhecimento especializado', 'Resolver problemas que ninguém mais conseguiu', 'Criar sistemas e processos que funcionam perfeitamente', 'Ser reconhecido como referência de expertise'],
      flow: 'Pesquisa aprofundada, desenvolvimento técnico, arquitetura de sistemas - quando pode mergulhar sem limite de tempo',
      sentidoNoTrabalho: 'O trabalho deve fazer sentido lógico e contribuir para algo real - caos sem propósito é insuportável'
    },
    estrategiasCuidado: [
      'Criar ambiente de trabalho como "bolha de controle sensorial"',
      'Estabelecer protocolo pessoal para situações socialmente confusas',
      'Diário técnico: registrar aprendizados e insights para processamento',
      'Limitar reuniões a no máximo 2 por dia, com pauta prévia',
      'Celebrar conquistas técnicas - reconhecimento por expertise, não por performance social'
    ],
    paraOGestor: {
      comunicação: 'Técnica, lógica e com justificativa racional. Forneça documentação. Evite ambiguidade. Respeite o tempo de análise.',
      ambiente: 'Proteja o foco. Comunique mudanças com lógica clara. Deixe que crie seus próprios sistemas de organização.',
      evitar: ['Reuniões frequentes sem pauta', 'Decisões arbitrárias sem justificativa', 'Pressão por interação social desnecessária', 'Interromper durante foco profundo'],
      potencializar: ['Especialista técnico de referência', 'Arquiteto de sistemas e processos', 'Pesquisa e desenvolvimento', 'Auditoria técnica e controle de qualidade']
    },
    acomodacoesRazoaveis: [
      'Espaço de trabalho com isolamento sensorial (próprio ou com fones)',
      'Reuniões com pauta enviada com mínimo 24h de antecedência',
      'Formato assíncrono para comunicações não urgentes',
      'Autonomia para organizar fluxo de trabalho por sistema próprio',
      'Reconhecimento formal da expertise como contribuição organizacional'
    ],
    ishoN: 'ISHO-N deve rastrear "carga de processamento social" separadamente do engajamento técnico. Um TEA-C pode ter ISHO social baixo e ISHO técnico altíssimo - a composição importa mais que o número agregado.',
    mensagemPertencimento: 'Sua mente é uma das mais raras que existem. O mundo precisa de quem pensa diferente, fundo e sem desistir.'
  },

  // ============================================================
  // DISLEXIA × D - O Visionário Oral
  // ============================================================
  {
    id: 'Dislexia-D',
    perfil: 'Dislexia',
    disc: 'D',
    nome: 'O Visionário Oral',
    frase: 'Vejo a solução antes de conseguir escrever - e isso me faz avançar quando outros ainda leem o problema.',
    neurociencia: 'A dislexia envolve diferenças no processamento fonológico no giro angular e no córtex temporal esquerdo, com compensação por rotas semânticas e visuoespaciais. O resultado: pensamento por imagens e conceitos (não por palavras escritas), com frequente habilidade elevada de pensamento tridimensional, raciocínio analógico e visão de conjunto.',
    saudeEmocional: {
      pontosForca: ['Visão estratégica de longo prazo', 'Comunicação oral persuasiva e impactante', 'Pensamento criativo que conecta ideias distantes', 'Determinação para superar obstáculos - resiliência construída'],
      vulnerabilidades: ['Vergonha acumulada por anos de julgamento escolar', 'Ansiedade em situações de escrita ou leitura pública', 'Subestimação da própria inteligência por comparação com padrão leto-escrito', 'Fadiga cognitiva por esforço constante de compensação'],
      sinaisBurnout: ['Evitação de tarefas de escrita que se acumula', 'Irritabilidade por esforço não reconhecido', 'Sensação de fraude mesmo sendo competente', 'Exaustão desproporcional ao trabalho realizado']
    },
    janelaNeuro: {
      melhorHorario: 'Manhã para comunicação oral e decisões estratégicas; evitar escrita formal sob pressão',
      ambienteIdeal: 'Espaço com recursos de áudio, possibilidade de ditado, apresentações visuais',
      ritmoOtimo: 'Alternância entre comunicação oral (reuniões, apresentações) e processamento visual (mapas, diagramas)'
    },
    polivagal: {
      estadoDominante: 'Simpático em situações de exposição escrita; ventral vagal em comunicação oral e visual',
      gatilhosOrganizacionais: ['Relatórios escritos longos sem suporte', 'Leitura em voz alta em grupo', 'Avaliações por escrito sem tempo adequado', 'Comparações com colegas em performance escrita'],
      estrategiaRegulacao: ['Usar ferramentas de transcrição de voz', 'Mapas mentais como alternativa à escrita linear', 'Pedir clareza sem vergonha: "posso confirmar oralmente?"', 'Reconhecer o esforço extra como força, não fraqueza']
    },
    proposito: {
      motivadores: ['Liderar pela visão e pela fala', 'Impacto concreto e rápido', 'Reconhecimento por resultados, não por documentação', 'Autonomia para comunicar do seu jeito'],
      flow: 'Apresentações, pitch, liderança de reuniões, tomada de decisão rápida',
      sentidoNoTrabalho: 'Precisa de ambientes que avaliem por resultado, não por formato de comunicação'
    },
    estrategiasCuidado: [
      'Usar aplicativos de ditado e transcrição (Otter.ai, Google Voice)',
      'Mapas mentais como ferramenta principal de organização',
      'Pedir resumo oral de documentos longos',
      'Construir narrativa de força sobre a dislexia - não de déficit',
      'Criar sistema de revisão com apoio tecnológico (corretor, leitura em voz alta pelo app)'
    ],
    paraOGestor: {
      comunicação: 'Oral, visual e direta. Reduza dependência de documentos escritos longos. Aceite e valorize comunicação por áudio ou vídeo.',
      ambiente: 'Forneça documentos com antecedência para leitura sem pressão de tempo. Aceite entregas em diferentes formatos.',
      evitar: ['Avaliar por qualidade da escrita em vez de qualidade do conteúdo', 'Leitura em voz alta em público', 'Prazos curtos para documentos escritos longos', 'Comparação com colegas sem dislexia'],
      potencializar: ['Liderança de projetos por comunicação oral', 'Representação externa e pitch', 'Visão estratégica e inovação', 'Mentoria por storytelling']
    },
    acomodacoesRazoaveis: [
      'Tempo estendido para tarefas de escrita e leitura',
      'Acesso a tecnologia assistiva (software de ditado, leitura em voz alta)',
      'Documentos em fonte adequada (OpenDyslexic, Arial, tamanho 12+)',
      'Opção de entrega oral ou em áudio como alternativa à escrita',
      'Espaço quieto para leitura e escrita sem pressão de tempo'
    ],
    ishoN: 'Risco de ISHO rebaixado por vergonha mascarada. Criar indicador de "autoestima funcional" no check-in: "você se sente competente no trabalho?" como termômetro de saúde.',
    mensagemPertencimento: 'Você pensa em imagens, estratégias e possibilidades - enquanto o mundo ainda está tentando ler o enunciado. Isso não é lentidão. É voo.'
  },

  // ============================================================
  // DISLEXIA × I - O Narrador Criativo
  // ============================================================
  {
    id: 'Dislexia-I',
    perfil: 'Dislexia',
    disc: 'I',
    nome: 'O Narrador Criativo',
    frase: 'As palavras saem melhor pela boca do que pela escrita - e quando saem, movem pessoas.',
    neurociencia: 'O processamento dislético via rota visual e semântica, combinado com alta sensibilidade do sistema límbico do perfil I, gera comunicadores orais extraordinários. A narrativa emocional é fluida; a codificação escrita é o obstáculo. O cérebro compensa com memória auditiva superior e associações criativas únicas.',
    saudeEmocional: {
      pontosForca: ['Storytelling poderoso e memorável', 'Empatia que traduz complexidade em simplicidade', 'Criatividade verbal espontânea', 'Construção de conexões emocionais genuínas'],
      vulnerabilidades: ['Ansiedade diante de e-mails, relatórios e textos formais', 'Sensação de "não ser inteligente o suficiente" por comparação escrita', 'Esgotamento por masking de dificuldades de leitura', 'Desorganização de ideias por ausência de estrutura escrita'],
      sinaisBurnout: ['Evitação crescente de comunicação escrita', 'Procrastinação em tarefas com escrita como requisito', 'Perda de entusiasmo - sinal de que a vergonha venceu a energia', 'Isolamento em reuniões onde escrita é central']
    },
    janelaNeuro: {
      melhorHorario: 'Manhã e tarde para atividades orais; períodos de baixa energia para revisão assistida por tecnologia',
      ambienteIdeal: 'Espaço colaborativo com recursos audiovisuais, permissão para gravar reuniões',
      ritmoOtimo: 'Comunicação oral como fluxo principal, escrita como registro posterior com apoio tecnológico'
    },
    polivagal: {
      estadoDominante: 'Ventral vagal em conexão oral; simpático em exposição escrita pública',
      gatilhosOrganizacionais: ['E-mails com respostas esperadas em tempo curto', 'Apresentações com texto denso para ler', 'Avaliações escritas formais', 'Ambientes que valorizam apenas comunicação escrita'],
      estrategiaRegulacao: ['Gravar audio-notas antes de escrever', 'Usar IA para refinar textos após ditado', 'Criar templates de e-mail para situações recorrentes', 'Valorizar a contribuição oral publicamente']
    },
    proposito: {
      motivadores: ['Inspirar e mobilizar pessoas pela fala', 'Projetos criativos com expressão multimodal', 'Reconhecimento por impacto humano', 'Ambientes que valorizam a comunicação oral'],
      flow: 'Facilitação, apresentações criativas, treinamentos, vendas consultivas, podcasts internos',
      sentidoNoTrabalho: 'Precisa de espaço para brilhar na oralidade - quando isso acontece, os resultados são excepcionais'
    },
    estrategiasCuidado: [
      'Usar gravação de voz como primeiro rascunho de qualquer texto',
      'Ferramentas de IA para estruturar e revisar textos após ditado',
      'Criar biblioteca de templates para comunicações recorrentes',
      'Celebrar conquistas orais e criativas - não apenas escritas',
      'Compartilhar a dislexia com confiança: não é limite, é estilo cognitivo'
    ],
    paraOGestor: {
      comunicação: 'Valorize a comunicação oral tanto quanto a escrita. Aceite áudio-mensagens, vídeos curtos e apresentações como entregas válidas.',
      ambiente: 'Inclua em dinâmicas de storytelling, facilitação e comunicação. Proteja de avaliações que dependem exclusivamente de escrita.',
      evitar: ['Cobrar perfeccionismo escrito sem suporte', 'Avaliar inteligência por qualidade textual', 'Ignorar contribuições brilhantes por erros ortográficos', 'Prazos curtos para texto extenso'],
      potencializar: ['Porta-voz de projetos e valores', 'Facilitador de treinamentos e workshops', 'Criador de conteúdo oral (podcasts, vídeos internos)', 'Embaixador de cultura e engajamento']
    },
    acomodacoesRazoaveis: [
      'Acesso a ferramentas de transcrição e correção automática',
      'Opção de entrega em formato oral, vídeo ou áudio',
      'Documentos com antecedência para leitura sem pressão',
      'Fontes e formatação acessíveis em todos os documentos',
      'Reconhecimento formal de diferentes formatos de comunicação como igualmente válidos'
    ],
    ishoN: 'Monitorar indicador de autoestima cognitiva. Ambientes que valorizam multimodalidade elevam ISHO-N em até 50% comparado a ambientes leto-cêntricos.',
    mensagemPertencimento: 'Você não escreve igual aos outros - você fala de um jeito que poucos conseguem. E isso é um dom, não um defeito.'
  },

  // ============================================================
  // DISLEXIA × S - O Apoiador Silencioso
  // ============================================================
  {
    id: 'Dislexia-S',
    perfil: 'Dislexia',
    disc: 'S',
    nome: 'O Apoiador Silencioso',
    frase: 'Posso não escrever rápido, mas nunca deixo quem depende de mim na mão.',
    neurociencia: 'A dislexia em perfil S cria um colaborador que supercompensa dificuldades de leitura/escrita com excelência relacional e operacional. A memória procedural (fazer) é superior à fonológica (ler). Anos de esforço extra construíram resiliência e empatia por colegas com dificuldades.',
    saudeEmocional: {
      pontosForca: ['Confiabilidade absoluta em execução prática', 'Empatia profunda por quem enfrenta dificuldades', 'Paciência e consistência que sustentam equipes', 'Criatividade prática na resolução de problemas'],
      vulnerabilidades: ['Autoestima fragilizada por histórico de julgamento escolar', 'Evitação de promoções por medo de mais demanda escrita', 'Masking constante que gera esgotamento silencioso', 'Resistência a pedir ajuda por vergonha'],
      sinaisBurnout: ['Aumento de ausências por doenças físicas', 'Recusa em assumir novos projetos', 'Diminuição de participação em reuniões', 'Sinais de depressão mascarados por "estar bem"']
    },
    janelaNeuro: {
      melhorHorario: 'Manhã para trabalho prático e relacional; tarde para tarefas de escrita com apoio tecnológico',
      ambienteIdeal: 'Ambiente estável com colegas conhecidos, tarefas práticas e claras, comunicação oral predominante',
      ritmoOtimo: 'Fluxo contínuo de tarefas práticas intercalado com conexão relacional - evitar longas sessões de escrita'
    },
    polivagal: {
      estadoDominante: 'Ventral vagal em tarefas práticas e relações seguras; dorsal vagal em exposição escrita',
      gatilhosOrganizacionais: ['Relatórios e documentações extensas', 'Reuniões onde precisa ler em público', 'Avaliações baseadas em produção escrita', 'Mudanças que aumentam carga de escrita'],
      estrategiaRegulacao: ['Delegação de escrita formal com orgulho, não vergonha', 'Uso de templates e IA para documentação', 'Reforço de identidade por competências práticas', 'Conversa de confiança com liderança sobre necessidades reais']
    },
    proposito: {
      motivadores: ['Ver resultados concretos do próprio esforço', 'Equipe que valoriza o que faz', 'Ambiente de crescimento sem humilhação', 'Contribuição reconhecida independente do formato'],
      flow: 'Execução prática, treinamento on-the-job, suporte operacional, relacionamento com clientes internos',
      sentidoNoTrabalho: 'Precisa de reconhecimento por fazer, não apenas por documentar. O trabalho concreto é sua linguagem.'
    },
    estrategiasCuidado: [
      'Construir identidade profissional baseada em competências práticas',
      'Usar tecnologia assistiva sem culpa: ditado, IA, corretor',
      'Estabelecer parceria com colega para revisão de textos quando necessário',
      'Comunicar necessidades à liderança - com clareza e sem vergonha',
      'Celebrar cada entrega - o esforço extra é invisível para quem não vive isso'
    ],
    paraOGestor: {
      comunicação: 'Gentil, prática e com instruções claras por oral e escrito. Valorize a entrega, não o formato. Pergunte como pode apoiar.',
      ambiente: 'Reduza carga de escrita onde possível. Ofereça suporte tecnológico. Reconheça o esforço além do resultado.',
      evitar: ['Avaliar por erros ortográficos ou gramáticais', 'Promover sem suporte para desafios de escrita', 'Ignorar sinais de esgotamento por masking', 'Humilhar em situações de dificuldade com texto'],
      potencializar: ['Treinamento prático e mentoria operacional', 'Referência de qualidade de execução', 'Embaixador de boas práticas operacionais', 'Suporte a novos colaboradores na integração prática']
    },
    acomodacoesRazoaveis: [
      'Acesso a software de ditado e transcrição automática',
      'Suporte de escrita para documentação formal quando necessário',
      'Avaliação de desempenho baseada em resultados práticos, não em qualidade textual',
      'Treinamentos em formato audiovisual, não apenas texto',
      'Ambiente que normaliza múltiplos formatos de comunicação e entrega'
    ],
    ishoN: 'Monitorar indicador de "visibilidade de esforço": colaboradores com dislexia frequentemente trabalham mais sem reconhecimento proporcional. Ajustar ISHO-N para capturar essa assimetria.',
    mensagemPertencimento: 'Você faz mais esforço do que a maioria percebe. E ainda assim está aqui, entregando. Isso é força - não fraqueza.'
  },

  // ============================================================
  // DISLEXIA × C - O Pensador Visual
  // ============================================================
  {
    id: 'Dislexia-C',
    perfil: 'Dislexia',
    disc: 'C',
    nome: 'O Pensador Visual',
    frase: 'Vejo o sistema todo em imagens - a escrita é só a tradução imperfeita do que já entendo completamente.',
    neurociencia: 'A rota visual de processamento do dislético, reforçada pelo perfil analítico C, cria um pensador sistêmico por imagens e estruturas. A análise acontece em diagramas mentais, não em texto linear. Paradoxalmente, a precisão de raciocínio é altíssima - o obstáculo é a codificação textual, não a compreensão.',
    saudeEmocional: {
      pontosForca: ['Análise sistêmica por diagramas e modelos mentais', 'Detecção de padrões que escapam ao pensamento linear', 'Precisão conceitual elevada', 'Criatividade analítica inesperada'],
      vulnerabilidades: ['Frustração intensa por não conseguir externalizar o que "vê" mentalmente', 'Perfeccionismo que colapsa diante da escrita imperfeita', 'Autoexigência extrema para compensar o esforço extra', 'Isolamento por medo de exposição de dificuldades'],
      sinaisBurnout: ['Recusa em entregas por não estarem "boas o suficiente"', 'Irritabilidade por incompreensão alheia do próprio raciocínio', 'Esgotamento por esforço de compensação invisível', 'Desengajamento após episódios de humilhação pública']
    },
    janelaNeuro: {
      melhorHorario: 'Tarde para análise profunda; manhã para organização visual e planejamento com diagramas',
      ambienteIdeal: 'Espaço silencioso com quadro branco ou ferramentas visuais (Miro, FigJam), acesso a tecnologia assistiva',
      ritmoOtimo: 'Blocos de análise visual seguidos de externalização por ferramenta (não escrita manual)'
    },
    polivagal: {
      estadoDominante: 'Simpático em exposição de escrita; ventral vagal em trabalho visual e analítico',
      gatilhosOrganizacionais: ['Relatórios escritos extensos como entrega obrigatória', 'Reuniões com leitura em voz alta', 'Avaliações baseadas em fluência textual', 'Ambientes que não aceitam diagramas como entrega válida'],
      estrategiaRegulacao: ['Usar quadro branco como primeiro passo de qualquer análise', 'Fotografar/exportar diagramas como entrega oficial', 'Validar o raciocínio visual com interlocutor de confiança antes de formalizar', 'Normalizar o uso de IA para tradução de diagrama em texto']
    },
    proposito: {
      motivadores: ['Resolver problemas complexos com rigor visual', 'Ser reconhecido pela profundidade do raciocínio', 'Criar sistemas e modelos que funcionam', 'Autonomia para trabalhar no próprio formato analítico'],
      flow: 'Modelagem de processos, arquitetura de sistemas, análise estratégica visual, design de fluxos',
      sentidoNoTrabalho: 'Precisa de ambiente que avalie pela profundidade do pensamento, não pela fluência da escrita'
    },
    estrategiasCuidado: [
      'Estabelecer diagramas como linguagem primária de trabalho',
      'Usar IA para transcrever raciocínio visual em relatórios formais',
      'Criar portfólio de modelos mentais como evidência de competência',
      'Construir narrativa de orgulho: "penso diferente e mais profundo"',
      'Estabelecer critério de "bom o suficiente" para evitar paralisia'
    ],
    paraOGestor: {
      comunicação: 'Aceite diagramas, mapas e modelos visuais como entrega formal. Valorize o raciocínio, não o formato textual.',
      ambiente: 'Forneça ferramentas visuais. Aceite múltiplos formatos de entrega. Proteja de avaliações que medem apenas fluência escrita.',
      evitar: ['Desvalorizar entrega visual em favor de texto', 'Avaliar inteligência por qualidade de escrita', 'Expor em situações de leitura pública', 'Cobrar velocidade textual incompatível com o processamento'],
      potencializar: ['Arquitetura de processos e sistemas', 'Design de fluxos operacionais', 'Análise de dados e modelagem visual', 'Consultoria interna por expertise técnica']
    },
    acomodacoesRazoaveis: [
      'Aceitação de entregas em formato visual (diagramas, mapas, apresentações)',
      'Acesso a ferramentas de modelagem visual e IA para transcrição',
      'Tempo estendido para documentação escrita formal',
      'Avaliação por qualidade do raciocínio, não por fluência textual',
      'Espaço com quadro branco ou equivalente digital como ferramenta de trabalho'
    ],
    ishoN: 'Criar indicador específico de "reconhecimento por competência real" no ISHO-N. Disléxicos analíticos frequentemente têm ISHO técnico alto e ISHO de autoestima baixo - o gap é o dado mais relevante.',
    mensagemPertencimento: 'Seu cérebro vê em 3D o que os outros mal conseguem imaginar em 2D. Isso não é desvantagem - é superpoder ainda não nomeado.'
  },

  // ============================================================
  // ALTAS HABILIDADES × D - O Visionário Implacável
  // ============================================================
  {
    id: 'AltasHabilidades-D',
    perfil: 'AltasHabilidades',
    disc: 'D',
    nome: 'O Visionário Implacável',
    frase: 'Vejo 10 passos à frente e fico frustrado quando o mundo anda 1.',
    neurociencia: 'Altas habilidades envolvem maior densidade de conexões neuronais em redes de processamento de alto nível, maior velocidade de processamento e hipersensibilidade de sistemas sensoriais e emocionais. O córtex pré-frontal é altamente ativo. Combinado com perfil D, cria liderança cognitiva de alto nível com baixa tolerância para mediocridade.',
    saudeEmocional: {
      pontosForca: ['Visão estratégica extraordinária', 'Capacidade de análise multidimensional simultânea', 'Liderança por competência e visão', 'Aprendizado de novas áreas com velocidade excepcional'],
      vulnerabilidades: ['Baixa tolerância à incompetência percebida - pode parecer arrogância', 'Tédio crônico em ambientes de baixo desafio', 'Hipersensibilidade emocional (OE emocional de Dabrowski)', 'Isolamento por dificuldade de encontrar pares intelectuais'],
      sinaisBurnout: ['Apatia profunda - "para que fazer algo que não vai mudar nada?"', 'Irritabilidade extrema em reuniões improdutivas', 'Engajamento em múltiplos projetos simultâneos sem concluir nenhum', 'Síndrome do impostor paradoxal: "sou capaz demais mas não pertenço"']
    },
    janelaNeuro: {
      melhorHorario: 'Flexível - processa bem em qualquer horário quando engajado; colapsa quando entediado',
      ambienteIdeal: 'Projetos de alta complexidade, equipe de alto nível, mínima burocracia',
      ritmoOtimo: 'Sprints intensos em problemas complexos com liberdade total de abordagem'
    },
    polivagal: {
      estadoDominante: 'Simpático em subestimulação (tédio); ventral vagal em desafio intelectual real',
      gatilhosOrganizacionais: ['Reuniões sem propósito claro', 'Tarefas abaixo do nível de competência', 'Hierarquia rígida sem meritocracia', 'Processos burocráticos sem lógica'],
      estrategiaRegulacao: ['Criar desafios pessoais dentro de tarefas chatas', 'Estabelecer projetos pessoais paralelos para estímulo', 'Praticar aceitação radical: "nem tudo precisa ser eficiente"', 'Exercício físico intenso como válvula de energia']
    },
    proposito: {
      motivadores: ['Desafios de alta complexidade com impacto real', 'Autonomia total para decisão estratégica', 'Ser reconhecido por competência excepcional', 'Deixar legado que muda o jogo'],
      flow: 'Estratégia de alto nível, resolução de problemas inéditos, liderança de transformação',
      sentidoNoTrabalho: 'Precisa de "missão impossível" - sem isso, se auto-sabota por falta de sentido'
    },
    estrategiasCuidado: [
      'Identificar 1 missão de alto impacto para o trimestre - âncora de sentido',
      'Praticar humildade intelectual: "não saber é o início do aprendizado"',
      'Encontrar comunidade de pares - grupos de alta performance',
      'Usar a energia da frustração para criar, não destruir',
      'Estabelecer um projeto pessoal de impacto social como válvula de propósito'
    ],
    paraOGestor: {
      comunicação: 'Direta, intelectualmente honesta e com desafio explícito. Não subestimate. Dê contexto estratégico, não apenas tarefas.',
      ambiente: 'Projetos de alta complexidade com autonomia real. Mínima supervisão. Espaço para propor e executar inovações.',
      evitar: ['Tarefas de baixa complexidade sem justificativa', 'Reuniões longas e improdutivas', 'Hierarquia rígida sem meritocracia clara', 'Feedback genérico sem profundidade intelectual'],
      potencializar: ['Liderança de transformação organizacional', 'Projetos de inovação estratégica', 'Consultoria interna de alto nível', 'Mentoria de talentos emergentes']
    },
    acomodacoesRazoaveis: [
      'Projetos de alta complexidade como prioridade de alocação',
      'Autonomia real para tomar decisões no seu escopo',
      'Acesso a informação estratégica para contexto amplo',
      'Espaço para propor inovações fora do escopo formal',
      'Flexibilidade de horário e formato de trabalho'
    ],
    ishoN: 'Risco de ISHO artificial: colaborador de altas habilidades pode manter ISHO alto por força de vontade enquanto experimenta vazio de sentido profundo. Monitorar indicador de "propósito percebido" separadamente.',
    mensagemPertencimento: 'O problema não é que você é demais. É que o mundo ainda está se adaptando para comportar pessoas como você. Continue.'
  },

  // ============================================================
  // ALTAS HABILIDADES × I - O Catalisador Genial
  // ============================================================
  {
    id: 'AltasHabilidades-I',
    perfil: 'AltasHabilidades',
    disc: 'I',
    nome: 'O Catalisador Genial',
    frase: 'Tenho mil ideias por minuto e quero compartilhar todas - porque sei que uma vai mudar tudo.',
    neurociencia: 'A sobredotação em perfil I combina processamento acelerado com alta excitabilidade psicomotora, intelectual e imaginativa (Dabrowski). O sistema límbico responde com intensidade emocional a ideias, conexões e possibilidades. O risco é dispersão por excesso de estímulo interno.',
    saudeEmocional: {
      pontosForca: ['Geração criativa prolífica', 'Entusiasmo que mobiliza grupos', 'Conexões entre campos distintos do conhecimento', 'Carisma intelectual que atrai talentos'],
      vulnerabilidades: ['Dispersão por excesso de ideias sem filtro de execução', 'Sensibilidade intensa à crítica de ideias (identidade = ideia)', 'Dificuldade em concluir projetos quando surge ideia nova', 'Solidão intelectual por não encontrar pares no mesmo nível de conexão'],
      sinaisBurnout: ['Hiperatividade caótica sem entrega concreta', 'Euforia artificial seguida de colapso emocional', 'Sensação de "estar desperdiçando o próprio potencial"', 'Relacionamentos superficiais por não tolerar baixa profundidade']
    },
    janelaNeuro: {
      melhorHorario: 'Manhã para criação e ideação; tarde para filtro e execução das melhores ideias',
      ambienteIdeal: 'Ambiente de alta estimulação intelectual, diversidade de pessoas, liberdade de expressão criativa',
      ritmoOtimo: 'Ciclos de ideação intensa + curadoria rigorosa + execução focada - evitar ficar apenas na ideação'
    },
    polivagal: {
      estadoDominante: 'Simpático positivo em ideação; ventral vagal em conexão intelectual profunda; colapso em subestimulação',
      gatilhosOrganizacionais: ['Ambientes que matam ideias antes de explorá-las', 'Reuniões sem profundidade intelectual', 'Limitação criativa por burocracia', 'Feedback que ignora a qualidade da ideia para focar no formato'],
      estrategiaRegulacao: ['Sistema de curadoria de ideias: capturar tudo, executar o melhor', 'Parceiro de accountability para conclusão de projetos', 'Rituais de "desligar o cérebro": meditação, exercício, natureza', 'Diferenciar crítica à ideia de crítica à pessoa']
    },
    proposito: {
      motivadores: ['Criar o que ainda não existe', 'Inspirar pessoas com ideias que mudam paradigmas', 'Colaborar com outros gênios criativos', 'Ver impacto de longo prazo de uma ideia'],
      flow: 'Brainstorming estratégico, design de soluções inovadoras, facilitação de inovação, storytelling transformador',
      sentidoNoTrabalho: 'Precisa sentir que está mudando algo - ideia sem impacto é tormento, não satisfação'
    },
    estrategiasCuidado: [
      'Sistema de captura de ideias (Notion, áudio) para não perder nada',
      'Praticar o "não por agora": filtrar sem descartar',
      'Estabelecer 1 projeto principal com OKR claro por trimestre',
      'Cultivar amizades intelectuais profundas - não apenas redes amplas',
      'Meditar ou praticar mindfulness para quietar o ruído interno'
    ],
    paraOGestor: {
      comunicação: 'Intelectualmente estimulante, aberta a ideias e com feedback sobre impacto, não apenas sobre execução.',
      ambiente: 'Espaço para ideação sem julgamento. Projetos com liberdade criativa real. Conexão com pessoas de alto nível.',
      evitar: ['Matar ideias antes de explorar', 'Ambiente de baixa estimulação intelectual', 'Colocar em tarefas de pura execução repetitiva', 'Feedback que ignora a profundidade criativa'],
      potencializar: ['Liderança de inovação e P&D', 'Facilitação de workshops criativos', 'Desenvolvimento de produtos e serviços', 'Embaixador de cultura de inovação']
    },
    acomodacoesRazoaveis: [
      'Espaço formal para proposta e experimentação de ideias',
      'Autonomia criativa real em projetos de inovação',
      'Acesso a referências externas (livros, eventos, comunidades)',
      'Parceiro de projeto para complementar com execução',
      'Tempo dedicado a projetos de livre exploração (tipo "20% time")'
    ],
    ishoN: 'Monitorar indicador de "conclusão": altas habilidades + I tende a iniciar muito e concluir pouco. O ISHO-N deve incluir taxa de projetos concluídos como dado de saúde.',
    mensagemPertencimento: 'Você não tem ideias demais - você tem um cérebro que não foi feito para o século XX. Bem-vindo ao futuro que você está criando.'
  },

  // ============================================================
  // ALTAS HABILIDADES × S - O Sábio Compassivo
  // ============================================================
  {
    id: 'AltasHabilidades-S',
    perfil: 'AltasHabilidades',
    disc: 'S',
    nome: 'O Sábio Compassivo',
    frase: 'Entendo profundamente e cuido genuinamente - às vezes o mundo não sabe o que fazer com isso.',
    neurociencia: 'A sobredotação emocional (OE emocional de Dabrowski) é intensa neste perfil: empatia quase sinestésica, sensibilidade a injustiças, processamento moral sofisticado. O sistema de cuidado (ocitocina) é altamente ativo. O paradoxo: inteligência de alto nível em um perfil que evita conflito - pode subestimar a própria contribuição.',
    saudeEmocional: {
      pontosForca: ['Empatia profunda e inteligência emocional excepcional', 'Sabedoria prática que integra lógica e cuidado', 'Capacidade de mediar conflitos com sutileza', 'Lealdade e consistência que constroem confiança duradoura'],
      vulnerabilidades: ['Subestimação da própria inteligência por humildade excessiva', 'Sobrecarga emocional por absorver o sofrimento alheio', 'Evitação de protagonismo por medo de parecer arrogante', 'Perfeccionismo silencioso que nunca se satisfaz'],
      sinaisBurnout: ['Esgotamento por excesso de empatia sem limites', 'Sensação de invisibilidade intelectual', 'Retraimento de relações que antes nutriam', 'Depressão mascarada por aparente estabilidade']
    },
    janelaNeuro: {
      melhorHorario: 'Manhã para trabalho de alta exigência cognitiva; momentos de conexão ao longo do dia para regulação emocional',
      ambienteIdeal: 'Ambiente de confiança, com espaço para expressão intelectual e emocional, equipe estável',
      ritmoOtimo: 'Alternância entre trabalho cognitivo profundo e conexão relacional restauradora'
    },
    polivagal: {
      estadoDominante: 'Ventral vagal em relações seguras; dorsal vagal quando subestimado ou sobrecarregado',
      gatilhosOrganizacionais: ['Injustiça organizacional percebida', 'Invisibilidade intelectual crônica', 'Ambiente competitivo sem cooperação', 'Excesso de demanda emocional sem reciprocidade'],
      estrategiaRegulacao: ['Estabelecer limites emocionais com compaixão', 'Nomear e validar a própria excelência', 'Criar espaço de expressão intelectual seguro', 'Recuperação ativa após períodos de alta demanda emocional']
    },
    proposito: {
      motivadores: ['Transformar vidas com profundidade real', 'Ambientes que valorizam sabedoria, não apenas velocidade', 'Relacionamentos profundos e recíprocos', 'Contribuição que persiste no tempo'],
      flow: 'Mentoria profunda, consultoria organizacional, psicologia, educação transformadora, liderança servidora',
      sentidoNoTrabalho: 'Precisa sentir que o cuidado que oferece é recíproco - não pode ser apenas o que dá'
    },
    estrategiasCuidado: [
      'Praticar o "protagonismo compassivo": mostrar-se sem precisar dominar',
      'Estabelecer limites emocionais: "posso apoiar até aqui"',
      'Criar espaço de expressão intelectual próprio (escrita, ensino, criação)',
      'Buscar relações de troca real - não apenas dar',
      'Reconhecer a própria genialidade como fato, não arrogância'
    ],
    paraOGestor: {
      comunicação: 'Gentil, profunda e com reconhecimento explícito da contribuição intelectual. Pergunte a opinião - ela é mais sofisticada do que parece.',
      ambiente: 'Ambiente de confiança com espaço para expressão. Proteja do excesso de demanda emocional. Promova para posições que exigem profundidade.',
      evitar: ['Subestimar a contribuição por discreta', 'Sobrecarregar com papel de "cuidador da equipe"', 'Ignorar a profundidade intelectual por aparência tranquila', 'Ambientes altamente competitivos sem cooperação'],
      potencializar: ['Liderança de pessoas e cultura', 'Desenvolvimento organizacional', 'Mentoria de talentos', 'Criação de ambientes psicologicamente seguros']
    },
    acomodacoesRazoaveis: [
      'Reconhecimento formal da contribuição intelectual e relacional',
      'Proteção contra sobrecarga emocional organizacional',
      'Espaço de expressão intelectual (escrita, ensino, criação)',
      'Acesso a suporte psicológico como prevenção, não apenas crise',
      'Ambiente de trabalho com cultura de segurança psicológica real'
    ],
    ishoN: 'Risco de ISHO mascarado por altruísmo: o colaborador cuida de todos e ninguém percebe que está se perdendo. Incluir indicador de "reciprocidade de cuidado" no ISHO-N.',
    mensagemPertencimento: 'Você carrega uma combinação rara: inteligência e compaixão no mesmo lugar. O mundo precisa de você inteiro - não só da metade que serve.'
  },

  // ============================================================
  // ALTAS HABILIDADES × C - O Gênio Metódico
  // ============================================================
  {
    id: 'AltasHabilidades-C',
    perfil: 'AltasHabilidades',
    disc: 'C',
    nome: 'O Gênio Metódico',
    frase: 'Se vale a pena fazer, vale a pena fazer com perfeição - e eu sei exatamente como.',
    neurociencia: 'A combinação de sobredotação com perfil C cria o que Dabrowski chamou de "intensidade intelectual" máxima: processamento simultâneo de múltiplas variáveis, hipersensibilidade a erros lógicos e necessidade profunda de coerência sistêmica. O perfeccionismo é neurológico, não psicológico - é a mente buscando correspondência perfeita entre modelo e realidade.',
    saudeEmocional: {
      pontosForca: ['Rigor analítico de nível excepcional', 'Síntese de conhecimento de áreas distintas', 'Pensamento sistêmico de longo prazo', 'Padrão de qualidade que eleva toda a organização'],
      vulnerabilidades: ['Paralisia por perfeccionismo inatingível', 'Isolamento por dificuldade de encontrar pares no mesmo nível', 'Impaciência com raciocínio superficial dos outros', 'Síndrome do impostor: "nunca sei o suficiente"'],
      sinaisBurnout: ['Paralisia total - "se não posso fazer perfeito, não faço"', 'Ruminação intelectual noturna que impede sono', 'Desengajamento como forma de proteção contra a mediocridade', 'Cinismo crescente sobre o valor do trabalho']
    },
    janelaNeuro: {
      melhorHorario: 'Tarde (14h–20h) para trabalho de análise profunda - quando o cérebro está totalmente acordado',
      ambienteIdeal: 'Silêncio absoluto ou ruído branco, espaço organizado, acesso a referências e dados',
      ritmoOtimo: 'Blocos longos (90–120 min) de foco profundo sem interrupção + recuperação completa entre blocos'
    },
    polivagal: {
      estadoDominante: 'Simpático em estados de injustiça lógica e subestimação; ventral vagal em desafio intelectual real',
      gatilhosOrganizacionais: ['Decisões sem base lógica sólida', 'Reuniões com raciocínio superficial', 'Interrupções de foco profundo', 'Reconhecimento por visibilidade em vez de excelência real'],
      estrategiaRegulacao: ['Definir "bom o suficiente" antes de começar qualquer projeto', 'Praticar a "regra 80/20" como filosofia deliberada', 'Criar rituais de desconexão cognitiva real', 'Cultivar relacionamentos com pares intelectuais como nutrição']
    },
    proposito: {
      motivadores: ['Criar conhecimento que perdura', 'Resolver o irresolvível com método rigoroso', 'Ser reconhecido como referência de excelência', 'Contribuir para o avanço real de uma área'],
      flow: 'Pesquisa profunda, desenvolvimento teórico, arquitetura de sistemas complexos, análise estratégica de longo prazo',
      sentidoNoTrabalho: 'Precisa de impacto real e duradouro - trabalho superficial é fisicamente doloroso para esse perfil'
    },
    estrategiasCuidado: [
      'Estabelecer critérios de "done" antes de começar - e respeitá-los',
      'Criar comunidade de pares intelectuais para troca real',
      'Separar identidade de resultado: "não sou meu trabalho"',
      'Praticar comunicação de expertise de forma acessível - ensinando',
      'Estabelecer horário rígido de desconexão cognitiva'
    ],
    paraOGestor: {
      comunicação: 'Técnica, profunda e com justificativa lógica sólida. Respeite o tempo de processamento. Forneça dados e contexto completo.',
      ambiente: 'Projetos de alta complexidade com autonomia real. Reconhecimento por excelência técnica. Mínima burocracia.',
      evitar: ['Reuniões frequentes e sem profundidade', 'Interromper foco profundo', 'Reconhecimento por visibilidade em vez de excelência', 'Cobrar velocidade em detrimento de qualidade'],
      potencializar: ['Pesquisa e desenvolvimento estratégico', 'Arquitetura de sistemas complexos', 'Mentoria técnica de alto nível', 'Referência de expertise organizacional']
    },
    acomodacoesRazoaveis: [
      'Projetos de longa duração com escopo de alta complexidade',
      'Autonomia real sobre método e processo de trabalho',
      'Proteção de foco: reuniões agendadas em blocos, não distribuídas',
      'Acesso a recursos de pesquisa e desenvolvimento de alto nível',
      'Avaliação por impacto e profundidade, não por velocidade ou volume'
    ],
    ishoN: 'Monitorar indicador de "sentido de impacto real": altas habilidades + C tende a desengajar silenciosamente quando percebe que o trabalho não tem relevância real. O vazio de sentido é o principal risco desse perfil.',
    mensagemPertencimento: 'Sua exigência com você mesmo é o reflexo de uma mente que sabe o que o mundo pode ser. Continue exigindo - mas cuide de quem está exigindo.'
  },

  // ============================================================
  // DESCOBRINDO × D - O Explorador Determinado
  // ============================================================
  {
    id: 'Descobrindo-D',
    perfil: 'Descobrindo',
    disc: 'D',
    nome: 'O Explorador Determinado',
    frase: 'Sempre soube que funciono diferente - agora estou descobrindo por quê, e isso muda tudo.',
    neurociencia: 'O processo de autoidentificação neurodivergente em adultos é em si um evento neurológico significativo: reorganiza narrativas de identidade e ativa o sistema de recompensa quando experiências passadas ganham explicação. O cérebro em descoberta processa ativamente memórias, comportamentos e relações sob nova luz - processo que consome energia cognitiva real.',
    saudeEmocional: {
      pontosForca: ['Determinação para entender a si mesmo', 'Liderança pelo exemplo de vulnerabilidade corajosa', 'Abertura a novas perspectivas sobre o próprio funcionamento', 'Resiliência construída por anos de adaptação sem mapa'],
      vulnerabilidades: ['Processo de luto por diagnóstico tardio - "e se eu soubesse antes?"', 'Instabilidade de identidade durante a reorganização do autoconceito', 'Hiperfoco no processo de descoberta que pode impactar rendimento', 'Vergonha retroativa de comportamentos não compreendidos'],
      sinaisBurnout: ['Paralisia existencial - "quem sou eu agora?"', 'Conflito entre persona profissional e eu real emergente', 'Irritabilidade por não encontrar validação', 'Exaustão por simultaneidade de descoberta e demanda profissional']
    },
    janelaNeuro: {
      melhorHorario: 'Varia conforme o perfil em investigação - explorar e registrar padrões pessoais como parte do processo',
      ambienteIdeal: 'Ambiente de segurança psicológica para experimentar diferentes estratégias e autorevelar gradualmente',
      ritmoOtimo: 'Em construção - o processo de descoberta é parte do ritmo ótimo'
    },
    polivagal: {
      estadoDominante: 'Variável - o processo de descoberta ativa oscilações entre estados com frequência maior que o habitual',
      gatilhosOrganizacionais: ['Pressão por performance "padrão" durante período de reorganização', 'Falta de validação do processo de descoberta', 'Ambientes que exigem máscara constante', 'Julgamentos por comportamentos não compreendidos anteriormente'],
      estrategiaRegulacao: ['Journaling de descoberta: registrar padrões observados', 'Comunidade de pares em processo similar', 'Suporte profissional (psicólogo especializado)', 'Compaixão ativa: "eu fiz o melhor que sabia com o que tinha"']
    },
    proposito: {
      motivadores: ['Autoconhecimento como combustível de liderança autêntica', 'Ser exemplo de que descoberta tardia transforma', 'Construir ambiente mais inclusivo a partir da própria experiência', 'Liderar com autenticidade crescente'],
      flow: 'Em construção - parte do processo é descobrir onde o flow acontece',
      sentidoNoTrabalho: 'Encontrar sentido é parte do processo - o trabalho de descoberta é o propósito atual'
    },
    estrategiasCuidado: [
      'Documentar padrões pessoais: o que drena, o que energiza, quando rende mais',
      'Buscar avaliação profissional especializada sem pressa',
      'Compartilhar o processo com 1–2 pessoas de confiança no trabalho',
      'Compaixão com o passado: você era neurodivergente antes de saber - seu esforço foi real',
      'Celebrar cada descoberta como ganho, não como confirmação de defeito'
    ],
    paraOGestor: {
      comunicação: 'Aberta, sem julgamento e com curiosidade genuína. Pergunte como pode apoiar. Não presuma o que a pessoa precisa.',
      ambiente: 'Segurança psicológica real para o processo de descoberta. Flexibilidade durante período de reorganização.',
      evitar: ['Pressionar por normalidade durante processo de descoberta', 'Julgamentos sobre comportamentos passados', 'Ignorar o processo como se não tivesse impacto', 'Exigir autorevelação antes que a pessoa esteja pronta'],
      potencializar: ['Embaixador de inclusão e neurodiversidade', 'Liderança autêntica por vulnerabilidade corajosa', 'Construção de cultura de segurança psicológica', 'Referência de que descoberta tardia é válida e transformadora']
    },
    acomodacoesRazoaveis: [
      'Flexibilidade durante período de avaliação e diagnóstico',
      'Acesso a suporte psicológico organizacional especializado',
      'Abertura para ajustes progressivos conforme descobertas',
      'Espaço de conversa confidencial com RH ou liderança de confiança',
      'Não exigir diagnóstico formal para iniciar adaptações razoáveis'
    ],
    ishoN: 'Check-in adaptado deve incluir questão específica sobre processo de descoberta: "como está sua jornada de autoconhecimento esta semana?" - abre espaço sem forçar. ISHO-N em construção é esperado e saudável.',
    mensagemPertencimento: 'Você não demorou para se descobrir. Você sobreviveu sem o mapa. E agora, com ele, imagine onde vai chegar.'
  },

  // ============================================================
  // DESCOBRINDO × I - O Contador de Histórias em Transformação
  // ============================================================
  {
    id: 'Descobrindo-I',
    perfil: 'Descobrindo',
    disc: 'I',
    nome: 'O Contador de Histórias em Transformação',
    frase: 'Sempre fui "muito" para os outros. Estou aprendendo que ser muito é exatamente o suficiente.',
    neurociencia: 'O processo de descoberta neurodivergente em perfis socialmente reativos (I) é especialmente intenso: anos de ajuste social para "pertencer" agora ganham nova interpretação. A descoberta ativa tanto o sistema de recompensa (finalmente faz sentido!) quanto o sistema de luto (por que não soube antes?). A integração dessa dualidade é o trabalho emocional central.',
    saudeEmocional: {
      pontosForca: ['Capacidade de narrar a própria jornada com poder inspirador', 'Empatia amplificada por experiência de não pertencimento', 'Abertura emocional que facilita o processo de descoberta', 'Potencial de se tornar embaixador de neurodiversidade'],
      vulnerabilidades: ['Hiperidentificação com o processo de descoberta - pode consumir toda a energia', 'Oscilações emocionais intensas durante reorganização de identidade', 'Busca por validação externa do processo interno', 'Tendência a compartilhar o processo antes de estar pronto'],
      sinaisBurnout: ['Euforia excessiva seguida de colapso emocional', 'Compartilhamento compulsivo sem filtro de contexto', 'Sensação de "finalmente me entendo mas ninguém entende eu"', 'Exaustão por simultaneidade de descoberta, elaboração e performance']
    },
    janelaNeuro: {
      melhorHorario: 'Em descoberta - parte do processo é mapear os próprios ritmos',
      ambienteIdeal: 'Comunidade de apoio, espaço de expressão, relações de segurança para exploração',
      ritmoOtimo: 'Alternância entre exploração interior e expressão exterior - sem colapsar em nenhum dos dois'
    },
    polivagal: {
      estadoDominante: 'Alta variabilidade durante processo de descoberta - sistema nervoso em reorganização ativa',
      gatilhosOrganizacionais: ['Não ter espaço para processar as descobertas', 'Julgamento por "comportamentos do passado"', 'Pressão para "se definir" antes de estar pronto', 'Ausência de comunidade de pertencimento durante o processo'],
      estrategiaRegulacao: ['Criar ritual diário de processamento emocional (journaling, conversa, arte)', 'Estabelecer limite de compartilhamento: "só falo quando estou pronto"', 'Comunidade de pares em processo similar', 'Suporte profissional especializado em neurodivergência adulta']
    },
    proposito: {
      motivadores: ['Transformar a própria jornada em impacto para outros', 'Pertencimento autêntico - não performático', 'Ser visto e aceito como realmente é', 'Contribuir para cultura de inclusão real'],
      flow: 'Em descoberta - identificar onde flow acontece é parte do processo',
      sentidoNoTrabalho: 'Encontrar propósito que integre quem está sendo com o que faz - a jornada e o destino se tornam um'
    },
    estrategiasCuidado: [
      'Criar espaço seguro para processar descobertas sem audiência',
      'Selecionar 1–2 pessoas de absoluta confiança para compartilhar o processo',
      'Estabelecer ritual semanal de integração: o que aprendi sobre mim essa semana?',
      'Separar processo de descoberta de performance profissional - ambos têm seu tempo',
      'Celebrar pequenas integrações: "hoje entendi por que faço X assim"'
    ],
    paraOGestor: {
      comunicação: 'Calorosa, sem pressão e com espaço real para a pessoa se revelar no seu tempo.',
      ambiente: 'Segurança psicológica e aceitação incondicional durante o processo. Sem exigir definição ou diagnóstico.',
      evitar: ['Pressionar por autodefinição antes da hora', 'Julgamento retroativo de comportamentos', 'Ignorar a intensidade emocional do processo', 'Exigir performance igual à de antes da descoberta'],
      potencializar: ['Potencial embaixador de neurodiversidade no futuro', 'Narrativa de transformação que inspira a equipe', 'Liderança por autenticidade crescente', 'Co-criação de políticas de inclusão neurodivergente']
    },
    acomodacoesRazoaveis: [
      'Suporte psicológico organizacional especializado em neurodivergência',
      'Flexibilidade durante período de reorganização de identidade',
      'Espaço de conversa confidencial sobre o processo',
      'Não exigir diagnóstico formal para iniciar adaptações',
      'Cultura organizacional que normaliza e celebra a descoberta tardia'
    ],
    ishoN: 'ISHO-N em processo de descoberta tem metodologia específica: focar em "como você está se sentindo sobre quem você é?" mais do que em indicadores de performance. A saúde da identidade é o dado mais relevante nessa fase.',
    mensagemPertencimento: 'Você não estava errado antes. Estava decodificando o mundo sem o manual. Agora você tem o manual. E é seu.'
  },

  // ============================================================
  // DESCOBRINDO × S - O Guardião em Florescimento
  // ============================================================
  {
    id: 'Descobrindo-S',
    perfil: 'Descobrindo',
    disc: 'S',
    nome: 'O Guardião em Florescimento',
    frase: 'Sempre cuidei de todos sem entender por que me esgotava tanto. Agora começo a entender.',
    neurociencia: 'Em perfis S, o processo de descoberta neurodivergente frequentemente revela padrões de masking social intenso: a adaptação constante ao ambiente e ao grupo consumia energia neurológica real enquanto parecia "natural". A descoberta traz alívio ("faz sentido!") e dor ("quanto esgotamento desnecessário").',
    saudeEmocional: {
      pontosForca: ['Gentileza com si mesmo que começa a se desenvolver', 'Compreensão profunda de quem passou por adaptação sem apoio', 'Cuidado que agora encontra base e limites', 'Lealdade a si mesmo que se constrói gradualmente'],
      vulnerabilidades: ['Processo de luto pelo tempo perdido em masking', 'Dificuldade em pedir ajuda por hábito de ser quem apoia', 'Resistência a mudar o que "sempre funcionou" mesmo que custe caro', 'Medo de que a descoberta mude como os outros o veem'],
      sinaisBurnout: ['Colapso silencioso após período de grande esforço de adaptação', 'Somatização: sintomas físicos sem diagnóstico claro', 'Desconexão de relações que antes eram fonte de energia', 'Sensação de "não me reconheço mais"']
    },
    janelaNeuro: {
      melhorHorario: 'Em descoberta - parte do processo é aprender os próprios ritmos sem culpa',
      ambienteIdeal: 'Ambiente estável e seguro para experimentar ser mais autentico gradualmente',
      ritmoOtimo: 'Construção gradual de ritmo mais alinhado com o self real - sem rupturas abruptas'
    },
    polivagal: {
      estadoDominante: 'Dorsal vagal em momentos de sobrecarga e descoberta intensa; ventral em relações de confiança',
      gatilhosOrganizacionais: ['Pressão para manter masking depois da descoberta', 'Falta de espaço para processar em silêncio', 'Julgamento por mudanças de comportamento durante o processo', 'Ausência de suporte especializado'],
      estrategiaRegulacao: ['Permissão para reduzir masking gradualmente em ambientes seguros', 'Rituais de recuperação após interações sociais intensas', 'Comunicar necessidades gradualmente - começar com 1 pessoa de confiança', 'Celebrar cada momento de autenticidade como vitória']
    },
    proposito: {
      motivadores: ['Cuidar de si mesmo como prioridade pela primeira vez', 'Construir relações baseadas no self real', 'Ser exemplo de que cuidado começa em si', 'Contribuir para ambientes mais humanos'],
      flow: 'Em descoberta - aprender onde o flow acontece sem masking é parte do processo',
      sentidoNoTrabalho: 'Trabalho alinhado com valores reais - não com expectativas performáticas'
    },
    estrategiasCuidado: [
      'Praticar o "eu também preciso": nomear as próprias necessidades diariamente',
      'Reduzir masking em 1 contexto seguro por vez',
      'Rituais de recuperação pós-interação social intensa',
      'Buscar suporte especializado em neurodivergência adulta',
      'Celebrar cada ato de autocuidado como revolução pessoal'
    ],
    paraOGestor: {
      comunicação: 'Gentil, paciente e sem pressão. Demonstre que a descoberta é bem-vinda e que o suporte é real.',
      ambiente: 'Segurança real para ser progressivamente mais autêntico. Flexibilidade para ajustes graduais.',
      evitar: ['Exigir que continue exatamente como antes', 'Ignorar a intensidade do processo', 'Sobrecarregar com demanda de cuidado alheio durante processo pessoal', 'Julgamento por mudanças de comportamento'],
      potencializar: ['Referência de humanidade e cuidado autêntico', 'Construtor de culturas psicologicamente seguras', 'Embaixador de neurodiversidade a partir da própria experiência', 'Mentoria de integração e pertencimento']
    },
    acomodacoesRazoaveis: [
      'Suporte psicológico especializado em neurodivergência',
      'Flexibilidade para ajustes graduais de comportamento e comunicação',
      'Espaço de recuperação após interações sociais intensas',
      'Cultura que normaliza e acolhe o processo de autodescobrimento',
      'Sem exigência de diagnóstico para iniciar adaptações de suporte'
    ],
    ishoN: 'Incluir indicador de "autenticidade progressiva": "em quantos momentos esta semana você foi verdadeiramente você?" - mede saúde de identidade durante o florescimento.',
    mensagemPertencimento: 'Você passou anos sendo o porto seguro de todos. Agora é sua vez de chegar em terra firme. E você merece isso.'
  },

  // ============================================================
  // DESCOBRINDO × C - O Investigador de Si Mesmo
  // ============================================================
  {
    id: 'Descobrindo-C',
    perfil: 'Descobrindo',
    disc: 'C',
    nome: 'O Investigador de Si Mesmo',
    frase: 'Sempre analisei tudo com rigor. Agora finalmente estou me analisando - e o que descubro muda tudo.',
    neurociencia: 'O perfil C em processo de descoberta neurodivergente aplica o mesmo rigor analítico que usa profissionalmente para investigar o próprio funcionamento. Isso é simultaneamente um recurso (compreensão profunda e rápida do perfil neurodivergente) e um risco (ruminação e análise excessiva sem integração emocional).',
    saudeEmocional: {
      pontosForca: ['Investigação rigorosa e profunda do próprio perfil', 'Capacidade de articular descobertas com clareza e precisão', 'Autoconhecimento que rapidamente se torna sofisticado', 'Habilidade de criar sistemas de adaptação eficazes'],
      vulnerabilidades: ['Análise excessiva sem integração emocional - "entendo mas não sinto"', 'Perfeccionismo no processo de descoberta - precisa entender tudo antes de agir', 'Ruminação sobre o passado à luz das novas descobertas', 'Resistência a aceitar o que não tem resposta analítica clara'],
      sinaisBurnout: ['Paralisia por excesso de análise do próprio funcionamento', 'Isolamento para processar sem interferência', 'Irritabilidade com quem "não entende a profundidade" do processo', 'Esgotamento por simultaneidade de análise cognitiva e demanda profissional']
    },
    janelaNeuro: {
      melhorHorario: 'Em descoberta - o rigor analítico do C acelera o processo de mapeamento dos próprios ritmos',
      ambienteIdeal: 'Espaço de reflexão solitária com acesso a recursos de pesquisa sobre neurodivergência',
      ritmoOtimo: 'Alternância entre análise rigorosa e integração emocional - não ficar apenas em um dos dois'
    },
    polivagal: {
      estadoDominante: 'Simpático em incerteza sobre o próprio funcionamento; ventral em compreensão e integração',
      gatilhosOrganizacionais: ['Pressão por "aceitar logo" sem tempo de análise adequado', 'Falta de informação de qualidade sobre o perfil neurodivergente identificado', 'Ambiguidade sobre o que muda e o que permanece após a descoberta', 'Expectativa de mudança imediata sem reconhecer a profundidade do processo'],
      estrategiaRegulacao: ['Criar sistema de análise pessoal: diário de padrões e descobertas', 'Estabelecer limite de análise: "hoje processo até X horas, depois desconecto"', 'Integrar análise com experiência corporal: o que sinto quando entendo isso?', 'Comunidade de pares com nível similar de profundidade reflexiva']
    },
    proposito: {
      motivadores: ['Compreensão completa e rigorosa do próprio funcionamento', 'Criar sistemas de adaptação eficazes a partir das descobertas', 'Contribuir com conhecimento especializado sobre neurodivergência', 'Ser referência de autoconhecimento profundo'],
      flow: 'Em descoberta - o próprio processo de investigação é uma forma de flow para esse perfil',
      sentidoNoTrabalho: 'Trabalho que integra o self descoberto com a expertise profissional - a síntese é o sentido'
    },
    estrategiasCuidado: [
      'Criar diário analítico de descobertas - com coluna de "como me sinto sobre isso"',
      'Estabelecer critério de "compreensão suficiente" antes de agir',
      'Buscar literatura científica de qualidade sobre o perfil identificado',
      'Integrar a descoberta em identidade profissional de forma gradual',
      'Praticar a tolerância à ambiguidade: "não preciso entender tudo para avançar"'
    ],
    paraOGestor: {
      comunicação: 'Precisa, com dados e respeito pelo rigor do processo. Ofereça recursos de qualidade sobre neurodivergência.',
      ambiente: 'Espaço para investigação e integração gradual. Respeite o tempo de processamento analítico.',
      evitar: ['Pressionar por aceitação ou mudança rápida', 'Dar informação superficial sobre neurodivergência', 'Ignorar a profundidade do processo analítico', 'Exigir que "normalize logo" o comportamento'],
      potencializar: ['Desenvolvimento de protocolos de inclusão baseados em evidência', 'Contribuição para políticas de neurodiversidade organizacional', 'Liderança por expertise em autoconhecimento profundo', 'Referência de que rigor e vulnerabilidade coexistem']
    },
    acomodacoesRazoaveis: [
      'Acesso a recursos de qualidade sobre o perfil neurodivergente identificado',
      'Suporte psicológico especializado em avaliação e integração',
      'Tempo adequado para processo de investigação sem pressão de performance',
      'Espaço de reflexão e processamento sem interrupção',
      'Flexibilidade para ajustes baseados nas descobertas progressivas'
    ],
    ishoN: 'Criar indicador de "integração vs. análise": o C tende a compreender sem integrar emocionalmente. O ISHO-N saudável mostra análise E integração crescendo juntas - não apenas uma.',
    mensagemPertencimento: 'Você sempre entendeu sistemas complexos. Agora está entendendo o mais complexo de todos: você mesmo. E isso é a investigação mais importante da sua vida.'
  }
]

export function getConstelacao(perfil: NeuroPerfil, disc: DiscTipo): ConstelacaoEmocional | undefined {
  return constelacoes.find(c => c.perfil === perfil && c.disc === disc)
}

export function getPorPerfil(perfil: NeuroPerfil): ConstelacaoEmocional[] {
  return constelacoes.filter(c => c.perfil === perfil)
}

export function getPorDisc(disc: DiscTipo): ConstelacaoEmocional[] {
  return constelacoes.filter(c => c.disc === disc)
}

export function getCheckInAdaptado(perfil: NeuroPerfil): string[] {
  const checkIns: Record<NeuroPerfil, string[]> = {
    TDAH: [
      'Como está seu nível de energia hoje? (1–10)',
      'Você conseguiu iniciar as tarefas planejadas?',
      'Houve algo que te distraiu mais que o normal?',
      'Como está sua relação com as pessoas ao seu redor hoje?',
      'Tem algo que está pesando que você ainda não falou?'
    ],
    TEA: [
      'Como está seu nível de sobrecarga sensorial hoje? (1–10)',
      'Sua rotina foi respeitada ou houve mudanças imprevistas?',
      'Você teve espaço para recuperação após interações sociais?',
      'Como você avalia sua energia para o trabalho amanhã?',
      'Tem algo no ambiente que precisaria mudar para você funcionar melhor?'
    ],
    Dislexia: [
      'Como você se sentiu em relação ao seu desempenho hoje? (1–10)',
      'Teve situações onde a dificuldade com texto ou leitura impactou seu trabalho?',
      'Você usou as ferramentas de suporte disponíveis?',
      'Como está sua autoestima profissional hoje?',
      'Tem algo que a empresa poderia fazer para facilitar seu trabalho?'
    ],
    AltasHabilidades: [
      'Como está seu nível de estimulação intelectual esta semana? (1–10)',
      'Você está entediado, equilibrado ou sobrecarregado cognitivamente?',
      'Seu trabalho está alinhado com seu potencial real?',
      'Como está sua relação com os colegas e lideranças?',
      'Tem um projeto ou desafio que gostaria de explorar?'
    ],
    Descobrindo: [
      'Como está sua jornada de autoconhecimento esta semana?',
      'Você fez alguma descoberta sobre si mesmo que gostaria de compartilhar?',
      'Como está seu nível de energia para o trabalho? (1–10)',
      'Você tem se sentido apoiado nesse processo de descoberta?',
      'Tem algo que a empresa poderia fazer para tornar esse processo mais seguro?'
    ]
  }
  return checkIns[perfil]
}

export function getAcomodacoesUniversais(): string[] {
  return [
    'Comunicação clara e explícita de expectativas e critérios de avaliação',
    'Flexibilidade de formato de comunicação (oral, escrito, visual)',
    'Ambiente com controle sensorial básico disponível',
    'Cultura que normaliza diferentes estilos cognitivos e de trabalho',
    'Acesso a suporte psicológico como prevenção, não apenas em crise',
    'Liderança treinada para gestão neurodiversa inclusiva'
  ]
}

export const PERFIS_LABELS: Record<NeuroPerfil, string> = {
  TDAH: 'TDAH',
  TEA: 'TEA / Autismo',
  Dislexia: 'Dislexia',
  AltasHabilidades: 'Altas Habilidades',
  Descobrindo: 'Em Descoberta'
}

export const DISC_LABELS: Record<DiscTipo, string> = {
  D: 'Dominante - Executor',
  I: 'Influente - Catalisador',
  S: 'Estável - Conector',
  C: 'Consciente - Analítico'
}

// ===== PCD (Pessoa com Deficiência) =====
// Perfil separado da matriz perfil×DISC acima (que é só neurodivergência),
// pois cruzar 3 novos perfis × 4 DISC exigiria 12 constelações emocionais
// completas — optamos por um modelo mais enxuto, no mesmo espírito do Agro Tech.
export type PcdPerfil = 'Visual' | 'Auditiva' | 'Motora'

export interface PcdInfo {
  perfil: PcdPerfil
  label: string
  icone: string
  desc: string
  pontosForca: string[]
  desafiosNoTrabalho: string[]
  comoComunicar: string[]
  acomodacoesRazoaveis: string[]
  sinaisDeAlerta: string[]
}

export const PCD_INFO: Record<PcdPerfil, PcdInfo> = {
  Visual: {
    perfil: 'Visual', label: 'Deficiência Visual', icone: '👁️',
    desc: 'Baixa visão ou cegueira — parcial ou total',
    pontosForca: ['Memória auditiva e organizacional acima da média', 'Alta produtividade com ferramentas de leitor de tela bem configuradas', 'Excelente em funções analíticas e de atendimento por voz'],
    desafiosNoTrabalho: ['Sistemas e planilhas sem compatibilidade com leitor de tela', 'Reuniões com apresentações só visuais, sem descrição', 'Documentos em PDF escaneado (imagem, não texto selecionável)'],
    comoComunicar: ['Descreva verbalmente o que está na tela durante reuniões', 'Envie documentos em formato acessível (texto, não imagem)', 'Avise verbalmente sobre mudanças no ambiente físico do escritório', 'Pergunte qual leitor de tela a pessoa usa e valide compatibilidade dos sistemas'],
    acomodacoesRazoaveis: ['Leitor de tela (NVDA/JAWS/VoiceOver) licenciado e sistemas testados com ele', 'Documentos e e-mails em formato acessível por padrão', 'Trajeto físico do escritório sempre no mesmo layout', 'Treinamentos com áudio-descrição'],
    sinaisDeAlerta: ['Queda de produtividade após mudança de sistema/software', 'Isolamento em reuniões por não conseguir seguir conteúdo visual', 'Retrabalho por depender de terceiros para ler documentos inacessíveis'],
  },
  Auditiva: {
    perfil: 'Auditiva', label: 'Deficiência Auditiva', icone: '👂',
    desc: 'Surdez ou baixa audição — parcial ou total',
    pontosForca: ['Alta concentração em ambientes visualmente organizados', 'Comunicação escrita frequentemente muito clara e direta', 'Boa performance em trabalho assíncrono e documentado'],
    desafiosNoTrabalho: ['Reuniões sem legenda ou intérprete de Libras', 'Chamadas de vídeo sem transcrição em tempo real', 'Avisos sonoros de sistema (alertas, notificações) sem alternativa visual'],
    comoComunicar: ['Garanta contato visual antes de falar', 'Use legendas automáticas ou intérprete de Libras em reuniões', 'Prefira comunicação escrita (chat, e-mail) para assuntos importantes', 'Troque alertas sonoros de sistema por notificação visual'],
    acomodacoesRazoaveis: ['Intérprete de Libras ou legenda em tempo real em reuniões e treinamentos', 'Cultura de registrar decisões por escrito, não só verbalmente', 'Alertas visuais em vez de sonoros em sistemas internos'],
    sinaisDeAlerta: ['Ausência ou baixa participação em reuniões sem suporte adequado', 'Perda de informações importantes passadas só verbalmente', 'Isolamento social por dificuldade de comunicação informal'],
  },
  Motora: {
    perfil: 'Motora', label: 'Deficiência Motora', icone: '🦽',
    desc: 'Mobilidade reduzida — membros, cadeira de rodas, próteses',
    pontosForca: ['Alta concentração em funções analíticas e de gestão', 'Forte comprometimento e baixa rotatividade quando o posto é bem adaptado', 'Frequentemente excelente em liderança e planejamento'],
    desafiosNoTrabalho: ['Escritório/mobiliário não adaptado (mesa, acesso, banheiro)', 'Fadiga maior em jornadas longas sem pausas', 'Eventos e reuniões presenciais em locais sem acessibilidade'],
    comoComunicar: ['Pergunte diretamente o que a pessoa precisa — não presuma', 'Trate com naturalidade, sem superproteção', 'Combine pausas extras sem constranger publicamente'],
    acomodacoesRazoaveis: ['Mesa, cadeira e acesso físico adaptados desde o primeiro dia', 'Opção de trabalho remoto/híbrido quando o deslocamento é barreira', 'Verificação de acessibilidade antes de marcar eventos presenciais'],
    sinaisDeAlerta: ['Fadiga crescente relatada em jornadas longas', 'Faltas recorrentes em eventos presenciais por barreira de acesso', 'Sinais de exclusão informal (não é convidado por "dar trabalho" de adaptar)'],
  },
}

export function getCheckInPcd(perfil: PcdPerfil): string[] {
  const extra: Record<PcdPerfil, string> = {
    Visual: 'Algum documento ou sistema não estava acessível ao leitor de tela?',
    Auditiva: 'Alguma reunião ou aviso ficou sem legenda/intérprete disponível?',
    Motora: 'Encontrou alguma barreira física de acesso ou mobiliário hoje?',
  }
  return [
    'Como está seu nível de energia hoje? (1–5)',
    extra[perfil],
    'Como está sua fadiga física/mental? (1–5)',
    'Tem algo que a empresa poderia ajustar essa semana?',
  ]
}

export { constelacoes }
