/* Kit «Anúncio Pronto» — 7 prompts em cadeia, todos na mesma conversa.
   Fonte: prompts 12, 21, 19, 20, 34, 36, 28 dos «50 prompts de IA». */
window.KIT = {
  slug: "anuncio-pronto",
  name: "Anúncio Pronto",
  demo: {
    label: "Prompt 03 · Título que ranqueia",
    prompt: "Você é um especialista em SEO e títulos do Mercado Livre.\n- Produto: [produto]\n- Marca: [marca]",
    me: "Você é um especialista em SEO… Produto: fone bluetooth",
    ai: ["1. Fone Bluetooth 5.3 Sem Fio Cancelamento Ruído 40h", "2. Fone de Ouvido Bluetooth Sem Fio à Prova d'Água", "⭐ Top 1: começa pela palavra mais buscada"]
  },
  steps: [
    {
      t: "Ficha do produto + as perguntas que travam a compra",
      why: "O ponto de partida: a IA conhece seu produto e pensa como o comprador desconfiado.",
      p: `Você é um pesquisador de intenção de compra especializado no Mercado Livre Brasil. Nesta conversa vamos montar, em 7 passos, um anúncio completo. Guarde esta ficha — vou usá-la em todos os passos.

FICHA DO PRODUTO:
- Produto: [produto]
- Marca: [marca]
- Faixa de preço: [R$]
- Características técnicas: [cole a ficha técnica]
- Pra quem é: [quem compra e pra quê]

SUA TAREFA AGORA:
1. Liste as 15 perguntas que o comprador mais provavelmente faz antes de comprar esse produto.
2. Classifique cada uma: trava a compra / dúvida secundária.
3. Marque quais devem ser respondidas já no anúncio.

RESTRIÇÕES:
- Pense como comprador desconfiado, não como vendedor.

FORMATO DE SAÍDA:
- Tabela: Pergunta | Tipo | Responder no anúncio? (sim/não)
- Bloco final: as 5 perguntas que, respondidas no anúncio, mais aumentariam a conversão.`
    },
    {
      t: "Transformar ficha técnica em benefício",
      why: "Comprador não compra “bateria de 5.000 mAh”. Compra “dia inteiro sem tomada”.",
      p: `Agora, usando as características técnicas da FICHA DO PRODUTO acima:

SUA TAREFA:
1. Transforme cada característica em um benefício que o comprador sente na vida real.
2. Para os 3 benefícios mais fortes, escreva uma frase pronta pro anúncio.
3. Aponte qual benefício deve ser o destaque principal — e conecte com as 5 perguntas que mais travam a compra do passo anterior.

RESTRIÇÕES:
- Cada benefício deve responder “e daí, o que eu ganho com isso?”.
- Não invente característica que não está na ficha.

FORMATO DE SAÍDA:
- Tabela: Característica | Benefício pro cliente
- Bloco final: 3 frases prontas + qual usar como destaque.`
    },
    {
      t: "Título que ranqueia na busca do Meli",
      why: "10 opções de até 60 caracteres, começando pela palavra que o comprador digita.",
      p: `Você agora é um especialista em SEO e títulos do Mercado Livre. Use a FICHA DO PRODUTO e os benefícios que já definimos.

CONTEXTO EXTRA:
- Palavra que acho que o comprador mais busca: [palavra-chave, se souber]

SUA TAREFA:
1. Gere 10 opções de título de no máximo 60 caracteres.
2. Comece cada título pela palavra de maior busca e encaixe atributos que ajudam a ranquear (marca, modelo, tamanho, cor, quantidade), sem repetir palavra à toa.
3. Marque os 3 mais fortes e diga por que ranqueiam melhor.

RESTRIÇÕES:
- Respeite o limite de 60 caracteres.
- Nada de termos proibidos ou exagerados (“melhor do mundo”, “promoção”, “frete grátis”).

FORMATO DE SAÍDA:
- Lista numerada: Título | Nº de caracteres
- Bloco final: top 3 marcados + motivo.`
    },
    {
      t: "Descrição que converte",
      why: "Abertura que prende, benefícios, objeções quebradas e FAQ — pronta pra colar.",
      p: `Você agora é um copywriter de e-commerce brasileiro especializado em Mercado Livre. Use tudo desta conversa: a ficha, os benefícios e as perguntas que travam a compra.

CONTEXTO EXTRA:
- Tom desejado: [casual / profissional]
- Garantia, prazo de envio ou brinde que eu realmente ofereço: [descreva, ou “nenhum”]

SUA TAREFA:
1. Escreva a descrição com: abertura que prende em 2 linhas, benefícios (não só características), quebra das 3 principais objeções e fechamento com chamada pra compra.
2. Use frases curtas e escaneáveis, com quebras de linha (o Meli não aceita negrito nem emoji em excesso).
3. Feche com uma seção “Perguntas frequentes” respondendo as 5 perguntas que mais travam a compra.

RESTRIÇÕES:
- Não invente garantias, prazos ou números que eu não informei.

FORMATO DE SAÍDA:
- Descrição pronta pra colar, já formatada em blocos.`
    },
    {
      t: "Comparativo honesto contra o concorrente",
      why: "Uma tabela “meu produto vs. o dele” que dá pra usar na descrição e nas fotos.",
      p: `Você agora é um redator persuasivo e honesto. Vamos comparar o produto da FICHA com o concorrente direto.

CONTEXTO:
- Concorrente: [nome ou link do anúncio dele + preço]
- Onde eu ganho: [suas vantagens]
- Onde eu perco: [suas desvantagens]

SUA TAREFA:
1. Crie uma tabela comparativa honesta que eu possa usar no anúncio e numa imagem.
2. Destaque onde eu ganho sem mentir sobre onde perco.
3. Escreva uma frase de fechamento que reposicione a desvantagem.

RESTRIÇÕES:
- Sem afirmações falsas e sem citar o nome do concorrente no anúncio — use “produtos comuns” / “outras opções”.

FORMATO DE SAÍDA:
- Tabela: Critério | Meu produto | Outras opções
- Frase de fechamento.`
    },
    {
      t: "4 variações pra teste A/B",
      why: "Mude uma coisa por vez e descubra o que realmente faz vender.",
      p: `Você agora é um especialista em testes de anúncio. O anúncio base é o título nº1 e a descrição que montamos nesta conversa.

CONTEXTO:
- O que mais quero melhorar: [conversão / cliques / ticket]

SUA TAREFA:
1. Gere 4 variações pra testar, mudando só UMA coisa por vez: (a) só o título, (b) só a abertura da descrição, (c) só a foto principal (descreva a cena), (d) só o ângulo de venda.
2. Para cada, diga exatamente o que está sendo testado e que métrica olhar.
3. Recomende a ordem de teste e quantos dias rodar cada uma.

RESTRIÇÕES:
- Cada variação isola uma única variável — senão o teste não conclui nada.

FORMATO DE SAÍDA:
- 4 variações rotuladas pela variável testada
- Bloco final: ordem de teste + duração recomendada.`
    },
    {
      t: "Bônus: consertar um anúncio que já vende pouco",
      why: "Já tem anúncio rodando? Cole ele aqui e receba a versão nova + o que mudou.",
      p: `Você é um editor de anúncios do Mercado Livre. (Pode usar este prompt sozinho, numa conversa nova.)

CONTEXTO — meu anúncio atual, vendendo pouco:
[cole o anúncio: título, descrição, preço, nº de fotos]
- Visitas e vendas nos últimos 30 dias: [visitas] / [vendas]
- O que acho que está errado: [sua suspeita, se tiver]

SUA TAREFA:
1. Diga se o problema parece ser de tráfego (pouca visita) ou de conversão (visita sem venda) e por quê.
2. Reescreva mantendo o produto, mas melhorando título, abertura, benefícios e fechamento.
3. Mantenha o que já funciona e explique o que mudou e por quê.

RESTRIÇÕES:
- Não invente atributos do produto que eu não informei.

FORMATO DE SAÍDA:
- Diagnóstico: tráfego ou conversão (2 linhas)
- Anúncio novo: pronto pra colar
- Bloco final: 3 bullets do que mudou e por quê.`
    }
  ]
};
