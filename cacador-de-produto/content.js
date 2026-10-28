/* Kit «Caçador de Produto» — 7 prompts em cadeia, todos na mesma conversa.
   Fonte: prompts 1, 4, 14, 5, 9, 10, 8 dos «50 prompts de IA». */
window.KIT = {
  slug: "cacador-de-produto",
  steps: [
    {
      t: "10 produtos com demanda subindo",
      why: "A lista inicial: o que está ganhando procura e ainda não lotou de vendedor.",
      p: `Você é um analista de mercado sênior especializado no Mercado Livre Brasil. Nesta conversa vamos, em 7 passos, escolher o próximo produto pra eu vender — antes de eu gastar dinheiro. Guarde este perfil — vou usá-lo em todos os passos.

MEU PERFIL:
- Nicho/categoria que me interessa: [nicho]
- Meu momento: [começando agora / já vendo nesse nicho]
- Quanto posso investir pra testar um produto: [R$]
- Minhas limitações: [ex.: não tenho galpão, só envio pelos Correios, compro de fornecedor nacional]

SUA TAREFA AGORA:
1. Identifique 10 produtos nessa categoria com sinais de demanda em alta.
2. Para cada um, avalie: sinal de demanda, concorrência (baixa/média/alta), perfil do comprador e faixa de preço.
3. Destaque os 3 com a melhor relação demanda em alta × concorrência baixa.

RESTRIÇÕES:
- Só produtos que um vendedor pequeno ou médio consiga comprar e enviar.
- Seja honesto sobre incertezas — marque onde o sinal for fraco.

FORMATO DE SAÍDA:
- Tabela: Produto | Sinal de demanda | Concorrência | Comprador | Faixa de preço
- Abaixo: “Top 3 pra investigar” com uma frase em cada.`
    },
    {
      t: "A brecha que ninguém no nicho está cobrindo",
      why: "Público, formato ou necessidade esquecida — onde dá pra entrar sem brigar.",
      p: `Agora você é um estrategista de nicho que encontra espaços vazios em mercados lotados.

CONTEXTO EXTRA:
- O que os maiores vendedores do nicho já oferecem: [descreva o que você vê na busca]

SUA TAREFA:
1. Identifique 7 brechas ou necessidades não atendidas (de produto, público, formato, kit, serviço).
2. Para cada brecha, dê uma ideia concreta de produto OU ângulo de anúncio.
3. Ordene as 7 por tamanho da oportunidade vs. esforço — e diga se alguma combina com o top 3 do passo anterior.

RESTRIÇÕES:
- Nada genérico como “melhor atendimento”, a não ser que ligue a uma falha específica e observável nesse nicho.

FORMATO DE SAÍDA:
- Lista ordenada (1 = melhor): Brecha | Ideia/ângulo | Por que está aberta | Esforço`
    },
    {
      t: "Teste de saturação: fugir da armadilha",
      why: "Todo mundo vendendo igual? A IA aponta os sinais e se ainda tem saída.",
      p: `Agora você é um analista de saturação de mercado. Pegue o produto mais promissor até aqui.

CONTEXTO:
- Produto: [produto escolhido]
- Por que me interessei: [vi anúncio / fornecedor ofereceu / tendência]
- O que vejo na busca: [quantos anúncios parecidos, faixa de preço, se tem Full e catálogo]

SUA TAREFA:
1. Liste os sinais de que esse produto já está saturado no Meli.
2. Monte um checklist do que verificar antes de comprar estoque.
3. Aponte ângulos de escape (kit, público diferente, variação, posicionamento).

RESTRIÇÕES:
- Se estiver claramente saturado sem ângulo de escape, diga pra eu não entrar.

FORMATO DE SAÍDA:
- Sinais de saturação: lista
- Checklist pré-compra
- Ângulos de escape (ou “nenhum viável” + motivo)`
    },
    {
      t: "Semáforo de viabilidade: entrar ou não entrar",
      why: "Demanda, concorrência, margem, sazonalidade e barreira — com veredito sem amenizar.",
      p: `Agora você é um analista de viabilidade que impede vendedores de queimar dinheiro.

CONTEXTO:
- Produto/nicho em avaliação: [produto]
- Custo aproximado por unidade + frete até mim: [R$]
- Preço que pretendo vender: [R$]

SUA TAREFA:
1. Avalie: tamanho da demanda, concorrência, preço e margem (já considerando a tarifa de venda e o frete do Mercado Livre), sazonalidade e barreira de entrada.
2. Para cada fator, dê nota verde/amarelo/vermelho e uma linha de raciocínio.
3. Liste os 3 maiores riscos específicos.

RESTRIÇÕES:
- Esteja disposto a me dizer pra NÃO entrar. Não amenize um veredito ruim.

FORMATO DE SAÍDA:
- Tabela: Fator | Nota | Raciocínio
- Riscos: 3 itens
- Veredito: ENTRAR / ENTRAR COM CUIDADO / EVITAR + a única condição que mudaria sua opinião.`
    },
    {
      t: "Produto A ou produto B: qual lançar primeiro",
      why: "Quando sobram dois finalistas, a decisão sai alinhada ao seu objetivo.",
      p: `Agora você é um consultor de portfólio. Ficaram dois finalistas.

CONTEXTO:
- Produto A: [produto A]
- Produto B: [produto B]
- Meu objetivo principal agora: [margem / volume / construir reputação]

SUA TAREFA:
1. Compare os dois em: demanda, concorrência, margem provável, facilidade de logística e risco.
2. Dê nota de 1 a 5 pra cada critério e justifique as notas extremas.
3. Escolha um vencedor alinhado ao meu objetivo.

RESTRIÇÕES:
- Se um produto vencer no geral mas perder no meu objetivo, aponte esse conflito.

FORMATO DE SAÍDA:
- Tabela: Critério | Produto A | Produto B
- Veredito: vencedor + 2 linhas ligadas ao objetivo.`
    },
    {
      t: "Complementos que aumentam o ticket",
      why: "O que o mesmo comprador leva junto — e quando vale virar kit.",
      p: `Agora você é um especialista em cross-sell e ticket médio. Use o produto vencedor.

SUA TAREFA:
1. Sugira 8 produtos complementares que o mesmo comprador compraria junto.
2. Para cada um, diga se faz mais sentido vender como kit ou separado, e por quê (pense em frete e na faixa de tarifa do Meli).
3. Aponte os 3 que dariam maior aumento de ticket com menor esforço.

RESTRIÇÕES:
- Só complementos com lógica real de uso, não só “mesma categoria”.

FORMATO DE SAÍDA:
- Tabela: Complemento | Kit ou separado | Por quê
- Bloco final: top 3 pra implementar primeiro.`
    },
    {
      t: "Calendário: quando comprar estoque pra pegar o pico",
      why: "Black Friday, Natal, Dia das Mães… com a antecedência certa pro seu prazo.",
      p: `Agora você é um analista de sazonalidade do e-commerce brasileiro. Use o produto vencedor e os complementos.

CONTEXTO:
- Quanto tempo levo pra repor estoque: [dias/semanas]
- Mês de hoje: [mês]

SUA TAREFA:
1. Mapeie os meses de pico e de queda de demanda nos próximos 12 meses.
2. Considere datas brasileiras: Black Friday, Natal, volta às aulas, Dia das Mães, Namorados, Pais, Dia das Crianças.
3. Para cada pico, diga quando comprar estoque e quando subir o anúncio, com base no meu prazo.

RESTRIÇÕES:
- Se não houver sazonalidade clara, diga isso e foque no que de fato move a demanda.

FORMATO DE SAÍDA:
- Calendário: Mês | Demanda esperada | Ação
- Bloco final: os 2 picos mais importantes e a data de começar a preparar.

Dica: a demanda real por mês de cada categoria do Meli aparece pronta no JoomPulse.`
    }
  ]
};
