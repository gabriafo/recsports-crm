# Proposta · Operação de CRM e Retenção (RecSports)

| Versão | PDF | HTML (abre em qualquer navegador) |
|---|---|---|
| Completa (6 páginas), para envio ao cliente | `pdf/proposta-completa.pdf` | `proposta-completa.html` |
| Resumida (2 páginas), para leitura rápida ou e-mail | `pdf/proposta-resumida.pdf` | `proposta-resumida.html` |
| Comercial (3 páginas), focada em fechamento | `pdf/proposta-comercial.pdf` | `proposta-comercial.html` |

Os HTMLs desta pasta são **autocontidos** (estilo e fontes embutidos): abrem formatados mesmo
copiados sozinhos, no celular ou no navegador.

## Editar

Edite os arquivos em `src/` (textos nos HTMLs, visual em `src/style.css`) e gere tudo de novo:

```bash
node proposta/build.cjs
```

O script recria os HTMLs autocontidos e os PDFs, e avisa se algum conteúdo estourar a página A4.
Fonte: Inter (SIL Open Font License), em `src/fonts/`, reduzida aos caracteres latinos.
