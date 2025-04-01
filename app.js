// Elementos da UI
const agendaButton = document.getElementById('btnAgenda');
const chatButton = document.getElementById('btnChat');
const agendaSection = document.getElementById('agendaSection');
const chatSection = document.getElementById('chatSection');
const calendar = document.getElementById('calendar');
const currentMonthElement = document.getElementById('currentMonth');
const currentYearElement = document.getElementById('currentYear');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const eventsList = document.getElementById('eventsList');
const addEventBtn = document.getElementById('addEventBtn');
const eventModal = document.getElementById('eventModal');
const monthModal = document.getElementById('monthModal');
const monthDetailCalendar = document.getElementById('monthDetailCalendar');
const monthDetailTitle = document.getElementById('monthDetailTitle');
const monthEventsList = document.getElementById('monthEventsList');
const closeModal = document.querySelectorAll('.close');
const eventForm = document.getElementById('eventForm');
const chatMessages = document.getElementById('chatMessages');
const userMessageInput = document.getElementById('userMessage');
const sendMessageButton = document.getElementById('sendMessage');
const monthsContainer = document.querySelector('.months-container');

// Configuração da API
const API_URL = 'http://localhost:3000/api';
let isApiAvailable = false;

// Variáveis de estado
let currentDate = new Date();
let events = JSON.parse(localStorage.getItem('events')) || [];
let selectedDate = null;
let selectedMonth = null;

// Verificar disponibilidade da API
async function checkApiAvailability() {
    try {
        const response = await fetch(`${API_URL}/events`);
        if (response.ok) {
            isApiAvailable = true;
            console.log('API está disponível. Usando backend para processamento.');
            // Carregar eventos do backend
            const eventsFromApi = await response.json();
            if (eventsFromApi.length > 0) {
                events = eventsFromApi;
                renderYearView();
                renderEvents();
            }
        }
    } catch (error) {
        console.log('API não disponível. Usando armazenamento local e simulação de IA.');
        isApiAvailable = false;
    }
}

// Navegação entre abas
agendaButton.addEventListener('click', () => {
    agendaButton.classList.add('active');
    chatButton.classList.remove('active');
    agendaSection.classList.add('active');
    chatSection.classList.remove('active');
});

chatButton.addEventListener('click', () => {
    chatButton.classList.add('active');
    agendaButton.classList.remove('active');
    chatSection.classList.add('active');
    agendaSection.classList.remove('active');
});

// Visualização Anual
function renderYearView() {
    const currentYear = currentDate.getFullYear();
    currentYearElement.textContent = currentYear;
    monthsContainer.innerHTML = '';
    
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 
        'Maio', 'Junho', 'Julho', 'Agosto', 
        'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    for (let month = 0; month < 12; month++) {
        const monthCard = document.createElement('div');
        monthCard.classList.add('month-card');
        
        const monthHeader = document.createElement('h4');
        monthHeader.textContent = monthNames[month];
        
        // Calcular eventos para este mês
        const monthStart = new Date(currentYear, month, 1);
        const monthEnd = new Date(currentYear, month + 1, 0);
        
        const monthEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= monthStart && eventDate <= monthEnd;
        });
        
        // Criar barra de eventos
        const barContainer = document.createElement('div');
        barContainer.classList.add('month-bar-container');
        
        const bar = document.createElement('div');
        bar.classList.add('month-bar');
        
        // Calcular largura da barra baseada na quantidade de eventos
        // Máximo de 20 eventos = 100%
        const barWidth = Math.min(monthEvents.length * 5, 100);
        bar.style.width = `${barWidth}%`;
        
        barContainer.appendChild(bar);
        
        // Adicionar contador de eventos
        const eventsCount = document.createElement('div');
        eventsCount.classList.add('month-events-count');
        eventsCount.textContent = `${monthEvents.length} evento${monthEvents.length !== 1 ? 's' : ''}`;
        
        monthCard.appendChild(monthHeader);
        monthCard.appendChild(barContainer);
        monthCard.appendChild(eventsCount);
        
        // Adicionar evento de clique para abrir o modal do mês
        monthCard.addEventListener('click', () => {
            openMonthModal(month, currentYear);
        });
        
        monthsContainer.appendChild(monthCard);
    }
}

// Funções do modal do mês
function openMonthModal(month, year) {
    selectedMonth = new Date(year, month, 1);
    
    // Atualizar título
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 
        'Maio', 'Junho', 'Julho', 'Agosto', 
        'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    monthDetailTitle.textContent = `${monthNames[month]} de ${year}`;
    
    // Renderizar calendário do mês
    renderMonthDetailCalendar(month, year);
    
    // Renderizar eventos do mês
    renderMonthEvents(month, year);
    
    // Exibir modal
    monthModal.style.display = 'block';
}

