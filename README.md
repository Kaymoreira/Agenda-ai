# Agenda IA

Um aplicativo de agenda com assistente virtual por IA que permite gerenciar sua agenda através de conversa natural.

## Funcionalidades

- **Visualização Anual**: Veja todos os meses do ano com barras indicando a quantidade de compromissos
- **Pop-up Mensal**: Clique em um mês para ver detalhes em um pop-up com calendário e lista de eventos
- **Agenda Visual**: Visualize seus eventos em um calendário interativo
- **Lista de Eventos**: Veja todos os eventos agendados para o dia selecionado
- **Chat com IA**: Converse com um assistente virtual para gerenciar sua agenda
- **Armazenamento Local**: Seus eventos são salvos no navegador

## Estrutura do Projeto

O projeto é dividido em duas partes:

1. **Frontend**: Interface de usuário com HTML, CSS e JavaScript
2. **Backend**: Servidor Node.js com LangChain para processamento de linguagem natural

## Configuração e Instalação

### Frontend

Para executar apenas o frontend (com simulação de IA):

1. Abra o arquivo `index.html` em seu navegador
2. A aplicação funcionará com armazenamento local e uma simulação básica de IA

### Backend (com LangChain)

Para configurar o backend com LangChain:

1. Certifique-se de ter o Node.js instalado (versão 14 ou superior)
2. Navegue até a pasta `backend` no terminal
3. Execute `npm install` para instalar as dependências
4. Copie o arquivo `.env.example` para `.env`
5. Adicione sua chave de API da OpenAI no arquivo `.env`
6. Execute `npm start` para iniciar o servidor
7. O servidor estará disponível em `http://localhost:3000`

## Como usar

1. Depois de configurar o frontend e (opcionalmente) o backend, abra o arquivo `index.html`
2. Na tela inicial, você verá todos os meses do ano com barras indicando a quantidade de eventos
3. Clique em um mês para abrir um pop-up com o calendário detalhado e a lista de eventos
4. Clique em um dia para ver os eventos específicos daquele dia
5. Use o botão "Adicionar Evento" para criar um novo evento manualmente
6. Alterne para a aba "Chat IA" para conversar com o assistente virtual
7. Use comandos como "Adicionar evento reunião amanhã às 15h" ou "Mostrar minha agenda"

## Funcionalidades do Chat com IA

### Modo Simulação (sem backend)
- "Adicionar evento [título] para [data]"
- "Criar evento [título]"
- "Mostrar agenda"
- "Ver eventos"

### Modo LangChain (com backend ativo)
Comandos mais avançados como:
- "Agende uma reunião com João na próxima terça às 14h"
- "Remova o evento de amanhã"
- "Mude o horário da reunião de quarta para 16h"
- "Quais eventos tenho esta semana?"
- "Adicione uma consulta médica para o dia 15/06 às 10h"

## Tecnologias Utilizadas

- HTML, CSS e JavaScript (Frontend)
- Node.js e Express (Backend)
- LangChain e OpenAI API (Processamento de linguagem natural)
- Armazenamento local (localStorage)

## Próximos Passos

- Melhorar o processamento de linguagem natural
- Adicionar suporte para recorrência de eventos
- Implementar notificações para eventos próximos
- Adicionar integração com calendários externos

## Como Contribuir

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das alterações (`git commit -m 'Adicionando nova funcionalidade'`)
4. Envie para o branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request 