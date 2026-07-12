export const metadata = {
  title: 'Manifesto da Inteligência Humana Adaptativa | Sense AI',
  description: 'Por que a Essencial Human Tech existe, o que é Inteligência Humana Adaptativa, e a visão para os próximos dez anos.',
}

const ACCENT = '#A78BFA'
const ACCENT2 = '#EC4899'

export default function ManifestoPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a15', color: '#F8F8FF', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 96px' }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>
            Essencial Human Tech
          </div>
          <h1 style={{ fontSize: 'clamp(28px,5vw,42px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 16 }}>
            Manifesto da <span style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Inteligência Humana Adaptativa</span>
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)' }}>Por Alana Carvalho, fundadora da Essencial Human Tech</p>
        </div>

        <article style={{ fontSize: 16, lineHeight: 1.85, color: 'rgba(255,255,255,.85)' }}>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: ACCENT2, marginTop: 40, marginBottom: 16 }}>Por que a Essencial Human Tech existe</h2>
          <p style={{ marginBottom: 20 }}>Como gestora de pessoas e especialista em psicologia organizacional, eu via todo dia a mesma carência: faltava uma ferramenta capaz de avaliar as pessoas por completo, enxergando as diferenças e particularidades de cada uma, em vez de reduzir todo mundo à mesma régua. Foi essa necessidade que me fez criar um aplicativo pra ajudar as pessoas a explorarem o próprio potencial de verdade.</p>
          <p style={{ marginBottom: 20 }}>Eu não comecei essa empresa porque acreditava em tecnologia. Comecei porque via, todo dia, o mesmo erro se repetindo em salas de aula, em fazendas, em escritórios de RH: tratávamos pessoas diferentes como se fossem a mesma pessoa.</p>
          <p style={{ marginBottom: 20 }}>O aluno com TDAH recebia o mesmo cronograma do aluno neurotípico. O colaborador rural com deficiência auditiva não tinha alarme visual de segurança porque ninguém pensou nele ao desenhar o sistema. O gestor treinado pra liderar &quot;todo mundo&quot; na prática não liderava ninguém de verdade, porque ninguém existe.</p>
          <p style={{ marginBottom: 20 }}>Isso não é falta de cuidado. É falta de instrumento. Um professor com 40 alunos, um gestor de RH com 300 colaboradores, um gerente de fazenda com equipe sazonal: nenhum deles tem tempo humano suficiente pra enxergar cada pessoa com a profundidade que ela merece. A intenção quase sempre existe. A capacidade de execução, não.</p>
          <p style={{ marginBottom: 20 }}>A Essencial Human Tech existe pra resolver esse problema específico: dar a quem cuida de pessoas (professores, psicólogos, gestores, RH, líderes rurais) a capacidade de enxergar cada indivíduo com profundidade, na escala em que a vida real exige.</p>
          <p style={{ marginBottom: 20 }}>Não construímos isso porque a IA é o futuro. Construímos porque, sem ela, a promessa de &quot;cuidar de cada um&quot; continua sendo uma frase bonita que a realidade nunca deixa cumprir.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: ACCENT2, marginTop: 40, marginBottom: 16 }}>O que é Inteligência Humana Adaptativa</h2>
          <p style={{ marginBottom: 20 }}>Inteligência Humana Adaptativa (IHA) não é a inteligência artificial ficando mais parecida com humano. É o oposto: é a tecnologia aprendendo a se curvar diante da diferença humana, em vez de exigir que o humano se encaixe nela.</p>
          <p style={{ marginBottom: 20 }}>A maior parte da tecnologia que existe hoje faz o inverso. Ela padroniza. Um app de estudos que dá o mesmo cronograma pra todo mundo. Um sistema de gestão que mede desempenho com a mesma régua, não importa o perfil de quem está sendo medido. Isso não é neutro: é uma forma de exclusão disfarçada de eficiência.</p>
          <p style={{ marginBottom: 20 }}>IHA são três compromissos concretos, não uma frase de efeito:</p>
          <p style={{ marginBottom: 20 }}><strong style={{ color: '#fff' }}>Ela aprende com quem você é</strong>, não com quem a média das pessoas é. Um aluno com dislexia não recebe uma versão &quot;adaptada&quot; do mesmo material: recebe um caminho pensado a partir de como ele efetivamente aprende. Um colaborador com deficiência visual não ganha uma &quot;acomodação&quot;. Ganha um sistema desenhado considerando que ele existe.</p>
          <p style={{ marginBottom: 20 }}><strong style={{ color: '#fff' }}>Ela muda junto com você.</strong> Perfil humano não é estático: muda com a idade, o contexto, a fase de vida, a crise que se atravessa. Um sistema que te classifica uma vez e te trata daquele jeito pra sempre não é adaptativo, é só mais um rótulo.</p>
          <p style={{ marginBottom: 20 }}><strong style={{ color: '#fff' }}>Ela existe pra ampliar julgamento humano, não pra substituí-lo.</strong> Uma IA que decide sozinha o que é melhor pra você tirou de você o que há de mais humano: a capacidade de decidir. IHA entrega informação, contexto e previsão. A decisão continua sendo sua.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: ACCENT2, marginTop: 40, marginBottom: 16 }}>Como a IA pode desenvolver pessoas sem substituir sua humanidade</h2>
          <p style={{ marginBottom: 20 }}>Essa é a tensão real, e eu não vou fingir que ela é fácil de resolver.</p>
          <p style={{ marginBottom: 20 }}>Toda tecnologia que promete &quot;desenvolver pessoas&quot; corre um risco genuíno: o de fazer as pessoas dependerem da tecnologia pra pensar, sentir e decidir por elas mesmas. Isso já aconteceu antes: com a calculadora, com o corretor ortográfico, com o GPS. Ganhamos eficiência e perdemos, um pouco, a musculatura de fazer sozinhos.</p>
          <p style={{ marginBottom: 20 }}>Com IA aplicada a desenvolvimento humano, a aposta é mais alta. Se ela decide por você quem você deveria ser, o que deveria sentir, pra onde deveria ir, ela não te desenvolveu. Ela te substituiu.</p>
          <p style={{ marginBottom: 20 }}>A linha que separamos com muito cuidado é esta: <strong style={{ color: '#fff' }}>a IA pode ver padrões que você não vê sozinho, mas nunca pode decidir o que fazer com eles no seu lugar.</strong></p>
          <p style={{ marginBottom: 20 }}>Na prática, isso significa: a IA aponta que um professor está mostrando sinais de esgotamento antes que ele perceba, mas é o professor, e só ele, que decide o que fazer com essa informação. A IA identifica que um aluno aprende melhor de manhã, mas é o aluno que decide se vai reorganizar a rotina. A IA prevê risco de queda de desempenho numa equipe rural, mas é o gestor, olhando as próprias pessoas, que decide como agir.</p>
          <p style={{ marginBottom: 20 }}>Toda vez que a Essencial constrói uma funcionalidade nova, a pergunta que fazemos primeiro não é &quot;o que a IA consegue fazer aqui&quot;. É: <strong style={{ color: '#fff' }}>essa funcionalidade devolve poder de decisão pra pessoa, ou tira dela?</strong> Se a resposta for &quot;tira&quot;, não construímos, não importa quão impressionante a tecnologia seja.</p>
          <p style={{ marginBottom: 20 }}>Isso significa que, às vezes, escolhemos deliberadamente fazer menos do que poderíamos tecnicamente fazer. É uma escolha, e eu assumo ela.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: ACCENT2, marginTop: 40, marginBottom: 16 }}>Como será a educação, o trabalho, a saúde e o agro nos próximos dez anos</h2>
          <p style={{ marginBottom: 20 }}>Não tenho bola de cristal, mas tenho uma convicção que sustento com clareza: os próximos dez anos vão separar dois tipos de organização: as que usarem IA pra ver a diferença humana, e as que usarem IA pra apagá-la ainda mais rápido.</p>
          <p style={{ marginBottom: 20 }}><strong style={{ color: '#fff' }}>Na educação</strong>, o modelo de turma única com ritmo único já não se sustenta: ele nunca fez sentido, só era operacionalmente inevitável até agora. Em dez anos, uma escola vai saber, de verdade, como cada um dos seus alunos aprende, não por um teste de QI genérico, mas por acompanhamento contínuo e real. O risco: escolas vão usar isso pra otimizar nota em prova, não pra desenvolver gente. A diferença entre as duas coisas vai definir quem realmente muda a educação.</p>
          <p style={{ marginBottom: 20 }}><strong style={{ color: '#fff' }}>No trabalho</strong>, gestão de pessoas vai deixar de ser instinto e planilha, e passar a ser dado real com contexto humano. Isso é bom se usado pra desenvolver, e assustador se usado só pra vigiar e descartar mais rápido quem &quot;não performa&quot;. A neurodiversidade e a inclusão de PCDs, hoje tratadas como exceção ou obrigação legal, vão virar vantagem competitiva de verdade pras empresas que entenderem isso primeiro. As que não entenderem vão continuar perdendo talento por pura falta de adaptação.</p>
          <p style={{ marginBottom: 20 }}><strong style={{ color: '#fff' }}>Na saúde</strong>, principalmente saúde mental e emocional, o problema nunca foi falta de informação, foi falta de detecção precoce e de canal seguro pra pedir ajuda antes da crise. IA vai poder apontar sinais de sofrimento antes que virem afastamento, burnout, ou coisa pior. O risco moral aqui é enorme: até onde é cuidado, e até onde é vigilância disfarçada de cuidado? Não tenho essa resposta pronta, só sei que ela precisa ser feita em voz alta, sempre, não decidida em silêncio por quem constrói o sistema.</p>
          <p style={{ marginBottom: 20 }}><strong style={{ color: '#fff' }}>No agro</strong>, a tecnologia sempre chegou primeiro pro solo, pro clima, pro maquinário, nunca pras pessoas que fazem tudo isso funcionar, especialmente nos períodos de maior pressão do calendário agrícola. Isso vai mudar, porque o custo de ignorar gestão de pessoas no campo (turnover, acidente, sobrecarga, exclusão de PCDs e neurodivergentes) está ficando visível demais pra continuar sendo ignorado.</p>
          <p style={{ marginBottom: 20 }}>Em comum entre os quatro: dado nunca resolveu problema humano sozinho. Só ajuda quando alguém com julgamento humano (professor, gestor, psicólogo, líder rural) usa esse dado pra agir com mais cuidado, não menos.</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: ACCENT2, marginTop: 40, marginBottom: 16 }}>A visão da Essencial Human Tech para esse futuro</h2>
          <p style={{ marginBottom: 20 }}>Não queremos ser a empresa que promete que a IA vai resolver tudo. Queremos ser a que constrói tecnologia assumindo, desde o desenho, que cada pessoa é irrepetível, e que isso não é uma complicação a ser gerenciada, é o ponto de partida.</p>
          <p style={{ marginBottom: 20 }}>Nossa aposta é que, em dez anos, &quot;Inteligência Humana Adaptativa&quot; não vai ser mais um termo nosso: vai ser o mínimo que qualquer tecnologia séria vai precisar oferecer, do mesmo jeito que hoje ninguém aceita mais um site que não funciona no celular. Quando isso acontecer, não teremos perdido nosso diferencial. Teremos vencido o motivo pelo qual essa empresa existe.</p>
          <p style={{ marginBottom: 20 }}>Até lá, seguimos com o mesmo critério em cada linha de código, em cada funcionalidade nova, nos cinco produtos que construímos: essa tecnologia enxerga essa pessoa como ela realmente é, ou está pedindo, sem dizer, que ela se pareça mais com a média?</p>
          <p style={{ marginBottom: 20 }}>Se a resposta for a segunda, ainda não terminamos o trabalho.</p>

        </article>

        <div style={{ textAlign: 'center', marginTop: 56, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,.1)' }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: ACCENT }}>Essencial Human Tech</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 4 }}>Transformando tecnologia em desenvolvimento humano.</p>
        </div>

      </div>
    </div>
  )
}
