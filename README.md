# Registro de Atividades

Ferramenta interna da Monte Bravo para registrar chamados de TI e exportar um CSV pronto para importação em massa no Jira Service Management.

Tudo roda no navegador — sem backend, sem dependências externas em runtime.

---

## Stack

- **Vite 8** + **React 18** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Vitest** para testes unitários
- Persistência em **localStorage**

---

## Funcionalidades

| Feature | Descrição |
|---------|-----------|
| **Formulário de chamado** | Campos Summary, Description e Reporter. Atalho `Ctrl+Enter` para adicionar rápido |
| **Tipos de chamado** | Seletor com tipos configuráveis (Onboarding, Offboarding, etc.) — não exportado no CSV |
| **Modelos (templates)** | Salve o preenchimento atual como modelo de um tipo. Na próxima vez que selecionar aquele tipo, os campos são preenchidos automaticamente |
| **Tabela de chamados** | Lista com edição e exclusão por linha, botão "Limpar tudo" |
| **Exportação CSV** | UTF-8 com BOM, escape RFC 4180, preview antes do download. Arquivo: `jira-import-AAAA-MM-DD-HHmm.csv` |
| **Configurações** | Modal para adicionar, editar e remover tipos de chamado. Tudo persistido em localStorage |

---

## Estrutura

```
src/
├── components/
│   ├── TicketForm.tsx          # Formulário principal
│   ├── TicketTable.tsx         # Tabela de chamados
│   ├── TicketTypeSettings.tsx  # Modal de configuração de tipos
│   ├── CsvPreviewModal.tsx     # Preview do CSV antes do download
│   └── Toast.tsx               # Notificação de sucesso
├── hooks/
│   ├── useTickets.ts           # Estado + localStorage dos chamados
│   ├── useTicketTypes.ts       # CRUD dos tipos de chamado
│   └── useTemplates.ts         # Modelos de preenchimento por tipo
├── styles/
│   ├── tokens.css              # CSS custom properties (paleta, fontes, radii)
│   ├── fonts.css               # @font-face Graphie + Termina
│   └── components.css          # Classes do design system
├── utils/
│   ├── csv.ts                  # Geração e escape do CSV
│   └── csv.test.ts             # Testes unitários
├── fonts/                      # Arquivos .otf
├── background/                 # Imagem de fundo
├── types.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## Rodar localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

## Testes

```bash
npm test
```

---

## CSV gerado

O arquivo exportado segue este formato:

```csv
Summary,Description,Reporter
Instalar VS Code,Preciso do VS Code na máquina nova,gabriel.juarez@montebravo.com.br
```

- Codificação: UTF-8 com BOM (`\uFEFF`) para compatibilidade com Excel brasileiro
- Delimitador: vírgula
- Escape: RFC 4180 (aspas duplas envolvem campos com `,`, `"` ou quebra de linha)

---

## Design

Visual inspirado no sistema interno de Termos de Responsabilidade:

- Fundo escuro com imagem + overlay
- Cards brancos flutuantes
- Paleta institucional roxa (`#57489c`)
- Fontes Graphie (corpo) e Termina (títulos)
- Sem gradientes, sem emojis, sem glassmorphism

---

*Monte Bravo Investimentos — TI*
