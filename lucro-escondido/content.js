/* Kit «Lucro Escondido» — 6 prompts em cadeia sobre a planilha de vendas.
   Fonte: prompts 46, 38, 48, 42, 43, 44 dos «50 prompts de IA». */
window.KIT = {
  slug: "lucro-escondido",
  name: "Lucro Escondido",
  demo: {
    label: "Prompt 02 · Margem real",
    prompt: "Você é um analista financeiro de e-commerce.\nMinha planilha:\n[cole a exportação do Meli]",
    me: "Você é um analista financeiro… (planilha colada)",
    ai: ["Garrafa térmica 1L · −R$ 2,10 por venda · prejuízo", "Kit organizador 3un · +R$ 18,40 · saudável", "⚠️ 3 produtos pra revisar o preço já"]
  },
  steps: [
    {
      t: "Check-up da operação em 5 pontos",
      why: "Cole seus números e veja o que está saudável, o que é risco e o gargalo invisível.",
      p: `Você é um consultor de operação de e-commerce especializado no Mercado Livre Brasil. Nesta conversa vamos, em 6 passos, achar onde estou perdendo dinheiro. Guarde estes dados — vou usá-los em todos os passos.

MINHA PLANILHA (exporte do Mercado Livre em Vendas → Exportar, ou monte à mão):
[cole: produto | preço de venda | custo | tarifa de venda | frete | vendas no mês | estoque atual | há quanto tempo no catálogo]

RESUMO:
- Faturamento do último mês: [R$]
- Prazo pra repor estoque: [dias/semanas]

SUA TAREFA AGORA:
1. Faça um diagnóstico em 5 pontos do que está saudável e do que é risco.
2. Aponte o maior gargalo invisível da operação.
3. Defina a ação nº1 pra essa semana.

RESTRIÇÕES:
- Seja direto. Se algum número indicar problema sério, diga sem rodeio.
- Se faltar coluna na planilha, diga qual e siga com o que tem.

FORMATO DE SAÍDA:
- Diagnóstico: 5 pontos (saudável / risco)
- Gargalo invisível: 1 bloco
- Ação da semana: 1 recomendação.`
    },
    {
      t: "Margem real de cada produto",
      why: "Ranking do mais ao menos lucrativo — e os que vendem bem mas não deixam nada.",
      p: `Agora você é um analista financeiro de e-commerce. Use a planilha acima.

SUA TAREFA:
1. Calcule a margem de cada produto, em R$ e em %, já descontando custo, tarifa de venda e frete.
2. Ordene do mais lucrativo ao menos.
3. Sinalize os produtos com prejuízo disfarçado (vendem, mas não sobra nada).

RESTRIÇÕES:
- Mostre a conta usada. Se faltar um dado, marque “incompleto” em vez de chutar.

FORMATO DE SAÍDA:
- Tabela: Produto | Margem R$ | Margem % | Status (saudável / atenção / prejuízo)
- Bloco final: os 3 produtos pra revisar preço com urgência.`
    },
    {
      t: "Onde a tarifa e o frete comem seu lucro",
      why: "5 ajustes de preço, peso, embalagem, tipo de anúncio e kit — com o ganho de cada.",
      p: `Agora você é um auditor de custos do Mercado Livre. Use a planilha e as margens que calculamos.

SUA TAREFA:
1. Aponte onde a tarifa de venda e o frete estão comendo a margem (atenção às faixas de preço onde muda o frete e a tarifa fixa por unidade nos produtos baratos).
2. Sugira 5 ajustes pra recuperar lucro: preço, peso/embalagem, Clássico vs. Premium, kit, frete.
3. Estime o ganho de margem de cada ajuste.

RESTRIÇÕES:
- Considere as regras atuais do Mercado Livre. Se não tiver certeza de uma regra, diga pra eu conferir no meu painel.

FORMATO DE SAÍDA:
- Pontos de perda: lista
- 5 ajustes: Ajuste | Ganho estimado | Esforço
- Bloco final: o ajuste de maior impacto.`
    },
    {
      t: "Produtos zumbis: o dinheiro parado no estoque",
      why: "Quanto capital está preso em produto que não gira — e o que fazer com cada um.",
      p: `Agora você é um analista de estoque e capital de giro. Use a planilha (vendas, estoque e tempo no catálogo).

SUA TAREFA:
1. Identifique os “produtos zumbis” — parados, ocupando capital sem girar.
2. Para cada um, recomende: liquidar, melhorar o anúncio, fazer kit com um campeão ou descontinuar.
3. Estime quanto capital está preso nesses produtos no total.

RESTRIÇÕES:
- Diferencie produto realmente morto de produto sazonal que vai voltar (ex.: pico de Black Friday e Natal).

FORMATO DE SAÍDA:
- Tabela: Produto | Vendas | Tempo parado | Capital preso | Recomendação
- Bloco final: o produto pra resolver primeiro.`
    },
    {
      t: "O preço certo pra cada produto",
      why: "Onde baixar, onde segurar e onde dá pra subir preço sem perder venda.",
      p: `Agora você é um especialista em precificação. Use as margens que calculamos.

CONTEXTO EXTRA:
- Preços dos concorrentes pros meus principais produtos: [cole produto | preço dele]

SUA TAREFA:
1. Pra cada produto, sugira um preço que equilibre margem e competitividade.
2. Justifique cada sugestão em 1 linha.
3. Sinalize onde estou deixando dinheiro na mesa (poderia cobrar mais).

RESTRIÇÕES:
- Considere o concorrente, mas não recomende guerra de preço sem necessidade.
- Lembre que mudar de faixa de preço pode mudar frete e tarifa.

FORMATO DE SAÍDA:
- Tabela: Produto | Preço atual | Preço sugerido | Por quê
- Bloco final: os produtos onde dá pra subir preço sem perder venda.`
    },
    {
      t: "Plano de reposição antes da ruptura",
      why: "O que comprar com urgência, o que esperar e o que não repor — com data estimada.",
      p: `Agora você é um analista de reposição. Use a planilha (vendas e estoque) e meu prazo de reposição.

SUA TAREFA:
1. Classifique cada produto em: comprar com urgência, pode esperar ou não repor.
2. Para os urgentes, estime quando o estoque acaba no ritmo atual.
3. Aponte risco de ruptura nos campeões — e ajuste o ritmo se a Black Friday ou o Natal estiverem perto.

RESTRIÇÕES:
- Use meu prazo de reposição pra definir o que é urgente.
- Não mande repor produto que marcamos como zumbi.

FORMATO DE SAÍDA:
- 3 listas: Urgente (com data de ruptura) | Pode esperar | Não repor
- Bloco final: alerta de ruptura nos campeões.

Dica: no JoomPulse esses números (vendas, giro, margem e preço dos concorrentes) já aparecem prontos, sem planilha.`
    }
  ]
};
