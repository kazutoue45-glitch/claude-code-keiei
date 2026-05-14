# Fase 5 — Build (Detalhamento)

## Explicação para o usuário

> "Agora tudo se junta — copy, design, SEO e funcionalidades — em um único arquivo HTML pronto para funcionar. Um arquivo só, sem dependências de servidor, sem banco de dados, sem instalação. Abre em qualquer navegador, roda em qualquer hospedagem."

## Estrutura do Arquivo

```html
<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <!-- Meta (title, description, robots, canonical) -->
  <!-- Open Graph + Twitter Card -->
  <!-- Favicon -->
  <!-- GTM head snippet (se fornecido) -->
  <!-- Google Fonts (headline + body) -->
  <!-- Material Symbols Outlined -->
  <!-- Tailwind CDN + config com tokens MD3 -->
  <!-- CSS inline (animações, shimmer, glass, etc.) -->
  <!-- JSON-LD schemas -->
</head>
<body>
  <!-- GTM noscript -->
  <!-- Scroll Progress Bar -->
  <!-- Navbar fixa + menu mobile -->
  <!-- Seções da LP (na ordem da copy) -->
  <!-- Exit-intent Popup -->
  <!-- JS inline (accordion, menu, reveal, UTM, webhook, form) -->
</body>
</html>
```

## Engine de Montagem — Seção por Seção

### 1. Navbar
- Links âncora apontando para seções internas
- CTA do navbar = mesmo destino do CTA principal
- Mobile: hamburger → menu dropdown
- Fixa no topo, blur background
- Scroll progress bar acima

### 2. Hero
- Desktop: grid 2 colunas (texto + imagem). Mobile: stacked
- Dual image approach: `md:hidden` (mobile) + `hidden md:block` (desktop)
- Animações de entrada escalonadas (hero-animate + delays)
- CTA com efeito shimmer (gold)

### 3. Trust Bar
- Grid 2 cols (mobile) → 4 cols (desktop)
- Ícones Material Symbols
- Números do briefing

### 4. Problema
- 3 cards com hover elevação
- Hierarquia invertida: label `<p>` pequeno → frase impactante `<h2>` grande

### 5. Prova
- Grid 2x2 com ícones filled
- Cada card cita fonte (lei, artigo, dado estatístico)

### 6. Como Funciona
- Layout vertical centralizado com linha conectora lateral
- Background primário + diagonal divider (clip-path)
- 4 etapas numeradas + CTA ao final

### 7. Por que Nós + Depoimentos
- Grid lg:3 colunas (1 diferenciais + 2 depoimentos)
- 3 diferenciais com ícone + texto
- 4 depoimentos com 5 estrelas, itálico, nome + cidade/estado

### 8. FAQ
- Accordion vanilla JS com `aria-expanded`
- Mínimo 10 perguntas (vindas da Fase 2 + Fase 3)
- Respostas autocontidas e citáveis por IA

### 9. Checklist (se aplicável ao nicho)
- Auto-check animation com IntersectionObserver
- Stagger delay entre cada item
- CTA ao final

### 10. CTA Final
- Headline de urgência + parágrafo de reforço
- Botão shimmer primário ou gold
- Selos de confiança abaixo (seguro, resposta em Xh)

### 11. Formulário
- Campos definidos na Fase 1
- Submit dispara webhook POST com JSON (campos + UTMs + gclid/fbclid)
- Validação HTML5 nativa

### 12. Footer
- Logo branco + especialidade + localização
- CNPJ + registro profissional
- Copyright + disclaimer legal

## Funcionalidades JS Inline

| Funcionalidade | Implementação |
|---------------|---------------|
| FAQ accordion | Vanilla JS, `aria-expanded` |
| Menu mobile | Toggle class, fecha ao clicar link |
| Scroll reveal | IntersectionObserver + classes `.reveal` / `.visible` |
| Scroll progress bar | `scroll` event → width % |
| UTM capture | Lê URL params → `sessionStorage` → injeta em links/form |
| Webhook POST | `fetch()` no submit do form, JSON body com campos + UTMs |
| Exit-intent popup | `mouseout` (desktop) + `visibilitychange` após 30s (mobile) |
| Shimmer animation | CSS `@keyframes` no CTA |