function renderMonthDetailCalendar(month, year) {
    monthDetailCalendar.innerHTML = '';
    
    // Adicionar nomes dos dias da semana
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    daysOfWeek.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day-name');
        dayElement.textContent = day;
        monthDetailCalendar.appendChild(dayElement);
    });
    
    // Determinar o primeiro dia do mês
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Adicionar dias vazios para alinhar corretamente
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        monthDetailCalendar.appendChild(emptyDay);
    }
    
    // Determinar o número de dias no mês
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Adicionar dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = day;
        
        // Verificar se é o dia atual
        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayElement.classList.add('today');
        }
        
        // Verificar se há eventos neste dia
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (events.some(event => event.date.startsWith(dateString))) {
            dayElement.classList.add('has-event');
        }
        
        // Adicionar evento de clique
        dayElement.addEventListener('click', () => {
            selectedDate = new Date(year, month, day);
            document.getElementById('eventDate').valueAsDate = selectedDate;
            renderEvents();
            monthModal.style.display = 'none';
        });
        
        monthDetailCalendar.appendChild(dayElement);
    }
}

function renderMonthEvents(month, year) {
    monthEventsList.innerHTML = '';
    
    // Filtrar eventos para este mês
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    
    const monthEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= monthStart && eventDate <= monthEnd;
    });
    
    if (monthEvents.length === 0) {
        const noEventsElement = document.createElement('li');
        noEventsElement.textContent = 'Nenhum evento para este mês';
        monthEventsList.appendChild(noEventsElement);
    } else {
        monthEvents.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
        }).forEach(event => {
            const eventElement = document.createElement('li');
            
            const eventInfo = document.createElement('div');
            eventInfo.classList.add('event-info');
            
            const eventTitle = document.createElement('h4');
            eventTitle.textContent = event.title;
            
            const eventTime = document.createElement('span');
            eventTime.classList.add('event-time');
            eventTime.textContent = `${formatDate(event.date)} às ${event.time}`;
            
            const eventDescription = document.createElement('p');
            eventDescription.textContent = event.description;
            
            eventInfo.appendChild(eventTitle);
            eventInfo.appendChild(eventTime);
            eventInfo.appendChild(eventDescription);
            
            eventElement.appendChild(eventInfo);
            
            monthEventsList.appendChild(eventElement);
        });
    }
}

// Funções do calendário
function renderCalendar() {
    calendar.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    currentMonthElement.textContent = new Date(year, month, 1)
        .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    
    // Adicionar nomes dos dias da semana
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    daysOfWeek.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day-name');
        dayElement.textContent = day;
        calendar.appendChild(dayElement);
    });
    
    // Determinar o primeiro dia do mês
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Adicionar dias vazios para alinhar corretamente
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        calendar.appendChild(emptyDay);
    }
    
    // Determinar o número de dias no mês
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Adicionar dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = day;
        
        // Verificar se é o dia atual
        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayElement.classList.add('today');
        }
        
        // Verificar se há eventos neste dia
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (events.some(event => event.date.startsWith(dateString))) {
            dayElement.classList.add('has-event');
        }
        
        // Adicionar evento de clique
        dayElement.addEventListener('click', () => {
            selectedDate = new Date(year, month, day);
            document.getElementById('eventDate').valueAsDate = selectedDate;
            renderEvents();
        });
        
        calendar.appendChild(dayElement);
    }
}

// Navegação do calendário
prevMonthButton.addEventListener('click', () => {
    if (selectedMonth) {
        selectedMonth.setMonth(selectedMonth.getMonth() - 1);
        renderMonthDetailCalendar(selectedMonth.getMonth(), selectedMonth.getFullYear());
        renderMonthEvents(selectedMonth.getMonth(), selectedMonth.getFullYear());
        monthDetailTitle.textContent = selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    } else {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    }
});

nextMonthButton.addEventListener('click', () => {
    if (selectedMonth) {
        selectedMonth.setMonth(selectedMonth.getMonth() + 1);
        renderMonthDetailCalendar(selectedMonth.getMonth(), selectedMonth.getFullYear());
        renderMonthEvents(selectedMonth.getMonth(), selectedMonth.getFullYear());
        monthDetailTitle.textContent = selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    } else {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    }
});

