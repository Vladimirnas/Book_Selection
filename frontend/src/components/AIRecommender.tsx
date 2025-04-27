import { useState, useRef, useEffect } from 'react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const AIRecommender = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Message[]>([
    { 
      sender: 'ai', 
      text: 'Здравствуйте! Я ваш книжный AI-рекомендатель. Расскажите, какие книги вам нравятся, и я помогу подобрать что-то интересное для чтения. Вы также можете задать мне вопросы о книгах, жанрах или авторах.' 
    },
  ]);
  
  const chatRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Добавляем сообщение пользователя в чат
    const newChat = [...chat, { sender: 'user', text: message }];
    setChat(newChat);
    setIsLoading(true);
    
    // Имитация ответа AI (в реальном приложении здесь был бы запрос к API)
    setTimeout(() => {
      let response = '';
      const lowerMsg = message.toLowerCase();
      
      if (lowerMsg.includes('классик') || lowerMsg.includes('классическ')) {
        response = 'Из классической литературы могу порекомендовать произведения Толстого, Достоевского, Пушкина. Если вам нравится зарубежная классика, обратите внимание на Дюма, Хемингуэя, Ремарка. Что именно вас интересует в классической литературе?';
      } else if (lowerMsg.includes('фантастик') || lowerMsg.includes('фэнтези')) {
        response = 'В жанре фантастики и фэнтези могу порекомендовать "Мастера и Маргариту" Булгакова, серию книг о Гарри Поттере, "1984" Оруэлла. Какой поджанр фантастики вам ближе: научная фантастика, фэнтези, антиутопия?';
      } else if (lowerMsg.includes('детектив')) {
        response = 'Любителям детективов рекомендую книги Агаты Кристи, особенно серию об Эркюле Пуаро, а также произведения Артура Конан Дойла о Шерлоке Холмсе. Из современных авторов интересны детективы Ю Несбё, Тесс Герритсен.';
      } else if (lowerMsg.includes('научн') || lowerMsg.includes('популярн')) {
        response = 'В жанре научно-популярной литературы рекомендую "Краткую историю времени" Стивена Хокинга, "Сапиенс" Юваля Ноя Харари. Это захватывающие книги о науке, доступно объясняющие сложные концепции.';
      } else if (lowerMsg.includes('что почитать') || lowerMsg.includes('посоветуй') || lowerMsg.includes('рекомендуй')) {
        response = 'Для рекомендации книг мне нужно больше информации о ваших предпочтениях. Какие жанры вы предпочитаете? Какие книги вам понравились в прошлом? Есть ли темы, которые вас особенно интересуют?';
      } else {
        response = 'Интересный вопрос! Возможно, я смогу дать более точную рекомендацию, если вы расскажете о своих любимых книгах или жанрах. Какая последняя книга произвела на вас впечатление?';
      }
      
      setChat([...newChat, { sender: 'ai', text: response }]);
      setIsLoading(false);
    }, 1500);

    setMessage('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">AI рекомендатель книг</h1>
        <p className="text-gray-600 mb-8 text-center">
          Задайте вопрос нашему AI-ассистенту, чтобы получить персональные рекомендации книг
        </p>
        
        <div className="bg-white rounded-lg shadow-md">
          <div 
            ref={chatRef}
            className="h-[400px] overflow-y-auto p-4 space-y-4"
          >
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.sender === 'user' 
                    ? 'ml-auto bg-primary text-white' 
                    : 'mr-auto bg-gray-100 text-gray-800'
                } rounded-lg p-3 max-w-[80%]`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="mr-auto bg-gray-100 text-gray-800 rounded-lg p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Спросите о книгах, жанрах или авторах..."
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-secondary transition-colors disabled:bg-gray-400"
              disabled={isLoading || !message.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-md p-5">
          <h2 className="text-xl font-bold mb-4">Популярные запросы</h2>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setMessage('Посоветуйте книги в жанре фантастики')}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
            >
              Фантастика
            </button>
            <button 
              onClick={() => setMessage('Что почитать из классической литературы?')}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
            >
              Классика
            </button>
            <button 
              onClick={() => setMessage('Порекомендуйте детективы')}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
            >
              Детективы
            </button>
            <button 
              onClick={() => setMessage('Интересные научно-популярные книги')}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
            >
              Научпоп
            </button>
            <button 
              onClick={() => setMessage('Что сейчас популярно среди читателей?')}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
            >
              Популярное
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommender; 