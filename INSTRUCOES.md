# Agenda IA - Instruções de Uso

## Visão Geral

A Agenda IA é uma aplicação que combina um gerenciador de agenda com um assistente de IA conversacional, permitindo que você gerencie seus eventos através de uma interface tradicional de calendário ou através de conversas naturais com um assistente virtual.

## Configuração

### Modo Básico (sem backend)

1. Abra o arquivo `index.html` no seu navegador
2. A aplicação funcionará com armazenamento local e uma simulação simples de IA
3. Seus eventos serão salvos no armazenamento local do navegador

### Modo Avançado (com backend LangChain)

1. Certifique-se de ter o Node.js instalado
2. Na pasta `backend`, copie o arquivo `.env.example` para `.env`
3. Edite o arquivo `.env` e adicione sua chave de API da OpenAI:
   ```
   OPENAI_API_KEY=sua_chave_api_aqui
   ```
4. Execute o script de inicialização:
   - Windows: Execute `start.bat`
   - Linux/Mac: Execute `sh start.sh`
5. Abra o arquivo `index.html` em seu navegador
6. A aplicação se conectará automaticamente ao backend

## Como Usar

### Visualização Anual

1. Ao abrir a aplicação, você verá uma tela com todos os meses do ano
2. Cada mês mostra uma barra horizontal que indica a quantidade de compromissos
3. Quanto mais eventos no mês, mais preenchida estará a barra
4. O número total de eventos é mostrado abaixo de cada mês

### Interface de Mês (Pop-up)

1. Clique em qualquer mês na visualização anual para abrir o pop-up detalhado
2. No pop-up, você verá:
   - Um calendário completo do mês
   - Uma lista de todos os eventos daquele mês
3. Use os botões < e > para navegar entre os meses sem fechar o pop-up
4. Clique em um dia específico para ver seus eventos
5. Clique no X ou fora do pop-up para fechá-lo

### Interface de Agenda

1. Clique em um dia no calendário para selecionar e ver seus eventos
2. Dias com eventos marcados são destacados com um ponto
3. Clique em "Adicionar Evento" para criar um novo evento manualmente

### Interface de Chat

1. Clique na aba "Chat IA" para conversar com o assistente
2. Digite suas mensagens na caixa de texto inferior
3. O assistente responderá e realizará ações na sua agenda

### Exemplos de Comandos

#### Modo Básico (simulação):
- "Adicionar evento reunião amanhã"
- "Criar evento chamado dentista"
- "Ver eventos"
- "Mostrar agenda"

#### Modo Avançado (com LangChain):
- "Agende uma reunião com o cliente para quinta-feira às 15h"
- "Marque um almoço com Maria amanhã ao meio-dia"
- "Remova o evento de reunião da próxima segunda"
- "Mude o horário da consulta médica para 14h"
- "Quais eventos tenho para esta semana?"

## Solução de Problemas

- Se a aplicação não se conectar ao backend, verifique se:
  1. O servidor está rodando corretamente
  2. A chave API da OpenAI está configurada no arquivo `.env`
  3. Não há erros no console do navegador ou terminal

- Se os eventos não estiverem aparecendo:
  1. Verifique se o localStorage está habilitado no seu navegador
  2. Tente limpar o cache do navegador

## Recursos Adicionais

A Agenda IA utiliza:
- HTML, CSS e JavaScript para o frontend
- Node.js, Express e LangChain para o backend
- OpenAI API para processamento de linguagem natural

## Limitações Atuais

- A versão atual não suporta eventos recorrentes
- O assistente de IA depende de uma conexão com a internet e uma chave API válida
- Não há autenticação de usuários (os eventos são armazenados localmente) 