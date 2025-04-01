require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { RunnableSequence } = require('@langchain/core/runnables');
const { formatDocumentsAsString } = require("langchain/util/document");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Armazenamento temporário de eventos
let events = [];

// Configuração do modelo de chat
const chatModel = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0.2
});

// Template de prompt para o assistente de agenda
const eventAssistantPrompt = PromptTemplate.fromTemplate(`
Você é um assistente virtual especializado em gerenciar uma agenda de eventos.
Seu objetivo é ajudar o usuário a adicionar, remover, atualizar e consultar eventos na agenda.

Atual estado da agenda:
{events}

Instruções:
1. Se o usuário quiser adicionar um evento novo, extraia as informações relevantes (título, data, hora, descrição).
2. Se o usuário quiser remover ou atualizar um evento, identifique qual evento deve ser modificado.
3. Se o usuário quiser consultar eventos, forneça as informações solicitadas.
4. Sempre responda de forma amigável e confirme as ações realizadas.
5. Se extrair informações para criar/modificar um evento, retorne-as em formato JSON para fácil processamento.

Mensagem do usuário: {query}

Sua resposta deve seguir este formato se for para criar ou modificar um evento:
AÇÃO: [CRIAR|ATUALIZAR|REMOVER|CONSULTAR]
DADOS: {"title": "Título do evento", "date": "YYYY-MM-DD", "time": "HH:MM", "description": "Descrição"}
RESPOSTA: Sua resposta amigável para o usuário

Para consultas simples, pode responder normalmente:
AÇÃO: CONSULTAR
RESPOSTA: Sua resposta para o usuário
`);

// Chain de processamento
const eventAssistantChain = RunnableSequence.from([
  {
    events: (input) => {
      return formatDocumentsAsString(
        events.map(event => ({
          pageContent: `Evento: ${event.title}, Data: ${event.date}, Hora: ${event.time}, Descrição: ${event.description || 'Sem descrição'}, ID: ${event.id}`
        }))
      );
    },
    query: (input) => input.query
  },
  eventAssistantPrompt,
  chatModel,
  new StringOutputParser()
]);

// Rota para chat
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Mensagem é obrigatória' });
  }
  
  try {
    const response = await eventAssistantChain.invoke({
      query: message
    });
    
    // Parse da resposta
    let responseData = {
      message: response,
      action: 'CONSULTAR',
      eventData: null
    };
    
    // Verificar se a resposta contém uma ação e dados
    if (response.includes('AÇÃO:') && response.includes('RESPOSTA:')) {
      const actionMatch = response.match(/AÇÃO:\s*(.*)/);
      const action = actionMatch ? actionMatch[1].trim() : 'CONSULTAR';
      
      let eventData = null;
      if (response.includes('DADOS:')) {
        const dataMatch = response.match(/DADOS:\s*(.*)/);
        if (dataMatch) {
          try {
            const jsonStr = dataMatch[1].trim();
            eventData = JSON.parse(jsonStr);
          } catch (e) {
            console.error('Erro ao fazer parse dos dados JSON:', e);
          }
        }
      }
      
      const responseMatch = response.match(/RESPOSTA:\s*(.*)/s);
      const responseText = responseMatch ? responseMatch[1].trim() : response;
      
      responseData = {
        message: responseText,
        action,
        eventData
      };
      
      // Processar ação
      if (action === 'CRIAR' && eventData) {
        const newEvent = {
          id: Date.now(),
          ...eventData
        };
        events.push(newEvent);
      } else if (action === 'REMOVER' && eventData && eventData.id) {
        events = events.filter(event => event.id !== eventData.id);
      } else if (action === 'ATUALIZAR' && eventData && eventData.id) {
        const index = events.findIndex(event => event.id === eventData.id);
        if (index !== -1) {
          events[index] = { ...events[index], ...eventData };
        }
      }
    }
    
    res.json(responseData);
  } catch (error) {
    console.error('Erro ao processar mensagem:', error);
    res.status(500).json({ error: 'Erro ao processar mensagem' });
  }
});

// Rotas para gerenciar eventos
app.get('/api/events', (req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const event = {
    id: Date.now(),
    ...req.body
  };
  events.push(event);
  res.status(201).json(event);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = events.findIndex(event => event.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Evento não encontrado' });
  }
  
  events[index] = { ...events[index], ...req.body };
  res.json(events[index]);
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = events.findIndex(event => event.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Evento não encontrado' });
  }
  
  const deletedEvent = events[index];
  events = events.filter(event => event.id !== id);
  res.json(deletedEvent);
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
}); 