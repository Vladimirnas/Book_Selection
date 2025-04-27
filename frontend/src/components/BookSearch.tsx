import React, { useState } from 'react';
import { parseBooks } from '../services/api';
import { Book } from '../types';

interface BookSearchProps {
  onBooksFound: (books: Book[]) => void;
}

const BookSearch: React.FC<BookSearchProps> = ({ onBooksFound }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [parsingStage, setParsingStage] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Пожалуйста, введите поисковый запрос');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setMessage('Идет поиск и парсинг книг...');
    setParsingStage('Отправка запроса к серверу...');
    
    try {
      // Небольшая задержка, чтобы пользователь увидел статус
      setTimeout(() => setParsingStage('Поиск книг по названию...'), 300);
      setTimeout(() => setParsingStage('Загрузка информации о книгах...'), 1500);
      setTimeout(() => setParsingStage('Сохранение в базу данных...'), 3000);
      
      const books = await parseBooks(query);
      
      // Показываем итоговый результат
      setTimeout(() => {
        setParsingStage(null);
        
        if (books.length === 0) {
          setMessage('По вашему запросу книги не найдены');
        } else {
          setMessage(`Найдено и добавлено в базу данных книг: ${books.length}`);
          onBooksFound(books);
        }
        
        setIsLoading(false);
      }, 4000);
    } catch (err) {
      setParsingStage(null);
      setError('Произошла ошибка при поиске и парсинге книг');
      console.error('Ошибка поиска:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6 p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Поиск и парсинг книг</h2>
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введите название книги для поиска"
          className="flex-grow px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Поиск...' : 'Найти и добавить книгу'}
        </button>
      </form>
      
      {error && (
        <div className="mt-3 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      
      {isLoading && parsingStage && (
        <div className="mt-3 p-3 bg-blue-50 text-blue-800 rounded">
          <div className="flex items-center">
            <div className="mr-3">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <span>{parsingStage}</span>
          </div>
        </div>
      )}
      
      {message && !error && !isLoading && (
        <div className="mt-3 p-3 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}
      
      <p className="mt-2 text-sm text-gray-600">
        Введите название книги для поиска по OpenLibrary API. 
        Система найдет книги, загрузит подробную информацию, сохранит в базу данных и добавит в список.
      </p>
    </div>
  );
};

export default BookSearch; 