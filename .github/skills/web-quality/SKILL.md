---
name: web-quality
description: Evidence-led web quality work covering audits, performance, Core Web Vitals (LCP, INP, CLS), accessibility (WCAG 2.2), and best practices for security, compatibility and code quality. Use when asked to "audit my site", "review web quality", "run lighthouse audit", "speed up my site", "optimize performance", "fix slow loading", "improve Core Web Vitals", "fix LCP", "reduce CLS", "optimize INP", "improve accessibility", "a11y audit", "WCAG compliance", "keyboard navigation", "apply best practices", "security audit", "modernize code", or "check for vulnerabilities".
---

# Web quality

Guia unificado de qualidade web: auditoria, performance, Core Web Vitals, acessibilidade e boas práticas. Combina evidência de navegador real com inspeção de código-fonte, sem tratar uma pontuação agregada como prova de qualidade.

> **Lighthouse 13+.** A categoria Performance agora usa **Performance Insights** compartilhados entre Lighthouse e o painel Performance do DevTools ([anúncio](https://developer.chrome.com/blog/moving-lighthouse-to-insights)). Siga os nomes e evidências atuais. Não exija IDs de auditoria removidos nem recrie automaticamente suas recomendações; alguns foram retirados por serem ruidosos, pouco acionáveis ou fáceis de recomendar em excesso.

## Como funciona

1.  Estabeleça o alvo da auditoria: URLs representativas, estados e jornadas importantes, acesso público versus autenticado, e escopo mobile/desktop.
2.  Se a página puder rodar, leia [o fluxo de medição](#medição) e colete uma linha de base mínima ao vivo antes de varrer o código amplamente.
3.  Use falhas de runtime para localizar a inspeção de código. Mantenha achados medidos separados de hipóteses encontradas apenas no código.
4.  Categorize por impacto no usuário e confiança, depois faça ou recomende correções específicas.
5.  Rode de novo as verificações automatizadas equivalentes e os fluxos manuais afetados. Relate o que foi verificado e o que ainda precisa de validação de campo ou humana.

## Roteamento de ferramentas

Use a melhor capacidade já disponível; não bloqueie a auditoria por setup opcional.

| Necessidade | Rota preferida | Alternativa |
| :--- | :--- | :--- |
| Performance e Core Web Vitals | Gravar um trace de performance no navegador e analisar insights focados; com Chrome DevTools MCP, use `performance_start_trace` e depois `performance_analyze_insight` | Lighthouse CLI ou dados de laboratório do PageSpeed Insights |
| Performance de usuários reais | Valores CrUX incluídos nos resumos de trace atuais do DevTools | PageSpeed Insights/CrUX Vis; API CrUX direta só quando já houver chave ou automação pedida |
| Acessibilidade, SEO, Boas Práticas, Agentic Browsing | Rodar uma auditoria Lighthouse ao vivo; com Chrome DevTools MCP, use `lighthouse_audit` | Auditorias Lighthouse CLI por categoria mais checagens manuais |
| Semântica renderizada e interação | Inspecionar a árvore de acessibilidade e exercitar a UI; com Chrome DevTools MCP, use `take_snapshot` e `evaluate_script` focado | Teste no navegador/manual |
| Smoke test de código | `scripts/analyze.sh <path>` | Inspeção direta do código |

O `lighthouse_audit` do Chrome DevTools MCP exclui performance de propósito. Seu modo de navegação recarrega a página; use o modo snapshot quando preservar o estado autenticado ou criado pelo usuário importar. O analisador estático é um smoke test rápido, não substitui uma auditoria de página renderizada.

## Categorias de auditoria

### Performance

**Core Web Vitals** — precisam passar para uma boa experiência de página:

  - **LCP (Largest Contentful Paint) < 2.5s.** O maior elemento visível precisa renderizar rápido. Otimize imagens, fontes e tempo de resposta do servidor.
  - **INP (Interaction to Next Paint) < 200ms.** As interações precisam parecer instantâneas. Reduza tempo de execução de JavaScript e quebre tarefas longas.
  - **CLS (Cumulative Layout Shift) < 0.1.** O conteúdo não pode pular. Defina dimensões explícitas em imagens, embeds e anúncios.

**Otimização de recursos:**

  - **Comprima imagens.** Use WebP/AVIF com fallback. Sirva imagens no tamanho correto via `srcset`.
  - **Minimize JavaScript.** Remova código não usado. Faça code splitting. Deferir scripts não críticos.
  - **Otimize CSS.** Extraia CSS crítico. Remova estilos não usados. Evite `@import`.
  - **Fontes eficientes.** Use `font-display: swap`. Pré-carregue fontes críticas. Faça subset dos caracteres necessários.

**Estratégia de carregamento:**

  - **Preconnect para origens.** Adicione `<link rel="preconnect">` para domínios de terceiros.
  - **Preload de ativos críticos.** Imagens de LCP, fontes e CSS acima da dobra.
  - **Lazy load do que está abaixo da dobra.** Imagens, iframes e componentes pesados.
  - **Cache eficaz.** TTLs longos para ativos estáticos. Cache imutável para arquivos com hash.

### Acessibilidade

**Perceivable:**

  - **Alternativas em texto.** Todo `<img>` tem `alt` significativo. Imagens decorativas usam `alt=""`.
  - **Contraste de cor.** Mínimo 4.5:1 para texto normal, 3:1 para texto grande (WCAG AA).
  - **Não dependa só de cor.** Use ícones, padrões ou texto junto de indicadores de cor.
  - **Legendas e transcrições.** Vídeo tem legendas. Áudio tem transcrição.

**Operable:**

  - **Acessível por teclado.** Toda funcionalidade disponível por teclado. Sem armadilhas de teclado.
  - **Foco visível.** Indicadores de foco claros em todos os elementos interativos.
  - **Skip links.** Ofereça "Pular para o conteúdo principal" para usuários de teclado.
  - **Tempo suficiente.** Usuários podem estender limites de tempo. Sem conteúdo que avança sozinho sem controles.

**Understandable:**

  - **Idioma da página.** Defina o atributo `lang` no `<html>`.
  - **Navegação consistente.** Mesma estrutura de navegação entre páginas.
  - **Identificação de erro.** Erros de formulário descritos claramente e associados aos campos.
  - **Rótulos e instruções.** Todo input tem label associado.

**Robust:**

  - **HTML válido.** Sem IDs duplicados. Elementos bem aninhados.
  - **ARIA usada corretamente.** Prefira elementos nativos. Papéis ARIA batem com o comportamento.
  - **Nome, papel, valor.** Elementos interativos têm nomes acessíveis e papéis corretos.

### SEO

**Rastreabilidade:**

  - **robots.txt válido.** Não bloqueia recursos importantes.
  - **Sitemap XML.** Lista todas as páginas importantes. Enviado ao Search Console.
  - **URLs canônicas.** Evitam conteúdo duplicado.
  - **Sem noindex em páginas importantes.** Confira meta robots e headers.

**On-page:**

  - **Title tags únicas.** Torne cada título descritivo e conciso; o truncamento varia por dispositivo e tipo de resultado.
  - **Meta descriptions.** Escreva resumos úteis e específicos; buscadores podem escolher outro trecho.
  - **Hierarquia de headings.** O heading principal é descritivo e a estrutura é lógica; não reprove HTML válido só por usar mais de um `<h1>`.
  - **Texto de link descritivo.** Não "clique aqui" ou "leia mais".

**Técnico:**

  - **Mobile-friendly.** Design responsivo. Alvos de toque ≥ 48px.
  - **HTTPS.** Conexão segura obrigatória.
  - **Sinais de experiência de página.** Use Core Web Vitals de campo como evidência, sem prometer mudança de ranking.
  - **Dados estruturados.** JSON-LD para rich snippets (Article, Product, FAQ etc.).

### Boas práticas

**Segurança:**

  - **HTTPS em tudo.** Sem conteúdo misto. HSTS habilitado.
  - **Sem bibliotecas vulneráveis.** Mantenha dependências atualizadas.
  - **Headers CSP.** Content Security Policy para prevenir XSS.
  - **Sem source maps expostos.** Em builds de produção.

**Padrões modernos:**

  - **Sem APIs depreciadas.** Substitua `document.write`, XHR síncrono etc.
  - **Doctype válido.** Use `<!DOCTYPE html>`.
  - **Charset declarado.** `<meta charset="UTF-8">` como primeiro elemento do `<head>`.
  - **Sem erros de navegador.** Console limpo. Sem problemas de CORS.

**Padrões de UX:**

  - **Sem interstitials intrusivos.** Especialmente no mobile.
  - **Pedidos de permissão claros.** Só peça quando necessário, com contexto.
  - **Sem botões enganosos.** Botões fazem o que dizem.

### Agentic browsing

Use os resultados de Agentic Browsing do Lighthouse como sinais técnicos de quão bem assistentes conseguem entender e interagir com a página renderizada.

  - **Superfície de interação acessível.** HTML semântico, labels, nomes, papéis e estados precisam expor controles significativos na árvore de acessibilidade.
  - **Integrações WebMCP são válidas quando presentes.** Revise ferramentas registradas, schemas e cobertura de formulários; não adicione WebMCP só para subir uma pontuação.
  - **`llms.txt` é opcional.** Um arquivo válido pode ajudar ferramentas compatíveis a descobrir conteúdo curado, mas passar no Lighthouse não prova que buscadores ou produtos de IA vão ingerir, ranquear ou citar.
  - **Mantenha esta categoria separada de alegações de SEO.** Navegabilidade agêntica não é evidência de ranking ou visibilidade em IA.

## Níveis de severidade

| Nível | Descrição | Ação |
| :--- | :--- | :--- |
| **Crítico** | Vulnerabilidades de segurança, falhas completas | Corrija imediatamente |
| **Alto** | Falhas de Core Web Vitals, barreiras de a11y graves | Corrija antes do lançamento |
| **Médio** | Oportunidades de performance, melhorias de SEO | Corrija na sprint |
| **Baixo** | Otimizações menores, qualidade de código | Corrija quando conveniente |

## Formato de saída da auditoria

Ao realizar uma auditoria, estruture os achados assim:

```markdown
## Resultados da auditoria

### Evidência
| Sinal | Escopo/condições | Resultado | Fonte |
|--------|------------------|--------|--------|
| LCP | URL, celular, p75/28 dias | 3.1s (precisa melhorar) | CrUX |
| Acessibilidade | URL, navegação mobile | 92 | Lighthouse |

### Problemas críticos (X encontrados)
- **[Categoria]** Descrição do problema. Arquivo: `caminho/do/arquivo.js:123`
  - **Impacto:** Por que importa
  - **Evidência:** Falha medida, observação em runtime ou hipótese de código
  - **Correção:** Mudança de código ou recomendação específica

### Alta prioridade (X encontrados)
...

### Resumo
- Performance: status medido e X achados
- Acessibilidade: status automatizado, X achados, checagens manuais pendentes/passadas
- SEO: X achados
- Boas práticas: X achados
- Agentic Browsing: X achados ou indisponível

### Prioridade recomendada
1. Corrija isto primeiro porque...
2. Depois trate...
3. Por fim otimize...

### Verificação
- Rode de novo os resultados nas mesmas condições
- Checagens manuais concluídas
- Validação de campo ainda pendente
