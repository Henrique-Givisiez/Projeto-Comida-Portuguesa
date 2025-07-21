# Planejamento de Sprints

↓ Clique neste botão para automaticamente gerar um modelo de anotações de reunião de planejamento de sprint. Você pode clicar em `⛭` para adicionar outra ação ao criar uma nova sprint e abrir automaticamente.

## 28 de julho de 2025 para Sprint 1 (42 pontos)

## User stories a serem feitas

- Abertura de Comanda (13 pontos)

> **Como cliente**, quero digitar meu nome e abrir uma comanda, para que eu possa começar a fazer meus pedidos.
> 

| Etapa | Tarefa | Esforço |
| --- | --- | --- |
| Design | Criar design da tela de abertura de comanda e seus componentes | 2 pts |
| Frontend - UI | Criar componente de formulário com input para nome | 2 pts |
| Frontend - UI | Criar botão "Abrir Comanda" e desativar se nome estiver vazio | 1 pt |
| Backend - API | Criar rota `POST /comandas` para abrir nova comanda | 2 pts |
| Backend - Lógica | Gerar ID único da comanda e armazenar nome + data + status inicial | 2 pts |
| Integração Front x Back | Consumir API de criação de comanda e armazenar ID no frontend | 2 pts |
| Estado e Navegação | Redirecionar para página de cardápio após criação | 1 pt |
| Validação e UX | Adicionar feedback de erro/sucesso na abertura | 1 pt |

- Definição da Mesa (com senha) (14 pontos)

> **Como funcionário autorizado**, quero definir ou alterar o número da mesa, para que os pedidos sejam vinculados à mesa correta.
> 

| Etapa | Tarefa | Esforço |
| --- | --- | --- |
| Design | Mockup do seletor de mesa + campo para senha | 2 pts |
| Frontend - UI | Criar seletor/combobox para número da mesa | 2 pts |
| Frontend - UI | Criar modal/popup para digitar senha ao tentar alterar mesa | 2 pts |
| Backend - API | Criar rota `POST /validar-senha` com tipo de senha (admin/garçom) | 2 pts |
| Backend - Segurança | Criar tabela ou variável `senhaGarcom` e armazenar hash/senha em env | 2 pts |
| Frontend - Integração | Validar senha antes de permitir alteração da mesa | 2 pts |
| Estado de Sessão | Armazenar número da mesa no `localStorage` ou estado de contexto | 1 pt |
| UX e Feedback | Mensagem de erro se senha estiver incorreta | 1 pt |

- Visualização do Cardápio (15 pontos)

> **Como cliente**, quero visualizar os itens do cardápio organizados por categoria, para que eu possa escolher o que quero pedir com facilidade.
> 

| Etapa | Tarefa | Esforço |
| --- | --- | --- |
| Design | Mockup da tela de cardápio com categorias na lateral esquerda | 3 pts |
| Backend - Estrutura | Criar estrutura de dados de itens com categorias (tabela ou JSON) | 2 pts |
| Backend - API | Criar rota `GET /cardapio` que retorna itens categorizados | 2 pts |
| Frontend - Sidebar | Criar sidebar de categorias (ex: Bebidas, Carnes, Massas...) | 2 pts |
| Frontend - Listagem | Criar grid/lista de itens da categoria com nome, descrição, preço, img | 3 pts |
| Frontend - Navegação | Permitir navegar entre categorias com scroll ou seleção | 2 pts |
| UX/Performance | Adicionar carregamento (skeleton/loading) | 1 pt |

## 5 de maio de 2025 para Sprint 2

Anotações

Transcrição

		

## Revisão da última Sprint

*15-20 min*

- 

## Próxima Sprint

*15-20 min*

- 

## Discussão

*15-20 min*

## 1 de maio de 2025 para Sprint 3

Anotações

Transcrição

		

## Revisão da última Sprint

*15-20 min*

- 

## Próxima Sprint

*15-20 min*

- 

## Discussão

*15-20 min*