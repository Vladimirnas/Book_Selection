import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { fetchBooks } from '../services/api';
import BookSearch from './BookSearch';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({ title: '', author: '', genre: '' });

  useEffect(() => {
    fetchBooksData();
  }, []);

  const fetchBooksData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBooks();
      setBooks(data);
    } catch (err) {
      console.error('Ошибка при загрузке книг:', err);
      setError('Не удалось загрузить книги');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const filteredBooks = await fetchBooks({
        title: filter.title || undefined,
        author: filter.author || undefined,
        genre: filter.genre || undefined
      });
      setBooks(filteredBooks);
    } catch (err) {
      setError('Ошибка при поиске книг');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilter({ title: '', author: '', genre: '' });
    fetchBooksData();
  };

  const handleRefresh = () => {
    fetchBooksData();
  };

  const handleBooksFound = (newBooks: Book[]) => {
    if (newBooks.length > 0) {
      // Обновляем список книг, добавляя новые книги в начало списка
      setBooks(prevBooks => {
        // Создаем карту существующих ID, чтобы избежать дубликатов
        const existingIds = new Set(prevBooks.map(book => book.id));
        
        // Фильтруем только новые книги, которых еще нет в списке
        const uniqueNewBooks = newBooks.filter(book => !existingIds.has(book.id));
        
        // Объединяем новые книги с существующими
        const updatedBooks = [...uniqueNewBooks, ...prevBooks];
        
        // Сбрасываем состояние фильтра при нахождении новых книг
        if (uniqueNewBooks.length > 0) {
          setFilter({ title: '', author: '', genre: '' });
        }
        
        return updatedBooks;
      });
      
      // Показываем сообщение об успешном добавлении
      setError(null);
    }
  };

  return (
    <div>
      <BookSearch onBooksFound={handleBooksFound} />

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Список книг</h2>
          <button
            onClick={handleRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition duration-200"
          >
            Обновить
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 mb-2 text-sm">Название</label>
            <input
              type="text"
              name="title"
              value={filter.title}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-md text-sm"
              placeholder="Поиск по названию"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 text-sm">Автор</label>
            <input
              type="text"
              name="author"
              value={filter.author}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-md text-sm"
              placeholder="Поиск по автору"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 text-sm">Жанр</label>
            <input
              type="text"
              name="genre"
              value={filter.genre}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-md text-sm"
              placeholder="Поиск по жанру"
            />
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleSearch}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm flex-1 transition duration-200"
          >
            Поиск
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm transition duration-200"
          >
            Сбросить
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Загрузка книг...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Книги не найдены. Добавьте книги через парсер.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div key={book.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200">
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/200x300?text=No+Cover';
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">Нет обложки</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-1">Автор: {book.author}</p>
                  <p className="text-gray-600 text-sm mb-1">Год: {book.year || 'Неизвестно'}</p>
                  {book.genre && <p className="text-gray-600 text-sm mb-1">Жанр: {book.genre}</p>}
                  {book.summary && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                      {book.summary.length > 120 ? `${book.summary.substring(0, 120)}...` : book.summary}
                    </p>
                  )}
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Источник: {book.source}
                      {book.parsedAt && <span className="ml-1 text-xs text-gray-400">
                        • {new Date(book.parsedAt).toLocaleDateString()}
                      </span>}
                    </span>
                    {book.sourceUrl && (
                      <a
                        href={book.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 text-xs"
                      >
                        Подробнее
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList; 