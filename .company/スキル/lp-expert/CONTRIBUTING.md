# Contribuindo para /lp-expert

Obrigado pelo interesse em contribuir! Este guia explica como participar do projeto.

## Pré-requisitos

- [Claude Code](https://claude.com/claude-code) instalado
- Git configurado
- Familiaridade com a estrutura de skills do Claude Code

## Estrutura do projeto

```
lp-expert/
├── SKILL.md              ← Skill principal (max 500 linhas)
├── references/           ← Documentação detalhada por fase
├── templates/            ← Templates de entrega
└── examples/             ← Cases de uso
```

## Regras

### SKILL.md

- Manter abaixo de 500 linhas
- Documentação detalhada vai em `references/`
- Usar `${CLAUDE_SKILL_DIR}` para referenciar arquivos internos
- Frontmatter YAML deve seguir o padrão Claude Code

### References

- Um arquivo por fase (ou grupo de fases relacionadas)
- Nomenclatura: `phases-{nome}.md`
- Tabelas para dados estruturados (nichos, schemas, fontes)
- Exemplos de código em blocos de código com linguagem marcada

### Templates

- Usar placeholders com `{{VARIAVEL}}` em CAPS_SNAKE_CASE
- Incluir exemplos de preenchimento em comentários
- Manter genérico o suficiente para qualquer nicho

### Examples

- Uma pasta por case
- `README.md` obrigatório com: nicho, objetivo, resultado, aprendizados
- Nunca incluir dados reais de clientes (anonimizar)

## Como adicionar um novo nicho

1. Edite `references/phases-design.md`:
   - Adicione cores sugeridas na tabela de paletas
   - Adicione par de fontes na tabela de tipografia

2. Edite `references/phases-seo.md`:
   - Adicione fontes citáveis na tabela de GEO
   - Adicione schemas na tabela por nicho

3. Edite `SKILL.md`:
   - Adicione o nicho na Pergunta 3 da Fase 0

4. Atualize `README.md`:
   - Adicione na tabela de nichos suportados

5. Teste:
   - Execute `/lp-expert` com o novo nicho
   - Verifique que schemas, cores e fontes são aplicados corretamente

## Como adicionar um novo objetivo de LP

1. Edite `SKILL.md` → Fase 0, Pergunta 2
2. Edite `references/phases-seo.md` → tabela de schemas por objetivo
3. Edite `references/phases-auxiliary.md` → tabela de detecção automática
4. Teste o fluxo completo

## Commits

Formato: `tipo: descrição curta`

Tipos:
- `add:` — nova funcionalidade
- `fix:` — correção de bug
- `docs:` — documentação
- `refactor:` — refatoração sem mudança de comportamento

Exemplos:
```
add: suporte para nicho financeiro
fix: schema SaaS usando tipo errado
docs: exemplo de case odontológico
refactor: simplificar tabela de fontes por nicho
```

## Testes

Antes de abrir um PR, verifique:

- [ ] `/lp-expert` inicia sem erro
- [ ] As 5 perguntas da Fase 0 aparecem corretamente
- [ ] Skills referenciadas existem nas descrições
- [ ] Links para `references/` estão corretos no SKILL.md
- [ ] Templates usam placeholders válidos
- [ ] README reflete as alterações feitas

## Dúvidas

Abra uma issue descrevendo sua dúvida ou sugestão.