// Funções de eventos
function renderEvents() {
    eventsList.innerHTML = '';
    
    let filteredEvents = events;
    
    if (selectedDate) {
        const selectedDateStr = selectedDate.toISOString().split('T')[0];
        filteredEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            const eventDateStr = eventDate.toISOString().split('T')[0];
            return eventDateStr === selectedDateStr;
        });
    }
    
    if (filteredEvents.length === 0) {
        const noEventsElement = document.createElement('li');
        noEventsElement.textContent = 'Nenhum evento para este dia';
        eventsList.appendChild(noEventsElement);
    } else {
        filteredEvents.sort((a, b) => {
            return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
        }).forEach(event => {
            const eventElement = document.createElement('li');
            
            const eventInfo = document.createElement('div');
            eventInfo.classList.add('event-info');
            
            const eventTitle = document.createElement('h4');
            eventTitle.textContent = event.title;
            
            const eventTime = document.createElement('span');
            eventTime.classList.add('event-time');
            eventTime.textContent = `${formatDate(event.date)} às ${event.time}`;
            
            const eventDescription = document.createElement('p');
            eventDescription.textContent = event.description;
            
            eventInfo.appendChild(eventTitle);
            eventInfo.appendChild(eventTime);
            eventInfo.appendChild(eventDescription);
            
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '&times;';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => {
                deleteEvent(event.id);
            });
            
            eventElement.appendChild(eventInfo);
            eventElement.appendChild(deleteButton);
            
            eventsList.appendChild(eventElement);
        });
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
}

async function addEvent(event) {
    // Garantir que a data esteja no formato correto (YYYY-MM-DD)
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toISOString().split('T')[0];
    
    const formattedEvent = {
        ...event,
        date: formattedDate
    };

    if (isApiAvailable) {
        try {
            const response = await fetch(`${API_URL}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formattedEvent)
            });
            
            if (response.ok) {
                const savedEvent = await response.json();
                events.push(savedEvent);
            } else {
                console.error('Erro ao salvar evento na API');
                // Fallback para armazenamento local
                events.push(formattedEvent);
                saveEvents();
            }
        } catch (error) {
            console.error('Erro de conexão com a API:', error);
            // Fallback para armazenamento local
            events.push(formattedEvent);
            saveEvents();
        }
    } else {
        // Usar armazenamento local
        events.push(formattedEvent);
        saveEvents();
    }
    
    renderYearView();
    renderCalendar();
    renderEvents();
    
    // Se estiver com o modal de mês aberto, atualizar
    if (selectedMonth && monthModal.style.display === 'block') {
        renderMonthDetailCalendar(selectedMonth.getMonth(), selectedMonth.getFullYear());
        renderMonthEvents(selectedMonth.getMonth(), selectedMonth.getFullYear());
    }
}

async function deleteEvent(id) {
    if (isApiAvailable) {
        try {
            const response = await fetch(`${API_URL}/events/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                events = events.filter(event => event.id !== id);
            } else {
                console.error('Erro ao excluir evento na API');
                // Fallback para armazenamento local
                events = events.filter(event => event.id !== id);
                saveEvents();
            }
        } catch (error) {
            console.error('Erro de conexão com a API:', error);
            // Fallback para armazenamento local
            events = events.filter(event => event.id !== id);
            saveEvents();
        }
    } else {
        // Usar armazenamento local
        events = events.filter(event => event.id !== id);
        saveEvents();
    }
    
    renderYearView();
    renderCalendar();
    renderEvents();
    
    // Se estiver com o modal de mês aberto, atualizar
    if (selectedMonth && monthModal.style.display === 'block') {
        renderMonthDetailCalendar(selectedMonth.getMonth(), selectedMonth.getFullYear());
        renderMonthEvents(selectedMonth.getMonth(), selectedMonth.getFullYear());
    }
}

function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

// Modal de eventos
addEventBtn.addEventListener('click', () => {
    eventModal.style.display = 'block';
    
    if (selectedDate) {
        document.getElementById('eventDate').valueAsDate = selectedDate;
    } else {
        document.getElementById('eventDate').valueAsDate = new Date();
    }
    
    document.getElementById('eventTime').value = '12:00';
});

// Fechar modais
closeModal.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        eventModal.style.display = 'none';
        monthModal.style.display = 'none';
        selectedMonth = null;
    });
});

window.addEventListener('click', (event) => {
    if (event.target === eventModal) {
        eventModal.style.display = 'none';
    }
    if (event.target === monthModal) {
        monthModal.style.display = 'none';
        selectedMonth = null;
    }
});

eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const description = document.getElementById('eventDescription').value;
    
    const newEvent = {
        id: Date.now(),
        title,
        date,
        time,
        description
    };
    
    addEvent(newEvent);
    eventForm.reset();
    eventModal.style.display = 'none';
});

