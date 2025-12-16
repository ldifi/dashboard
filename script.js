// Конфигурация API для всех виджетов
const API_CONFIG = {
    weather: {
        url: (config) => `https://api.open-meteo.com/v1/forecast?latitude=${config.latitude}&longitude=${config.longitude}&current_weather=true`,
        defaultConfig: {
            city: 'Москва',
            latitude: 55.7558,
            longitude: 37.6173
        },
        parser: (data) => {
            const weather = data.current_weather;
            const weatherCodes = {
                0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️',
                51: '🌦️', 53: '🌦️', 55: '🌦️', 61: '🌧️', 63: '🌧️', 65: '🌧️',
                80: '🌦️', 81: '🌧️', 82: '⛈️', 95: '⛈️', 96: '⛈️', 99: '⛈️'
            };
            return {
                icon: weatherCodes[weather.weathercode] || '🌈',
                temperature: `${weather.temperature}°C`,
                description: `Ветер: ${weather.windspeed} км/ч`,
                details: [
                    { label: 'Ветер', value: `${weather.windspeed} км/ч` },
                    { label: 'Напр.', value: `${weather.winddirection}°` }
                ]
            };
        }
    },
    user: {
        url: 'https://randomuser.me/api/',
        parser: (data) => {
            const user = data.results[0];
            return {
                avatar: user.picture.large,
                name: `${user.name.first} ${user.name.last}`,
                email: user.email,
                location: `${user.location.city}, ${user.location.country}`
            };
        }
    },
    crypto: {
        url: (config) => {
            const ids = config.cryptos.join(',');
            return `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
        },
        defaultConfig: {
            cryptos: ['bitcoin', 'ethereum']
        },
        parser: (data) => {
            const result = {};
            Object.keys(data).forEach(crypto => {
                const cryptoData = data[crypto];
                const symbols = {
                    bitcoin: '₿',
                    ethereum: 'Ξ',
                    litecoin: 'Ł',
                    cardano: 'ADA',
                    dogecoin: 'Ð'
                };
                result[crypto] = {
                    price: `$${cryptoData.usd.toLocaleString()}`,
                    change: cryptoData.usd_24h_change?.toFixed(2) || '0',
                    symbol: symbols[crypto] || crypto.slice(0, 3).toUpperCase()
                };
            });
            return result;
        }
    },
    stock: {
        url: (config) => `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${config.symbol}&apikey=demo`,
        defaultConfig: {
            symbol: 'IBM'
        },
        parser: (data) => {
            const quote = data['Global Quote'];
            return {
                symbol: quote['01. symbol'],
                price: quote['05. price'],
                change: quote['09. change'],
                changePercent: quote['10. change percent']
            };
        }
    },
    joke: {
        url: 'https://v2.jokeapi.dev/joke/Any?type=single',
        parser: (data) => ({
            joke: data.joke
        })
    },
    fact: {
        url: 'https://uselessfacts.jsph.pl/random.json?language=en',
        parser: (data) => ({
            fact: data.text
        })
    },
    advice: {
        url: 'https://api.adviceslip.com/advice',
        parser: (data) => ({
            advice: data.slip.advice
        })
    },
    cat: {
        url: 'https://api.thecatapi.com/v1/images/search',
        parser: (data) => ({
            image: data[0].url
        })
    },
    dog: {
        url: 'https://dog.ceo/api/breeds/image/random',
        parser: (data) => ({
            image: data.message
        })
    },
    clock: {
        parser: () => {
            const now = new Date();
            return {
                time: now.toLocaleTimeString(),
                date: now.toLocaleDateString('ru-RU', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })
            };
        }
    },
    github: {
        url: (config) => `https://api.github.com/users/${config.username}`,
        defaultConfig: {
            username: 'torvalds'
        },
        parser: (data) => ({
            avatar: data.avatar_url,
            username: data.login,
            name: data.name || data.login,
            followers: data.followers,
            following: data.following,
            repos: data.public_repos
        })
    },
    movie: {
        url: (config) => `https://www.omdbapi.com/?i=${config.movieId}&apikey=demo`,
        defaultConfig: {
            movieId: 'tt0111161',
            title: 'The Shawshank Redemption'
        },
        parser: (data) => ({
            title: data.Title,
            year: data.Year,
            rating: data.imdbRating,
            poster: data.Poster !== 'N/A' ? data.Poster : null,
            genre: data.Genre,
            runtime: data.Runtime
        })
    }
};

// Описания виджетов для модального окна
const WIDGET_DESCRIPTIONS = {
    weather: { icon: '🌤️', title: 'Погода', description: 'Текущая погода' },
    user: { icon: '👤', title: 'Пользователь', description: 'Случайный профиль пользователя' },
    crypto: { icon: '₿', title: 'Криптовалюты', description: 'Курсы криптовалют' },
    stock: { icon: '📈', title: 'Акции', description: 'Котировки акций' },
    joke: { icon: '😂', title: 'Шутка', description: 'Случайная шутка' },
    fact: { icon: '💡', title: 'Факт', description: 'Интересный случайный факт' },
    advice: { icon: '💎', title: 'Совет', description: 'Полезный совет на день' },
    cat: { icon: '🐱', title: 'Котики', description: 'Случайное фото котика' },
    dog: { icon: '🐶', title: 'Собачки', description: 'Случайное фото собачки' },
    clock: { icon: '⏰', title: 'Часы', description: 'Текущее время и дата' },
    github: { icon: '🐙', title: 'GitHub', description: 'Статистика GitHub пользователя' },
    movie: { icon: '🎬', title: 'Фильм', description: 'Информация о фильме' }
};

// Города для погоды
const CITIES = {
    'Москва': { lat: 55.7558, lon: 37.6173 },
    'Санкт-Петербург': { lat: 59.9343, lon: 30.3351 },
    'Новосибирск': { lat: 55.0084, lon: 82.9357 },
    'Екатеринбург': { lat: 56.8389, lon: 60.6057 },
    'Казань': { lat: 55.8304, lon: 49.0661 },
    'Нижний Новгород': { lat: 56.2965, lon: 43.9361 },
    'Лондон': { lat: 51.5074, lon: -0.1278 },
    'Нью-Йорк': { lat: 40.7128, lon: -74.0060 },
    'Токио': { lat: 35.6762, lon: 139.6503 }
};

// Популярные фильмы для демо
const POPULAR_MOVIES = {
    'tt0111161': 'The Shawshank Redemption',
    'tt0068646': 'The Godfather',
    'tt0071562': 'The Godfather: Part II',
    'tt0468569': 'The Dark Knight',
    'tt0050083': '12 Angry Men',
    'tt0108052': 'Schindler\'s List',
    'tt0167260': 'The Lord of the Rings: The Return of the King',
    'tt0110912': 'Pulp Fiction',
    'tt0060196': 'The Good, the Bad and the Ugly',
    'tt0137523': 'Fight Club'
};

class Dashboard {
    constructor() {
        this.matrix = document.getElementById('matrix');
        this.addBtn = document.getElementById('addBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.importFile = document.getElementById('importFile');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.widgetModal = document.getElementById('widgetModal');
        this.settingsModal = document.getElementById('settingsModal');
        this.widgetsGrid = document.getElementById('widgetsGrid');
        this.settingsContent = document.getElementById('settingsContent');
        this.saveSettingsBtn = document.getElementById('saveSettings');
        this.cancelSettingsBtn = document.getElementById('cancelSettings');
        
        this.currentEditingWidget = null;
        this.draggedWidget = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadFromStorage();
        this.populateWidgetsModal();
        this.initDragAndDrop();
        
        // Автосохранение при изменении
        setInterval(() => this.saveToStorage(), 2000);
    }
    
    bindEvents() {
        this.addBtn.addEventListener('click', () => this.showWidgetModal());
        this.exportBtn.addEventListener('click', () => this.exportData());
        this.importFile.addEventListener('change', (e) => this.importData(e));
        this.refreshBtn.addEventListener('click', () => this.refreshAll());
        
        // Закрытие модальных окон
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => this.hideAllModals());
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === this.widgetModal || e.target === this.settingsModal) {
                this.hideAllModals();
            }
        });
        
        // Настройки
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.cancelSettingsBtn.addEventListener('click', () => this.hideAllModals());
        
        // Сохраняем конфигурацию при изменении
        this.matrix.addEventListener('DOMNodeRemoved', () => this.saveToStorage());
        this.matrix.addEventListener('DOMNodeInserted', () => this.saveToStorage());
        
        // Сохраняем при перетаскивании
        this.matrix.addEventListener('dragend', () => {
            this.saveToStorage();
        });
    }
    
    // Drag and Drop
    initDragAndDrop() {
        this.matrix.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('card') && !e.target.classList.contains('empty-card')) {
                this.draggedWidget = e.target;
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            }
        });
        
        this.matrix.addEventListener('dragover', (e) => {
            e.preventDefault();
            const card = e.target.closest('.card');
            if (card && card !== this.draggedWidget) {
                card.classList.add('drag-over');
            }
        });
        
        this.matrix.addEventListener('dragleave', (e) => {
            const card = e.target.closest('.card');
            if (card) {
                card.classList.remove('drag-over');
            }
        });
        
        this.matrix.addEventListener('drop', (e) => {
            e.preventDefault();
            const targetCard = e.target.closest('.card');
            if (targetCard && this.draggedWidget && targetCard !== this.draggedWidget) {
                const matrixRect = this.matrix.getBoundingClientRect();
                const targetRect = targetCard.getBoundingClientRect();
                const targetCenter = targetRect.top + targetRect.height / 2;
                
                if (e.clientY < targetCenter) {
                    this.matrix.insertBefore(this.draggedWidget, targetCard);
                } else {
                    this.matrix.insertBefore(this.draggedWidget, targetCard.nextSibling);
                }
                
                this.saveToStorage();
            }
            
            this.cleanupDragState();
        });
        
        this.matrix.addEventListener('dragend', () => {
            this.cleanupDragState();
        });
    }
    
    cleanupDragState() {
        this.matrix.querySelectorAll('.card').forEach(card => {
            card.classList.remove('dragging', 'drag-over');
        });
        this.draggedWidget = null;
    }
    
    // Модальные окна
    showWidgetModal() {
        this.widgetModal.style.display = 'block';
    }
    
    showSettingsModal(widget) {
        this.currentEditingWidget = widget;
        const type = widget.dataset.widgetType;
        const config = JSON.parse(widget.dataset.config || '{}');
        
        document.getElementById('settingsTitle').textContent = `Настройки: ${WIDGET_DESCRIPTIONS[type].title}`;
        this.settingsContent.innerHTML = this.createSettingsForm(type, config);
        this.settingsModal.style.display = 'block';
    }
    
    hideAllModals() {
        this.widgetModal.style.display = 'none';
        this.settingsModal.style.display = 'none';
        this.currentEditingWidget = null;
    }
    
    // Заполнить модальное окно вариантами виджетов
    populateWidgetsModal() {
        this.widgetsGrid.innerHTML = '';
        
        Object.entries(WIDGET_DESCRIPTIONS).forEach(([type, desc]) => {
            const widgetOption = document.createElement('div');
            widgetOption.className = 'widget-option';
            widgetOption.innerHTML = `
                <div class="widget-option-icon">${desc.icon}</div>
                <div class="widget-option-title">${desc.title}</div>
                <div class="widget-option-desc">${desc.description}</div>
            `;
            
            widgetOption.addEventListener('click', () => {
                this.addSpecificWidget(type);
                this.hideAllModals();
            });
            
            this.widgetsGrid.appendChild(widgetOption);
        });
    }
    
    // Создание виджета определенного типа
    createWidget(type, config = null) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.widgetType = type;
        card.dataset.widgetId = Date.now();
        card.draggable = true;
        
        // Устанавливаем конфигурацию по умолчанию или переданную
        const defaultConfig = API_CONFIG[type]?.defaultConfig || {};
        card.dataset.config = JSON.stringify(config || defaultConfig);
        
        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';
        
        const cardTitle = document.createElement('div');
        cardTitle.className = 'card-title';
        cardTitle.textContent = this.getWidgetTitle(type, card.dataset.config);
        
        const cardControls = document.createElement('div');
        cardControls.className = 'card-controls';
        
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'settings-btn';
        settingsBtn.innerHTML = '⚙️';
        settingsBtn.title = 'Настройки виджета';
        
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'refresh-btn';
        refreshBtn.innerHTML = '🔄';
        refreshBtn.title = 'Обновить виджет';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Удалить виджет';
        
        cardControls.appendChild(settingsBtn);
        cardControls.appendChild(refreshBtn);
        cardControls.appendChild(deleteBtn);
        cardHeader.appendChild(cardTitle);
        cardHeader.appendChild(cardControls);
        card.appendChild(cardHeader);
        
        // Добавляем контент с индикатором загрузки
        this.showLoading(card);
        
        // Загружаем данные
        this.loadWidgetData(card, type);
        
        // Обработчики событий
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showSettingsModal(card);
        });
        
        refreshBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.refreshWidget(card);
        });
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteWidget(card);
        });
        
        return card;
    }
    
    // Создание формы настроек
    createSettingsForm(type, config) {
        switch (type) {
            case 'weather':
                return `
                    <div class="form-group">
                        <label for="weatherCity">Город:</label>
                        <select id="weatherCity" class="form-control">
                            ${Object.keys(CITIES).map(city => `
                                <option value="${city}" ${config.city === city ? 'selected' : ''}>${city}</option>
                            `).join('')}
                        </select>
                    </div>
                `;
                
            case 'crypto':
                const cryptos = ['bitcoin', 'ethereum', 'litecoin', 'cardano', 'dogecoin'];
                return `
                    <div class="form-group">
                        <label>Криптовалюты:</label>
                        <div class="checkbox-group">
                            ${cryptos.map(crypto => `
                                <label class="checkbox-label">
                                    <input type="checkbox" value="${crypto}" 
                                        ${(config.cryptos || []).includes(crypto) ? 'checked' : ''}>
                                    ${crypto.charAt(0).toUpperCase() + crypto.slice(1)}
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `;
                
            case 'stock':
                return `
                    <div class="form-group">
                        <label for="stockSymbol">Символ акции:</label>
                        <input type="text" id="stockSymbol" class="form-control" 
                            value="${config.symbol || 'IBM'}" placeholder="Например: IBM, AAPL">
                    </div>
                `;
                
            case 'github':
                return `
                    <div class="form-group">
                        <label for="githubUsername">Имя пользователя GitHub:</label>
                        <input type="text" id="githubUsername" class="form-control" 
                            value="${config.username || 'torvalds'}" placeholder="Например: torvalds">
                    </div>
                `;
                
            case 'movie':
                return `
                    <div class="form-group">
                        <label for="movieSelect">Фильм:</label>
                        <select id="movieSelect" class="form-control">
                            ${Object.entries(POPULAR_MOVIES).map(([id, title]) => `
                                <option value="${id}" ${config.movieId === id ? 'selected' : ''}>${title}</option>
                            `).join('')}
                        </select>
                    </div>
                `;
                
            default:
                return `<p>Настройки для этого виджета отсутствуют.</p>`;
        }
    }
    
    // Сохранение настроек
    saveSettings() {
        if (!this.currentEditingWidget) return;
        
        const type = this.currentEditingWidget.dataset.widgetType;
        const currentConfig = JSON.parse(this.currentEditingWidget.dataset.config);
        let newConfig = { ...currentConfig };
        
        switch (type) {
            case 'weather':
                const selectedCity = document.getElementById('weatherCity').value;
                newConfig.city = selectedCity;
                newConfig.latitude = CITIES[selectedCity].lat;
                newConfig.longitude = CITIES[selectedCity].lon;
                break;
                
            case 'crypto':
                const selectedCryptos = Array.from(document.querySelectorAll('#settingsContent input[type="checkbox"]:checked'))
                    .map(checkbox => checkbox.value);
                newConfig.cryptos = selectedCryptos;
                break;
                
            case 'stock':
                newConfig.symbol = document.getElementById('stockSymbol').value.toUpperCase();
                break;
                
            case 'github':
                newConfig.username = document.getElementById('githubUsername').value;
                break;
                
            case 'movie':
                const selectedMovieId = document.getElementById('movieSelect').value;
                newConfig.movieId = selectedMovieId;
                newConfig.title = POPULAR_MOVIES[selectedMovieId];
                break;
        }
        
        this.currentEditingWidget.dataset.config = JSON.stringify(newConfig);
        this.currentEditingWidget.querySelector('.card-title').textContent = this.getWidgetTitle(type, this.currentEditingWidget.dataset.config);
        this.refreshWidget(this.currentEditingWidget);
        this.hideAllModals();
        this.saveToStorage();
    }
    
    // Получить заголовок виджета с учетом конфигурации
    getWidgetTitle(type, configStr) {
        const config = JSON.parse(configStr);
        const baseTitle = WIDGET_DESCRIPTIONS[type].title;
        
        switch (type) {
            case 'weather':
                return `${baseTitle} (${config.city})`;
            case 'crypto':
                return `${baseTitle} (${config.cryptos.length} валют)`;
            case 'stock':
                return `${baseTitle} (${config.symbol})`;
            case 'github':
                return `${baseTitle} (${config.username})`;
            case 'movie':
                return `${baseTitle} (${config.title})`;
            default:
                return baseTitle;
        }
    }
    
    // Загрузка данных виджета
    async loadWidgetData(card, type) {
        try {
            this.showLoading(card);
            
            const config = API_CONFIG[type];
            const widgetConfig = JSON.parse(card.dataset.config);
            
            if (type === 'clock') {
                // Часы обновляются локально
                this.showWidgetContent(card, type, config.parser());
                this.startClock(card);
                return;
            }
            
            // Для демо-режима используем fallback данные
            if (config.fallbackData && (!config.url || (typeof config.url === 'string' && config.url.includes('your_api_key')))) {
                this.showWidgetContent(card, type, config.parser(config.fallbackData));
                return;
            }
            
            const url = typeof config.url === 'function' ? config.url(widgetConfig) : config.url;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const widgetData = config.parser(data);
            
            this.showWidgetContent(card, type, widgetData);
            
        } catch (error) {
            console.error('Error loading widget data:', error);
            this.showError(card, type);
        }
    }
    
    // Запуск часов (обновление каждую секунду)
    startClock(card) {
        setInterval(() => {
            const data = API_CONFIG.clock.parser();
            this.showWidgetContent(card, 'clock', data);
        }, 1000);
    }
    
    // Показать индикатор загрузки
    showLoading(card) {
        const content = document.createElement('div');
        content.className = 'card-content loading';
        content.innerHTML = `
            <div class="spinner"></div>
            <div>Загрузка данных...</div>
        `;
        
        this.replaceContent(card, content);
    }
    
    // Показать содержимое виджета
    showWidgetContent(card, type, data) {
        const content = document.createElement('div');
        content.className = 'card-content widget-content';
        
        switch (type) {
            case 'weather':
                content.innerHTML = this.createWeatherWidget(data);
                break;
            case 'user':
                content.innerHTML = this.createUserWidget(data);
                break;
            case 'crypto':
                content.innerHTML = this.createCryptoWidget(data);
                break;
            case 'stock':
                content.innerHTML = this.createStockWidget(data);
                break;
            case 'joke':
                content.innerHTML = this.createJokeWidget(data);
                break;
            case 'fact':
                content.innerHTML = this.createFactWidget(data);
                break;
            case 'advice':
                content.innerHTML = this.createAdviceWidget(data);
                break;
            case 'cat':
                content.innerHTML = this.createCatWidget(data);
                break;
            case 'dog':
                content.innerHTML = this.createDogWidget(data);
                break;
            case 'clock':
                content.innerHTML = this.createClockWidget(data);
                break;
            case 'github':
                content.innerHTML = this.createGitHubWidget(data);
                break;
            case 'movie':
                content.innerHTML = this.createMovieWidget(data);
                break;
        }
        
        this.replaceContent(card, content);
    }
    
    // Показать ошибку
    showError(card, type) {
        const content = document.createElement('div');
        content.className = 'card-content error';
        content.innerHTML = `
            <div class="error-icon">⚠️</div>
            <div>Ошибка загрузки данных</div>
            <button class="retry-btn" onclick="dashboard.retryWidget(this.parentNode.parentNode)">Повторить</button>
        `;
        
        this.replaceContent(card, content);
    }
    
    // Заменить содержимое карточки
    replaceContent(card, newContent) {
        const oldContent = card.querySelector('.card-content');
        if (oldContent) {
            card.replaceChild(newContent, oldContent);
        } else {
            card.appendChild(newContent);
        }
    }
    
    // Создание виджетов
    createWeatherWidget(data) {
        return `
            <div class="weather-widget">
                <div class="weather-icon">${data.icon}</div>
                <div class="weather-temp">${data.temperature}</div>
                <div class="weather-desc">${data.description}</div>
                <div class="weather-details">
                    ${data.details.map(detail => `
                        <div class="weather-detail">
                            <span>${detail.label}</span>
                            <span>${detail.value}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    createUserWidget(data) {
        return `
            <div class="user-widget">
                <img src="${data.avatar}" alt="Avatar" class="user-avatar">
                <div class="user-name">${data.name}</div>
                <div class="user-email">${data.email}</div>
                <div class="user-location">${data.location}</div>
            </div>
        `;
    }
    
    createCryptoWidget(data) {
        return `
            <div class="crypto-widget">
                ${Object.values(data).map(crypto => `
                    <div class="crypto-item" style="margin-bottom: 15px;">
                        <div>${crypto.symbol}</div>
                        <div class="crypto-price">${crypto.price}</div>
                        <div class="crypto-change ${crypto.change >= 0 ? 'positive' : 'negative'}">
                            ${crypto.change >= 0 ? '↑' : '↓'} ${Math.abs(crypto.change)}%
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    createStockWidget(data) {
        const isPositive = parseFloat(data.change) >= 0;
        return `
            <div class="stock-widget">
                <div class="stock-symbol">${data.symbol}</div>
                <div class="stock-price">$${data.price}</div>
                <div class="stock-change ${isPositive ? 'positive' : 'negative'}">
                    ${isPositive ? '↑' : '↓'} ${Math.abs(parseFloat(data.change))} (${data.changePercent})
                </div>
            </div>
        `;
    }
    
    createJokeWidget(data) {
        return `
            <div class="joke-widget">
                <div class="joke-text">${data.joke}</div>
            </div>
        `;
    }
    
    createFactWidget(data) {
        return `
            <div class="fact-widget">
                <div class="fact-text">${data.fact}</div>
            </div>
        `;
    }
    
    createAdviceWidget(data) {
        return `
            <div class="advice-widget">
                <div class="advice-text">${data.advice}</div>
            </div>
        `;
    }
    
    createCatWidget(data) {
        return `
            <div class="cat-widget">
                <img src="${data.image}" alt="Cat" class="pet-image">
                <div>Случайный котик 🐱</div>
            </div>
        `;
    }
    
    createDogWidget(data) {
        return `
            <div class="dog-widget">
                <img src="${data.image}" alt="Dog" class="pet-image">
                <div>Случайная собачка 🐶</div>
            </div>
        `;
    }
    
    createClockWidget(data) {
        return `
            <div class="clock-widget">
                <div class="clock-time">${data.time}</div>
                <div class="clock-date">${data.date}</div>
            </div>
        `;
    }
    
    createGitHubWidget(data) {
        return `
            <div class="github-widget">
                <img src="${data.avatar}" alt="${data.username}" class="github-avatar">
                <div class="github-username">${data.username}</div>
                <div class="github-name">${data.name}</div>
                <div class="github-stats">
                    <div class="github-stat">
                        <div class="github-stat-value">${data.followers}</div>
                        <div class="github-stat-label">Подписчики</div>
                    </div>
                    <div class="github-stat">
                        <div class="github-stat-value">${data.following}</div>
                        <div class="github-stat-label">Подписки</div>
                    </div>
                    <div class="github-stat">
                        <div class="github-stat-value">${data.repos}</div>
                        <div class="github-stat-label">Репозитории</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    createMovieWidget(data) {
        const posterHtml = data.poster ? 
            `<img src="${data.poster}" alt="${data.title}" class="movie-poster">` :
            '<div class="movie-poster" style="background: #eee; display: flex; align-items: center; justify-content: center; color: #999;">No Image</div>';
        
        return `
            <div class="movie-widget">
                ${posterHtml}
                <div class="movie-title">${data.title}</div>
                <div class="movie-year">${data.year}</div>
                <div class="movie-rating">⭐ ${data.rating}/10</div>
                <div class="movie-info">${data.genre} • ${data.runtime}</div>
            </div>
        `;
    }
    
    // Добавить конкретный виджет
    addSpecificWidget(type) {
        const emptyCards = this.matrix.querySelectorAll('.empty-card');
        if (emptyCards.length > 0) {
            const newWidget = this.createWidget(type);
            this.matrix.replaceChild(newWidget, emptyCards[0]);
            this.updateEmptyCards();
            this.saveToStorage();
        } else {
            alert('Достигнуто максимальное количество виджетов (9)');
        }
    }
    
    // Удалить виджет
    deleteWidget(card) {
        if (confirm('Вы уверены, что хотите удалить этот виджет?')) {
            card.remove();
            this.updateEmptyCards();
            this.saveToStorage();
        }
    }
    
    // Обновить виджет
    refreshWidget(card) {
        const type = card.dataset.widgetType;
        this.loadWidgetData(card, type);
    }
    
    // Повторить загрузку виджета
    retryWidget(card) {
        this.refreshWidget(card);
    }
    
    // Обновить все виджеты
    refreshAll() {
        const widgets = this.matrix.querySelectorAll('.card:not(.empty-card)');
        widgets.forEach(widget => {
            this.refreshWidget(widget);
        });
    }
    
    // Создать пустую карточку
    createEmptyCard() {
        const card = document.createElement('div');
        card.className = 'card empty-card';
        
        const content = document.createElement('div');
        content.className = 'card-content';
        content.innerHTML = `
            <div class="empty-icon">➕</div>
            <span>Нажмите чтобы добавить виджет</span>
        `;
        
        card.appendChild(content);
        
        card.addEventListener('click', () => {
            this.showWidgetModal();
        });
        
        return card;
    }
    
    // Обновить пустые карточки
    updateEmptyCards() {
        const widgets = this.matrix.querySelectorAll('.card:not(.empty-card)');
        const emptyCards = this.matrix.querySelectorAll('.empty-card');
        
        emptyCards.forEach(card => card.remove());
        
        const totalSlots = 9;
        const emptySlots = totalSlots - widgets.length;
        
        for (let i = 0; i < emptySlots; i++) {
            this.matrix.appendChild(this.createEmptyCard());
        }
    }
    
    // Сохранить в localStorage
    saveToStorage() {
        const widgets = Array.from(this.matrix.querySelectorAll('.card:not(.empty-card)'));
        const config = {
            version: '1.0',
            savedAt: new Date().toISOString(),
            widgets: widgets.map(card => ({
                type: card.dataset.widgetType,
                id: card.dataset.widgetId,
                config: card.dataset.config
            }))
        };
        
        localStorage.setItem('dashboardConfig', JSON.stringify(config));
        console.log('Конфигурация сохранена в localStorage');
    }
    
    // Загрузить из localStorage
    loadFromStorage() {
        const savedConfig = localStorage.getItem('dashboardConfig');
        
        if (savedConfig) {
            try {
                const config = JSON.parse(savedConfig);
                
                if (config.version === '1.0' && Array.isArray(config.widgets)) {
                    this.matrix.innerHTML = '';
                    
                    config.widgets.forEach(widgetData => {
                        const widget = this.createWidget(widgetData.type, JSON.parse(widgetData.config));
                        widget.dataset.widgetId = widgetData.id;
                        this.matrix.appendChild(widget);
                    });
                    
                    this.updateEmptyCards();
                    console.log('Конфигурация загружена из localStorage');
                    return;
                }
            } catch (error) {
                console.error('Error loading saved config:', error);
            }
        }
        
        // Если нет сохраненной конфигурации, создаем демо
        this.createDemoWidgets();
    }
    
    // Создать демо-виджеты
    createDemoWidgets() {
        const demoWidgets = ['weather', 'clock', 'github'];
        demoWidgets.forEach(type => {
            this.matrix.appendChild(this.createWidget(type));
        });
        this.updateEmptyCards();
        this.saveToStorage();
    }
    
    // Экспорт данных
    exportData() {
        const widgets = this.matrix.querySelectorAll('.card:not(.empty-card)');
        const data = {
            exportedAt: new Date().toISOString(),
            version: '1.0',
            totalWidgets: widgets.length,
            widgets: Array.from(widgets).map(card => ({
                type: card.dataset.widgetType,
                id: card.dataset.widgetId,
                config: card.dataset.config
            }))
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `dashboard-export-${new Date().getTime()}.json`;
        link.click();
        
        alert(`Экспортировано ${widgets.length} виджетов`);
    }
    
    // Импорт данных
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.version !== '1.0') {
                    throw new Error('Неверная версия файла');
                }
                
                if (!Array.isArray(data.widgets)) {
                    throw new Error('Неверный формат файла');
                }
                
                // Очищаем текущую панель
                this.matrix.innerHTML = '';
                
                // Создаем виджеты из импортированных данных
                data.widgets.forEach(widgetData => {
                    const widget = this.createWidget(widgetData.type, JSON.parse(widgetData.config));
                    widget.dataset.widgetId = widgetData.id;
                    this.matrix.appendChild(widget);
                });
                
                this.updateEmptyCards();
                this.importFile.value = '';
                this.saveToStorage();
                
                alert(`Успешно импортировано ${data.widgets.length} виджетов`);
                
            } catch (error) {
                console.error('Error importing data:', error);
                alert('Ошибка при импорте файла: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    }
}

// Инициализация dashboard
const dashboard = new Dashboard();