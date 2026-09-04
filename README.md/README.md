# 🍓 Doces & Espetinhos — Sistema de Gestão

Projeto base full-stack para gerenciamento de vendas, produção, estoque, produtos, financeiro e backup.

## Estrutura
- `backend/` — Node.js + Express + MongoDB
- `frontend/` — React + Vite + Tailwind CSS

## Funcionalidades incluídas
- Login e cadastro com JWT
- Estrutura para Google OAuth
- Dashboard com período
- Vendas e venda rápida
- Produtos
- Produção com débito de insumos no estoque
- Cancelamento de produção com devolução de insumos
- Estoque por categoria, unidade, preço e estoque mínimo
- Financeiro
- Backup em JSON
- Interface responsiva para celular

## Instalação

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Configure o MongoDB e as variáveis `.env`.

## Observação
O projeto é uma base funcional. Para produção, configure corretamente MongoDB (preferencialmente um replica set quando usar transações), Google OAuth, CORS, JWT secret e HTTPS.
