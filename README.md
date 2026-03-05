# 👤 Gerenciamento de Usuários

Sistema web fullstack para cadastro e visualização de usuários, com backend em Node.js e frontend em ReactJS.

---

## 📋 Funcionalidades

- ✅ Cadastro de usuários com nome completo, e-mail, senha, telefone, data de nascimento e endereço
- ✅ Senha armazenada com hash seguro via `bcryptjs`
- ✅ Validação de campos obrigatórios e e-mail único
- ✅ Listagem de todos os usuários cadastrados
- ✅ Interface responsiva estilizada com Tailwind CSS

---

## 🛠️ Tecnologias Utilizadas

### Backend
| Tecnologia | Descrição |
|---|---|
| [Node.js](https://nodejs.org/) | Ambiente de execução JavaScript |
| [Express](https://expressjs.com/) | Framework HTTP para criação de APIs REST |
| [Prisma ORM](https://www.prisma.io/) | ORM para modelagem e acesso ao banco de dados |
| [PostgreSQL](https://www.postgresql.org/) | Banco de dados relacional |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Hash de senhas |
| [dotenv](https://github.com/motdotla/dotenv) | Gerenciamento de variáveis de ambiente |
| [cors](https://github.com/expressjs/cors) | Habilitação de CORS para o frontend |

### Frontend
| Tecnologia | Descrição |
|---|---|
| [ReactJS](https://react.dev/) | Biblioteca para construção de interfaces |
| [Tailwind CSS](https://tailwindcss.com/) | Framework CSS utilitário |
| [Axios](https://axios-http.com/) | Cliente HTTP para consumo da API |

---

## 📁 Estrutura do Projeto

```
gerenciamento-usuarios/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Modelo do banco de dados
│   ├── src/
│   │   ├── controllers/
│   │   │   └── usuario.controller.js
│   │   ├── routes/
│   │   │   └── usuario.routes.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── FormularioCadastro.jsx
    │   │   └── ListaUsuarios.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── index.js
    ├── .env.example
    └── package.json
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [PostgreSQL](https://www.postgresql.org/) instalado e rodando
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

---

### 🔧 Backend

**1. Acesse a pasta do backend:**
```bash
cd backend
```

**2. Instale as dependências:**
```bash
npm install
```

**3. Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do PostgreSQL:
```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/gerenciamento_usuarios"
PORT=3001
```

**4. Execute as migrations para criar as tabelas no banco:**
```bash
npx prisma migrate dev --name init
```

**5. Inicie o servidor:**

Em modo de desenvolvimento (com hot reload):
```bash
npm run dev
```

Em modo de produção:
```bash
npm start
```

O servidor estará rodando em `http://localhost:3001`.

---

### 🎨 Frontend

**1. Acesse a pasta do frontend:**
```bash
cd frontend
```

**2. Instale as dependências:**
```bash
npm install
```

**3. Configure as variáveis de ambiente (opcional):**
```bash
cp .env.example .env
```

O arquivo `.env` pode conter a URL da API (padrão já é `http://localhost:3001/api`):
```env
REACT_APP_API_URL=http://localhost:3001/api
```

**4. Inicie a aplicação:**
```bash
npm start
```

O frontend estará disponível em `http://localhost:3000`.

---

## 🔌 Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/usuarios` | Lista todos os usuários |
| `POST` | `/api/usuarios` | Cadastra um novo usuário |

### Exemplo de corpo para `POST /api/usuarios`

```json
{
  "nomeCompleto": "João da Silva",
  "email": "joao@email.com",
  "senha": "minhasenha123",
  "telefone": "(81) 99999-9999",
  "dataNascimento": "1995-06-15",
  "endereco": "Rua Exemplo, 123 - Recife, PE"
}
```

### Exemplo de resposta (`201 Created`)

```json
{
  "id": 1,
  "nomeCompleto": "João da Silva",
  "email": "joao@email.com",
  "telefone": "(81) 99999-9999",
  "dataNascimento": "1995-06-15T00:00:00.000Z",
  "endereco": "Rua Exemplo, 123 - Recife, PE",
  "dataCadastro": "2026-03-04T12:00:00.000Z"
}
```

> ⚠️ A senha **nunca** é retornada nos responses da API.

---

## 🗄️ Modelo do Banco de Dados

```prisma
model Usuario {
  id              Int       @id @default(autoincrement())
  nomeCompleto    String
  email           String    @unique
  senha           String
  telefone        String?
  dataNascimento  DateTime?
  endereco        String?
  dataCadastro    DateTime  @default(now())

  @@map("usuarios")
}
```

---

## 📜 Scripts Disponíveis

### Backend
| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor com nodemon (hot reload) |
| `npm start` | Inicia o servidor em produção |

### Frontend
| Comando | Descrição |
|---|---|
| `npm start` | Inicia a aplicação em modo de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm test` | Executa os testes |

---

## 👩‍💻 Autora

Feito por **Jamylle da Silva Santana** durante o **Bootcamp de Desenvolvimento Full Stack** da [Atlântico Avanti](https://www.atlantico.com.br/).
