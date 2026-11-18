# Proposta · Operação de CRM e Retenção (RecSports)

| Arquivo | Uso |
|---|---|
| `pdf/proposta-completa.pdf` | Versão principal (6 páginas) para envio ao cliente |
| `pdf/proposta-resumida.pdf` | Versão curta (2 páginas) para leitura rápida ou e-mail |
| `pdf/proposta-comercial.pdf` | Versão comercial mais forte (3 páginas), focada em fechamento |

Os PDFs são gerados a partir dos HTMLs desta pasta (`style.css` compartilhado, fonte Inter em `fonts/`, licença SIL OFL).

Para regenerar depois de editar um HTML:

```bash
node proposta/render.cjs
```

O script avisa se algum conteúdo estourar o limite da página A4.
