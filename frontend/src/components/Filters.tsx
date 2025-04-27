import { useState } from 'react';
import { FilterOptions } from '../types';

interface FiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const Filters = ({ onFilterChange }: FiltersProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    title: '',
    author: '',
    genre: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = { title: '', author: '', genre: '' };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
    setMessage(null);
  };

  const handlePostSearch = async () => {
    if (!filters.title && !filters.author) {
      setMessage('Введите хотя бы название или автора');
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const response = await fetch('http://localhost:8080/api/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: filters.author,
          title: filters.title,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка запроса к серверу');
      }

      const result = await response.json();
      console.log('Ответ сервера:', result);
      setMessage('Запрос успешно отправлен!');
    } catch (error) {
      console.error('Ошибка:', error);
      setMessage('Ошибка при отправке запроса');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md text-sm space-y-4">
      <h2 className="text-lg font-semibold">Фильтры поиска</h2>

      <div>
        <label htmlFor="title" className="block text-xs font-medium text-gray-700 mb-1">
          Название книги
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={filters.title}
          onChange={handleChange}
          placeholder="Введите название"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="author" className="block text-xs font-medium text-gray-700 mb-1">
          Автор
        </label>
        <input
          type="text"
          id="author"
          name="author"
          value={filters.author}
          onChange={handleChange}
          placeholder="Введите имя автора"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="genre" className="block text-xs font-medium text-gray-700 mb-1">
          Жанр
        </label>
        <input
          type="text"
          id="genre"
          name="genre"
          value={filters.genre}
          onChange={handleChange}
          placeholder="Введите жанр"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="space-y-2 pt-2">
        <button
          onClick={handleReset}
          className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-xs font-medium transition-colors"
        >
          Сбросить фильтры
        </button>

        <button
          onClick={handlePostSearch}
          disabled={loading}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-xs font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Отправка...' : 'Парсить'}
        </button>

        {message && (
          <div className="text-center text-xs mt-2 text-gray-600">{message}</div>
        )}
      </div>
    </div>
  );
};

export default Filters;
