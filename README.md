# 🎵 RocketLab Musicco E-Commerce API

API backend para loja de instrumentos musicais desenvolvida com NestJS, TypeScript e SQLite.

## 📋 Funcionalidades

### ✅ Produtos
- 🎸 Criar, listar, atualizar e deletar instrumentos musicais
- 🔍 Buscar instrumentos por nome ou descrição
- 💰 Filtrar produtos por faixa de preço
- 📦 Listar apenas instrumentos em estoque
- 🏷️ Validação de dados com mensagens de erro personalizadas

### 👥 Usuários
- 👤 Criar, listar, atualizar e deletar usuários
- 📧 Validação de email único
- 📍 Suporte a endereço e telefone

### 🛒 Carrinho de Compras
- ➕ Adicionar instrumentos ao carrinho
- 📝 Atualizar quantidade de itens
- ❌ Remover itens do carrinho
- 🧹 Limpar carrinho completamente
- 💯 Cálculo automático do total

### 📦 Pedidos
- ✅ Finalizar compra do carrinho
- 📊 Controle de status do pedido
- 📋 Histórico de pedidos por usuário
- 🔄 Atualização automática do estoque
- ❌ Cancelamento de pedidos pendentes

## 🛠️ Tecnologias

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **TypeORM** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Class Validator** - Validação de dados
- **Swagger** - Documentação da API

## 🚀 Como executar

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Passo a passo

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd rocketlab-backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute a aplicação**
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

4. **Acesse a aplicação**
- API: http://localhost:3000
- Documentação: http://localhost:3000/api

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger em:
**http://localhost:3000/api**

### Principais endpoints:

#### 🎼 Instrumentos
- `GET /products` - Listar todos os instrumentos
- `GET /products/search?q={termo}` - Buscar instrumentos
- `GET /products/in-stock` - Instrumentos em estoque
- `GET /products/price-range?min={min}&max={max}` - Filtrar por preço
- `POST /products` - Criar instrumento
- `PATCH /products/{id}` - Atualizar instrumento
- `DELETE /products/{id}` - Deletar instrumento

#### 👥 Usuários
- `GET /users` - Listar usuários
- `POST /users` - Criar usuário
- `GET /users/{id}` - Buscar usuário
- `PATCH /users/{id}` - Atualizar usuário
- `DELETE /users/{id}` - Deletar usuário

#### 🛒 Carrinho
- `GET /cart/user/{userId}` - Obter carrinho do usuário
- `POST /cart/add` - Adicionar ao carrinho
- `PATCH /cart/item/{itemId}` - Atualizar item
- `DELETE /cart/item/{itemId}` - Remover item
- `DELETE /cart/user/{userId}/clear` - Limpar carrinho

#### 📦 Pedidos
- `POST /orders` - Finalizar compra
- `GET /orders` - Listar pedidos
- `GET /orders/{id}` - Buscar pedido
- `GET /orders/user/{userId}` - Pedidos do usuário
- `PATCH /orders/{id}` - Atualizar status
- `DELETE /orders/{id}` - Cancelar pedido

## 💼 Exemplos de Uso

### Criar um instrumento
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Guitarra Fender Stratocaster",
    "description": "Guitarra elétrica com corpo em alder e braço em maple",
    "price": 2499.99,
    "category": "Guitarras",
    "stock": 15
  }'
```

### Criar um usuário
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carlos Música",
    "email": "carlos@email.com",
    "password": "senha123"
  }'
```

### Adicionar instrumento ao carrinho
```bash
curl -X POST http://localhost:3000/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "1",
    "productId": "1",
    "quantity": 1
  }'
```

### Finalizar compra
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "1"
  }'
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Coverage
npm run test:cov
```

---

Desenvolvido com ❤️ durante o desafio da Visagio Rocket-Lab
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