// Chat com IA
sendMessageButton.addEventListener('click', sendMessage);
userMessageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const userMessage = userMessageInput.value.trim();
    
    if (!userMessage) return;
    
    // Adicionar mensagem do usuário ao chat
    addMessageToChat(userMessage, 'user');
    userMessageInput.value = '';
    
    // Mostrar indicador de digitação
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'ai-message', 'typing');
    typingIndicator.textContent = 'Digitando...';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    if (isApiAvailable) {
        try {
            // Enviar mensagem para API do backend
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });
            
            if (response.ok) {
                const data = await response.json();
                // Remover indicador de digitação
                chatMessages.removeChild(typingIndicator);
                
                // Adicionar resposta ao chat
                addMessageToChat(data.message, 'ai');
                
                // Se a resposta incluir dados de evento, atualizar a agenda
                if (data.action === 'CRIAR' && data.eventData) {
                    // Se o ID já estiver definido pelo backend, use-o
                    if (!data.eventData.id) {
                        data.eventData.id = Date.now();
                    }
                    events.push(data.eventData);
                    renderYearView();
                    renderCalendar();
                    renderEvents();
                } else if (data.action === 'REMOVER' && data.eventData && data.eventData.id) {
                    events = events.filter(event => event.id !== data.eventData.id);
                    renderYearView();
                    renderCalendar();
                    renderEvents();
                } else if (data.action === 'ATUALIZAR' && data.eventData && data.eventData.id) {
                    const index = events.findIndex(event => event.id === data.eventData.id);
                    if (index !== -1) {
                        events[index] = { ...events[index], ...data.eventData };
                        renderYearView();
                        renderCalendar();
                        renderEvents();
                    }
                }
                
                // Salvar eventos localmente como backup
                saveEvents();
            } else {
                // Em caso de erro, usar a simulação local
                chatMessages.removeChild(typingIndicator);
                processAIResponse(userMessage);
                console.error('Erro na resposta da API');
            }
        } catch (error) {
            // Em caso de erro de conexão, usar a simulação local
            chatMessages.removeChild(typingIndicator);
            processAIResponse(userMessage);
            console.error('Erro ao conectar com a API:', error);
        }
    } else {
        // Usar simulação local se API não estiver disponível
        setTimeout(() => {
            chatMessages.removeChild(typingIndicator);
            processAIResponse(userMessage);
        }, 1000);
    }
}

function addMessageToChat(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
    messageElement.textContent = message;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function processAIResponse(userMessage) {
    // Simulação local simples quando a API não está disponível
    const userMessageLower = userMessage.toLowerCase();
    let aiResponse = "";
    
    if (userMessageLower.includes('adicionar evento') || userMessageLower.includes('criar evento')) {
        // Extração simples de informações
        let title = 'Novo Evento';
        let date = new Date();
        let time = '12:00';
        let description = '';
        
        // Tentar extrair título
        const titleMatch = userMessageLower.match(/(?:chamado|título|titulado|nome)(.*?)(?:para|em|às|no dia|$)/);
        if (titleMatch && titleMatch[1]) {
            title = titleMatch[1].trim();
        }
        
        // Tentar extrair data
        if (userMessageLower.includes('amanhã')) {
            date.setDate(date.getDate() + 1);
        } else if (userMessageLower.includes('próxima semana')) {
            date.setDate(date.getDate() + 7);
        }
        
        const dateStr = date.toISOString().split('T')[0];
        
        // Adicionar evento
        const newEvent = {
            id: Date.now(),
            title,
            date: dateStr,
            time,
            description
        };
        
        addEvent(newEvent);
        
        aiResponse = `Adicionei um evento "${title}" para ${formatDate(dateStr)} às ${time}.`;
    } else if (userMessageLower.includes('mostrar agenda') || userMessageLower.includes('ver eventos')) {
        agendaButton.click();
        aiResponse = "Aqui está sua agenda!";
    } else {
        aiResponse = "Desculpe, não entendi. Você pode me pedir para adicionar eventos ou mostrar sua agenda.";
    }
    
    addMessageToChat(aiResponse, 'ai');
}

// Inicialização
checkApiAvailability();
renderYearView();
renderCalendar();
renderEvents();

// Adicionar mensagem de boas-vindas no chat
setTimeout(() => {
    addMessageToChat("Olá! Eu sou sua assistente de agenda. Como posso ajudar hoje? Você pode me pedir para adicionar eventos ou verificar sua agenda.", 'ai');
}, 500); 