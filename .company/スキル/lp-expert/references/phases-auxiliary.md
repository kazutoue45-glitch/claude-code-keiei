# Fase 7 — Páginas Auxiliares (Detalhamento)

## Explicação para o usuário

> "Nem todo visitante converte na primeira visita. Páginas auxiliares capturam quem ainda não está pronto — oferecendo algo de valor (um e-book, um guia) em troca do contato. Também servem como destino pós-conversão (página de obrigado) para rastrear resultados no Google Ads e Meta Ads."

## Detecção automática

| Objetivo | Páginas auxiliares |
|----------|-------------------|
| Captura de lead | Thank-you page |
| Venda | Thank-you page |
| Agendamento | Thank-you page |
| Download | Página de download + Thank-you |
| Evento | Página de confirmação + Thank-you |

## Pergunta ao usuário

> "Além da LP principal, posso criar páginas auxiliares:"
>
> **Página de download** — Para entrega de material gratuito. Inclui notificações simuladas de downloads recentes para gerar urgência.
>
> **Página de obrigado** — Confirma a ação, rastreia conversão no Google Ads/Meta Ads, sugere próximo passo.
>
> - A) Página de download + Thank-you
> - B) Só thank-you
> - C) Só download
> - D) Nenhuma por enquanto

## Página de Download

### Componentes

- Capa do material (imagem fornecida ou gerada)
- Botão de download direto (PDF local)
- UTMs preservados da LP principal
- Schema JSON-LD: `WebPage` + `DigitalDocument`

### Toasts de prova social simulados

- 24+ nomes fictícios de 16+ estados brasileiros
- Shuffle randomizado (Fisher-Yates) a cada visita
- Primeira notificação: 3s após abertura
- Intervalo: 5s entre cada
- Duração: 4s com animação slide-in/slide-out

```javascript
// Exemplo de implementação
const names = [
  { name: "Maria S.", state: "SP" },
  { name: "João P.", state: "MG" },
  // ... 24+ nomes
];

// Fisher-Yates shuffle
for (let i = names.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [names[i], names[j]] = [names[j], names[i]];
}

// Exibição sequencial
let index = 0;
setTimeout(() => {
  showToast(names[index++]);
  setInterval(() => showToast(names[index++]), 5000);
}, 3000);
```

## Página Thank-you

### Componentes

- Confirmação visual (ícone de sucesso + mensagem personalizada)
- Cross-sell: link para material de download ou WhatsApp
- Tracking de conversão (invisível ao visitante):

```javascript
// dataLayer push para GTM
dataLayer.push({
  'event': 'lead_form_submit',
  'form_type': 'lp_[servico]',
  'utm_source': sessionStorage.getItem('gr_utm_source'),
  'utm_medium': sessionStorage.getItem('gr_utm_medium'),
  'utm_campaign': sessionStorage.getItem('gr_utm_campaign')
});
```

## Estrutura de pastas final

```
deploy/
├── index.html                  ← LP principal
├── download/
│   └── index.html              ← Página de download
├── obrigado/
│   └── index.html              ← Thank-you page
├── LOGO-1.svg
├── hero-image.jpg
├── ebook-capa.jpg              ← (se aplicável)
├── material.pdf                ← (se aplicável)
├── robots.txt
└── sitemap.xml                 ← atualizado com novas URLs
```
