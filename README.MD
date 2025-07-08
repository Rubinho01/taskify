# 🚀 Taskify

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

> Um app colaborativo para organização de quadros, com amizades, convites e tarefas em grupo.
> Alunos: Rubem Krüger, Nicolas de Sá e Eduardo de Oliveira

---

## ✨ Visão Geral

**Taskify** é um gerenciador de quadros (boards) inspirado em ferramentas como Trello. O foco é permitir que usuários criem quadros e compartilhem com seus amigos através de um sistema de amizade simples e funcional.

📌 Desenvolvido com **Node.js + Express + MySQL + EJS**, com interface responsiva usando **Bootstrap 5.3**.

---

## 🧩 Funcionalidades

- 👤 Cadastro e login de usuários
- 📋 Criação, edição e exclusão de quadros
- 🤝 Sistema de amizade com solicitações e aceitações
- 🧑‍🤝‍🧑 Convites de amigos para quadros (sem duplicar)
- 🔐 Sessão com autenticação
- 💬 Feedbacks e mensagens amigáveis
- 📱 Interface amigável e responsiva

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia        | Descrição                                |
|-------------------|--------------------------------------------|
| 🟩 Node.js         | Runtime JavaScript para backend           |
| 🖤 Express.js       | Framework web minimalista                |
| 🐬 MySQL / MariaDB | Banco de dados relacional                |
| 🟪 Bootstrap 5.3   | Estilização moderna e responsiva         |
| 🎨 EJS            | Templates HTML dinâmicos no servidor      |
| 🧠 Session         | Autenticação baseada em sessão            |

---

## ⚙️ Como Rodar Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/seuuser/taskify.git
cd taskify

# 2. Instale as dependências
npm install

# 3. Configure o banco de dados (MySQL/MariaDB)
# Importe o banco presente na pasta "databaseHere!"

# 4. Inicie o servidor
npm start

# 5. Acesse em:
localhost:3000
