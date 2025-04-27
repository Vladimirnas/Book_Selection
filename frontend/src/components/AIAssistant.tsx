import { useState } from 'react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'Здравствуйте! Я ваш книжный ассистент. Могу помочь с выбором книги, ответить на вопросы о литературе или дать рекомендации. Чем могу помочь?' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Добавляем сообщение пользователя в чат
    setChat([...chat, { sender: 'user', text: message }]);
    
    // Имитация ответа AI (в реальном приложении здесь был бы запрос к API)
    setTimeout(() => {
      let response = '';
      const lowerMsg = message.toLowerCase();
      
      if (lowerMsg.includes('рекомендуй') || lowerMsg.includes('посоветуй') || lowerMsg.includes('предложи')) {
        response = 'Могу предложить несколько отличных книг: "Мастер и Маргарита" Булгакова, "1984" Оруэлла или "Три товарища" Ремарка. Что вас больше интересует: классика, современная литература или определенный жанр?';
      } else if (lowerMsg.includes('жанр') || lowerMsg.includes('категор')) {
        response = 'На нашем сайте представлены книги разных жанров: романы, фантастика, детективы, научно-популярные книги, приключения, поэзия и биографии. Какой жанр вас интересует?';
      } else if (lowerMsg.includes('поиск') || lowerMsg.includes('найти')) {
        response = 'Для поиска книг воспользуйтесь фильтрами вверху страницы. Вы можете искать по названию, году издания или жанру.';
      } else {
        response = 'Спасибо за вопрос! Не могли бы вы уточнить, что именно вас интересует в мире литературы? Я могу рассказать о конкретных книгах, жанрах или дать персональные рекомендации.';
      }
      
      setChat([...chat, { sender: 'user', text: message }, { sender: 'ai', text: response }]);
    }, 1000);

    setMessage('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white rounded-full p-4 shadow-lg hover:bg-secondary transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <h3 className="font-medium">Книжный ассистент</h3>
            <button onClick={() => setIsOpen(false)} className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto max-h-80 space-y-3">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.sender === 'user' ? 'ml-auto bg-primary text-white' : 'mr-auto bg-gray-100 text-gray-800'
                } rounded-lg p-3 max-w-[80%]`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Задайте вопрос..."
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-secondary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIAssistant; 