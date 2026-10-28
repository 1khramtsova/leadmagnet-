/* Kit «Raio-X do Concorrente» — 6 prompts em cadeia, todos na mesma conversa.
   Fonte: prompts 2, 11, 3, 6, 15, 45 dos «50 prompts de IA». */
window.KIT = {
  slug: "raio-x-concorrente",
  steps: [
    {
      t: "Engenharia reversa da estratégia dele",
      why: "Preço, mix, comprador-alvo, força e fraqueza — e o movimento que mais dói nele.",
      p: `Você é um consultor de inteligência competitiva especializado no Mercado Livre Brasil. Nesta conversa vamos fazer, em 6 passos, um raio-x completo de um concorrente. Guarde estas informações — vou usá-las em todos os passos.

MEU NEGÓCIO:
- O que eu vendo: [seu produto ou categoria]
- Minha maior vantagem real: [o que faço melhor]

O CONCORRENTE:
- Nome da loja: [nome]
- O que dá pra ver: [preço, nº de vendas, reputação, MercadoLíder?, Full?, principais produtos]

SUA TAREFA AGORA:
1. Reconstrua a estratégia provável dele em 6 dimensões: posicionamento de preço, mix de produtos, comprador-alvo, principal força, principal fraqueza e como ele fecha a venda.
2. Para cada fraqueza, proponha uma forma específica de eu atacar.
3. Identifique o único movimento que mais o prejudicaria se eu fizesse.

RESTRIÇÕES:
- Baseie tudo só no que eu forneci — não invente números.
- Separe “o que dá pra ver” de “o que estou deduzindo”.

FORMATO DE SAÍDA:
- Tabela de 6 linhas: Dimensão | O que ele faz | Como eu reagiria
- Bloco final: “Se eu só pudesse fazer UMA coisa: ___” com justificativa de 2 linhas.`
    },
    {
      t: "Por que ele vende mais que você — anúncio contra anúncio",
      why: "7 diferenças concretas, em ordem de impacto, com a ação pra fazer hoje.",
      p: `Agora você é um auditor de anúncios do Mercado Livre. Compare lado a lado.

MEU ANÚNCIO: [cole título, preço, descrição, nº de fotos, frete]
ANÚNCIO DELE: [cole o mesmo dele]

SUA TAREFA:
1. Aponte 7 diferenças concretas que podem explicar por que ele vende mais (título, fotos, preço, frete/Full, descrição, prova social, oferta, ficha técnica).
2. Ordene da mais importante pra menos.
3. Para cada diferença, dê uma ação específica que posso aplicar hoje.

RESTRIÇÕES:
- Não diga só “melhore as fotos” — diga o que exatamente mudar e por quê.

FORMATO DE SAÍDA:
- Lista priorizada: Diferença | Por que importa | Ação concreta
- Bloco final: a mudança nº1 pra fazer ainda hoje.`
    },
    {
      t: "As reclamações dos clientes dele viram o seu diferencial",
      why: "Leia as avaliações e perguntas dele e descubra o que o comprador não está recebendo.",
      p: `Agora você é um especialista em pesquisa de cliente que lê nas entrelinhas.

CONTEXTO — avaliações e perguntas do anúncio do concorrente:
[cole as avaliações (principalmente as de 1 a 3 estrelas) e as perguntas]

SUA TAREFA:
1. Agrupe os comentários nos 5 padrões de reclamação mais repetidos.
2. Para cada padrão, estime o quanto afeta a decisão de compra (decisivo / incômodo / menor).
3. Para cada um, escreva o diferencial exato que eu deveria destacar no meu anúncio — do jeito que o comprador fala.

RESTRIÇÕES:
- Só sugira diferenciais que eu consiga entregar de verdade — marque os que exigem mudança na operação.

FORMATO DE SAÍDA:
- Tabela: Padrão de reclamação | Frequência | Impacto | Meu diferencial
- Uma linha final: qual reclamação atacar primeiro e por quê.`
    },
    {
      t: "A escada de preços da categoria — e onde você entra",
      why: "Entrada, intermediário, premium: onde está o volume e onde está a margem.",
      p: `Agora você é um analista de pricing de marketplace.

CONTEXTO — preços que vejo hoje na busca da categoria [categoria], incluindo o do concorrente:
[cole 8 a 15 preços, de preferência com nº de vendas ao lado]

SUA TAREFA:
1. Organize os preços em 3 faixas: entrada, intermediária, premium — com o intervalo de cada.
2. Estime onde se concentra o volume de compradores vs. onde a margem é mais saudável.
3. Diga em que faixa o concorrente está e recomende a faixa e o preço pra mim, considerando minha vantagem.

RESTRIÇÕES:
- Se os dados forem fracos demais pra uma faixa, diga isso em vez de chutar.

FORMATO DE SAÍDA:
- Tabela: Faixa | Intervalo de preço | Volume | Espaço de margem
- Recomendação: faixa-alvo + preço + justificativa de 2 linhas.`
    },
    {
      t: "Ganhar dele sem entrar em guerra de preço",
      why: "3 posicionamentos que te diferenciam sem baixar 1 real — com a frase pro anúncio.",
      p: `Agora você é um estrategista de posicionamento. Use tudo que descobrimos sobre o concorrente nesta conversa.

SUA TAREFA:
1. Crie 3 posicionamentos que me diferenciam dele SEM baixar preço.
2. Para cada, escreva uma frase de destaque pronta pro título ou pra foto principal.
3. Recomende o mais forte pro meu caso e por quê.

RESTRIÇÕES:
- Nenhum posicionamento pode depender de ser “mais barato”.
- Cada um precisa se apoiar numa fraqueza real dele que apareceu nos passos anteriores.

FORMATO DE SAÍDA:
- 3 posicionamentos: Nome do ângulo | Frase de destaque | Pra quem funciona melhor
- Recomendação: o ângulo mais forte + justificativa.`
    },
    {
      t: "Plano de ataque em 5 passos",
      why: "Juntando tudo: onde entrar, onde não mexer e o primeiro movimento desta semana.",
      p: `Agora você é um estrategista competitivo. Junte tudo desta conversa num plano.

CONTEXTO EXTRA (opcional, deixa o plano muito mais preciso):
- Lista de produtos e preços do concorrente: [cole os dados]

SUA TAREFA:
1. Monte um plano de ataque em 5 passos: onde entrar por preço, onde por diferenciação e o que evitar.
2. Identifique os produtos dele mais vulneráveis ao meu ataque.
3. Defina a ordem dos movimentos para as próximas 4 semanas.

RESTRIÇÕES:
- Não recomende atacar onde ele é forte e eu sou fraco.

FORMATO DE SAÍDA:
- Plano numerado de 5 passos
- Bloco final: o primeiro movimento pra fazer essa semana.

Dica: a lista de produtos, preços e vendas de qualquer concorrente sai pronta do JoomPulse.`
    }
  ]
};
