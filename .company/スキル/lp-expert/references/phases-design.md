# Fase 4 — Design (Detalhamento)

## Explicação para o usuário

> "O design é o que faz o visitante confiar em você nos primeiros 3 segundos. Uma página com copy perfeita mas visual amador perde credibilidade instantaneamente. O design não precisa ser complexo — precisa ser profissional, rápido e coerente com a sua marca."

## Passo 1 — Inventário visual

A skill verifica o que o usuário já tem:

| Asset | Status | Ação |
|-------|--------|------|
| Logo SVG/PNG | ✅ Tem | Usar como está |
| Logo SVG/PNG | ❌ Não tem | Oferecer: delegar para `/design` gerar |
| Brand guide / cores | ✅ Tem | Extrair tokens (primária, secundária, superfície) |
| Brand guide / cores | ❌ Não tem | Delegar para `/brand-identity` criar paleta baseada no nicho |
| Imagem hero | ✅ Tem | Validar tamanho/qualidade |
| Imagem hero | ❌ Não tem | Sugerir: banco gratuito (Unsplash/Pexels) ou gerar com IA |
| Protótipo Stitch | ✅ Tem | Usar como base do HTML |
| Protótipo Stitch | ❌ Não tem | → Passo 2 |

## Passo 2 — Stitch (opcional)

> "Antes de construir o HTML, podemos criar um protótipo visual no Google Stitch. O Stitch gera um design completo com base na sua copy e referências — isso garante que o layout, espaçamentos e hierarquia visual fiquem profissionais antes de codar."
>
> "Isso adiciona uma etapa, mas o resultado final fica mais polido. Deseja criar o protótipo no Stitch?"
> - A) Sim, quero usar o Stitch
> - B) Não, pode ir direto para o HTML

Se **A** → delega para `/stitch` com:
- Copy completa da Fase 3
- Logo e cores (se disponíveis)
- Referências visuais do usuário (prints, URLs)
- Nicho e objetivo para tom visual adequado
- Recebe de volta: `code.html` + `screen.png` + `DESIGN.md`

Se **B** → skill usa o sistema interno de design tokens

## Passo 3 — Design Tokens

Independente do caminho, a skill monta os tokens de cor baseados na marca:

```javascript
// Gerado automaticamente a partir da cor primária da marca
tailwind.config = {
  theme: {
    extend: {
      colors: {
        "primary": "#002e76",
        "secondary": "#2b59b9",
        "surface": "#fbf8ff",
        "on-primary": "#ffffff",
        "tertiary-fixed": "#ffdf9e",  // cor do CTA (ouro/destaque)
      }
    }
  }
}
```

Se o usuário forneceu cor da marca → gera paleta MD3 a partir dela.
Se não → `/brand-identity` sugere paleta baseada no nicho:

| Nicho | Primária | CTA | Sensação |
|-------|----------|-----|----------|
| Jurídico | Azul marinho | Dourado | Confiança, autoridade |
| Saúde | Verde/Teal | Azul claro | Cuidado, calma |
| SaaS | Roxo/Índigo | Verde | Inovação, crescimento |
| Educação | Azul royal | Laranja | Conhecimento, energia |
| Imobiliário | Verde escuro | Dourado | Estabilidade, valor |
| Estética | Rosa/Nude | Dourado | Elegância, exclusividade |

## Passo 4 — Fontes

Combinação padrão por nicho (Google Fonts):

| Nicho | Headline | Body |
|-------|----------|------|
| Jurídico | Plus Jakarta Sans (800) | Inter (400/500) |
| Saúde | DM Sans (700) | Inter (400/500) |
| SaaS | Space Grotesk (700) | Inter (400/500) |
| Educação | Nunito (800) | Source Sans 3 (400) |
| Estética | Playfair Display (700) | Lato (400) |
| Genérico | Plus Jakarta Sans (700) | Inter (400/500) |

> *"Selecionei essas fontes para o seu nicho. Quer manter ou prefere outra combinação?"*
