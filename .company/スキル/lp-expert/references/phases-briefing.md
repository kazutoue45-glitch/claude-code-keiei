# Fase 1 — Briefing (Detalhamento)

## Caminho A — Documento pronto

1. Skill busca arquivos `.md`, `.txt`, `.docx` na pasta do projeto
2. Lê e analisa o conteúdo
3. Extrai: nome da empresa, serviço, público, diferenciais, depoimentos, FAQ
4. Apresenta resumo:
   > "Encontrei essas informações no seu documento. Está tudo correto?"
5. Se houver lacunas (ex: sem depoimentos, sem números de credibilidade), pergunta só o que falta

## Caminho B — Questionário interativo

Perguntas via `AskUserQuestion`, uma por vez:

### 1. Nome da empresa e serviço principal
> "Qual o nome da empresa e o serviço que esta página vai promover?"

### 2. Público-alvo
> "Quem é seu cliente ideal? Descreva em uma frase."
> *Por que importa: isso define a linguagem, as dores que vamos abordar e o tom dos textos.*

### 3. Dor principal
> "Qual o maior problema que seu cliente enfrenta antes de te contratar?"

### 4. Diferencial
> "O que te diferencia dos concorrentes? (experiência, método, números, certificações)"

### 5. Números de credibilidade
> "Tem números para usar como prova? Ex: anos de mercado, clientes atendidos, casos resolvidos, nota no Google"
> *Por que importa: números concretos aumentam confiança. Vamos usá-los na barra de credibilidade da página.*

### 6. Depoimentos
> "Tem depoimentos de clientes? Se sim, cole aqui (nome, cidade e texto). Se não, posso criar modelos baseados no seu público."

### 7. Concorrentes
> "Tem URLs de 2-3 concorrentes que gostaria de superar? Vou analisar a estrutura e copy deles para criar algo superior."
> Se sim → Playwright MCP acessa e extrai padrões

### 8. Assets visuais
> "Quais materiais visuais você tem?"
> - A) Logo em SVG ou PNG
> - B) Imagens do serviço/produto
> - C) Fotos da equipe
> - D) Nenhum (vou precisar de ajuda)

### 9. Tracking e integrações
> "Tem algum desses? (pode ser mais de um)"
> - A) Google Tag Manager (ID: GTM-XXXXXX)
> - B) Pixel do Facebook/Meta
> - C) Link de WhatsApp
> - D) Chatbot/Typebot
> - E) Webhook para receber dados do formulário
> - F) Nenhum por enquanto

### 10. Formulário
> "Quais informações quer captar no formulário?"
> - A) Nome + Telefone (mínimo)
> - B) Nome + Email + Telefone
> - C) Nome + Email + Telefone + Mensagem
> - D) Personalizado (me diga os campos)
> *Por que importa: quanto menos campos, mais conversões. Mas depende do que sua equipe precisa para dar seguimento.*

## Checkpoint

> "Briefing completo. Aqui está o resumo. Tudo certo para seguir?"
