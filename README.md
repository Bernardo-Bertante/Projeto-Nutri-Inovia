# Nutrition Calendar - Sistema de Agendamento

Sistema Full Stack para gerenciamento de consultas de uma clínica de nutrição, desenvolvido como parte do Desafio Full Stack Web.

A aplicação permite que nutricionistas realizem login e gerenciem suas consultas através de um calendário interativo, com persistência de dados e validação de conflitos de horários.

---

### 🛠 Tecnologias Utilizadas

- Backend: NestJS
- Frontend: React + Vite
- Banco de Dados: MongoDB
- Containerização: Docker + Docker Compose
- Documentação da API: Swagger
- Autenticação: JWT

---

## 🚀 Instruções de Execução

### 📋 Pré-requisitos

Antes de executar o projeto, é necessário ter instalado em sua máquina:

- Docker
- Docker Compose

---

### 📦 1. Clonar o Repositório

```bash
git clone https://github.com/Bernardo-Bertante/Projeto-Nutri-Inovia.git
```

---

### 📂 2. Acessar a Pasta do Projeto

```bash
cd Projeto-Nutri-Inovia
```

---

### ⚙️ 3. Criar o Arquivo .env

Na raiz do projeto, crie um arquivo chamado `.env` com o seguinte conteúdo:

```env
MONGO_URI=mongodb://database:27017/nutrition-clinic

# Gere uma chave segura executando no terminal:
# openssl rand -base64 64
JWT_SECRET=sua_chave_gerada_aqui

JWT_EXPIRES_IN=3600

BACKEND_PORT=3000
FRONTEND_PORT=5173
```

---

### ▶️ 4. Executar a Aplicação

Na raiz do projeto, execute:

```bash
docker-compose up --build
```

O Docker irá:

- Subir o container do MongoDB
- Construir e iniciar o backend (NestJS)
- Construir e iniciar o frontend (React + Vite)

---

### 🌐 Acesso à Aplicação

Após a inicialização:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Swagger: http://localhost:3000/api

---

### 🔐 Login para Teste

O sistema possui dois nutricionistas cadastrados automaticamente via seeding inicial.

#### Nutricionista 1

- Email: ana.silva@nutri.com
- Senha: 123456

#### Nutricionista 2

- Email: carlos.souza@nutri.com
- Senha: 123456

---

### Parar a Aplicação

Para parar os containers:

```bash
docker-compose down
```

Para remover também o volume do banco de dados:

```bash
docker-compose down -v
```

---

### 📌 Observações

- O token JWT possui validade de 1 hora.
- Não é necessário cadastrar nutricionistas manualmente.
- O banco de dados é persistido via volume Docker.
- A aplicação é totalmente executável via Docker, conforme exigido no desafio.
