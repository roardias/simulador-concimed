# Como Executar o Simulador Concimed

## Pré-requisitos
- Node.js (versão 14 ou superior)
- npm (vem com o Node.js)

## Instalação e Execução

### 1. Instalar dependências
```bash
npm install
```

### 2. Executar em modo de desenvolvimento
```bash
npm start
```

O aplicativo será aberto automaticamente no navegador em `http://localhost:3000`

### 3. Para criar uma versão de produção
```bash
npm run build
```

## Verificação

✅ **Funcionalidades implementadas:**
- ✅ Interface responsiva para mobile
- ✅ 6 botões de seleção de remuneração (R$ 10k a R$ 60k)
- ✅ Cores da marca Concimed (#E0652C, #57271D, branco)
- ✅ Logo Concimed integrado
- ✅ Design moderno e intuitivo
- ✅ Animações suaves
- ✅ Feedback visual da seleção

## Próximos Passos
- Aguardando especificações para sistema de comparação
- Funcionalidades de análise e relatórios
- Integração com dados da Concimed

## Estrutura Atual
```
Simulado_Concimed/
├── public/
│   ├── index.html
│   └── logo_Concimed.svg
├── src/
│   ├── App.js       (Componente principal)
│   ├── App.css      (Estilos da aplicação)
│   └── index.js     (Ponto de entrada)
├── package.json
├── README.md
└── INSTALACAO.md
```

## Testado em:
- ✅ Desktop (Chrome, Firefox, Edge)
- ✅ Mobile (responsivo)
- ✅ Tablets
