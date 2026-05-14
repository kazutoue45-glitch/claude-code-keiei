# Fase 9 — Deploy (Detalhamento)

## Explicação para o usuário

> "A página está pronta e testada. Agora vamos colocá-la no ar — no seu domínio, acessível para o mundo. Posso subir os arquivos automaticamente para sua hospedagem ou gerar um pacote pronto para você subir manualmente. Nos dois casos, valido que tudo está funcionando em produção antes de encerrar."

## Fluxo baseado na hospedagem (definida na Fase 0)

```
Hospedagem conhecida?
│
├── Sim (Hostinger/HostGator/cPanel/Vercel/WordPress)
│   └── "Deseja que eu suba os arquivos para você?"
│       ├── Sim → Coleta credenciais → SFTP upload → Validação
│       └── Não → Gera ZIP + guia específico
│
└── "Ainda não sei"
    └── Gera ZIP + guia genérico + recomendações de hospedagem
```

---

## Caminho A — Upload automático (SFTP)

### Passo 1 — Guia para encontrar credenciais

> "Para subir automaticamente, preciso de 4 informações do seu painel de hospedagem:"

| Hospedagem | Onde encontrar |
|-----------|---------------|
| Hostinger | Painel hPanel → seção "Arquivos" → Contas FTP. Ou no email de boas-vindas |
| HostGator | cPanel → buscar "Contas FTP". Credenciais padrão = login do cPanel |
| cPanel genérico | cPanel → seção "Arquivos" → Contas FTP |

Referências:
- Hostinger: https://www.hostinger.com/support/4480555-how-to-find-ftp-details-on-cpanel-at-hostinger/
- HostGator (criar): https://suporte.hostgator.com.br/hc/pt-br/articles/30808120096403-Como-criar-uma-conta-FTP-no-cPanel
- HostGator (gerenciar): https://suporte.hostgator.com.br/hc/pt-br/articles/30818074766611-Como-gerenciar-contas-FTP-no-cPanel

> "Preciso de:"
> 1. **Host/Servidor** — ex: ftp.seudominio.com.br
> 2. **Usuário** — ex: usuario@seudominio.com.br
> 3. **Senha** — a mesma do cPanel ou a que você definiu
> 4. **Pasta destino** — ex: /public_html/consorcio/

### Passo 2 — Segurança

- Salva em `.env` temporário (gitignored, chmod 600)
- Prioriza SFTP (porta 22, criptografado) sobre FTP (porta 21)
- Se SFTP falhar, avisa e pergunta se quer tentar FTP com alerta de segurança

### Passo 3 — Upload

```bash
lftp -u $USER,$PASS sftp://$HOST -e "
  mirror -R deploy/ $REMOTE_PATH
  bye
"
```

### Passo 4 — Validação pós-upload

- Playwright acessa a URL de produção
- Verifica: página carrega, imagens aparecem, links funcionam
- Testa og:image compartilhando a URL (preview card)

### Passo 5 — Limpeza

> "Deploy concluído com sucesso! Recomendo apagar o arquivo de credenciais (.env). Posso apagar agora?"

---

## Caminho B — ZIP + Guia Manual

Gera `projeto-deploy.zip` e guia passo a passo personalizado por hospedagem:

### Para cPanel (Hostinger/HostGator)

> 1. Acesse o cPanel da sua hospedagem
> 2. Abra o "Gerenciador de Arquivos"
> 3. Navegue até `public_html/`
> 4. Crie a pasta `[nome-do-projeto]/`
> 5. Faça upload do ZIP para dentro dessa pasta
> 6. Clique com botão direito no ZIP → "Extrair"
> 7. Delete o ZIP após extração
> 8. Acesse: `https://seudominio.com/[nome-do-projeto]/`

### Para WordPress (subpasta)

> Mesmos passos acima. A LP fica independente do WordPress — herda a autoridade SEO do domínio sem interferir no site.
> Adicione a URL ao sitemap do WordPress (RankMath/Yoast → URLs extras).

### Para Vercel/Netlify

> 1. Crie um novo projeto
> 2. Arraste a pasta `deploy/` para o painel
> 3. Configure o domínio customizado (se tiver)

---

## Validação em produção (ambos os caminhos)

> "A página está no ar? Me passe a URL que eu valido."

Playwright acessa e verifica:
- Página carrega sem erros + SSL/HTTPS funcionando
- Imagens e logo aparecem
- Links internos e externos funcionam
- og:image renderiza no preview (WhatsApp/LinkedIn)
- Form dispara webhook com sucesso
- UTMs preservados na navegação entre páginas
