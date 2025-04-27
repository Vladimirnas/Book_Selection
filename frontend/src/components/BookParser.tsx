import React, { useState } from 'react';
import { Book } from '../types';
import { bookService } from '../services/bookService';

interface BookParserProps {
  onBooksAdded?: (books: Book[]) => void;
}

const BookParser: React.FC<BookParserProps> = ({ onBooksAdded }) => {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<'openlibrary' | 'goodreads'>('openlibrary');
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedBooks, setParsedBooks] = useState<Book[]>([]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSource(e.target.value as 'openlibrary' | 'goodreads');
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(e.target.value) || 5);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) {
      setError('Введите поисковый запрос');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      let books: Book[] = [];
      
      if (source === 'openlibrary') {
        books = await bookService.parseOpenLibrary(query, limit);
      } else {
        books = await bookService.parseGoodReads(query, limit);
      }
      
      setParsedBooks(books);
      
      if (onBooksAdded) {
        onBooksAdded(books);
      }
    } catch (err) {
      setError('Ошибка при парсинге книг');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Поиск и парсинг книг</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Поисковый запрос</label>
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Например: War and Peace"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Источник</label>
            <select
              value={source}
              onChange={handleSourceChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="openlibrary">OpenLibrary</option>
              <option value="goodreads">GoodReads</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Количество</label>
            <input
              type="number"
              value={limit}
              onChange={handleLimitChange}
              min={1}
              max={20}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
        >
          {loading ? 'Загрузка...' : 'Найти и добавить книги'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {parsedBooks.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Найдено книг: {parsedBooks.length}</h3>
          <div className="space-y-4">
            {parsedBooks.map((book) => (
              <div key={book.sourceUrl} className="border rounded-md p-4 flex items-start">
                {book.coverUrl && (
                  <img 
                    src={book.coverUrl} 
                    alt={book.title} 
                    className="w-16 h-24 object-cover mr-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/100x150?text=No+Cover';
                    }}
                  />
                )}
                <div>
                  <h4 className="font-bold">{book.title}</h4>
                  <p className="text-sm text-gray-600">Автор: {book.author}</p>
                  <p className="text-sm text-gray-600">Год: {book.year}</p>
                  {book.genre && <p className="text-sm text-gray-600">Жанр: {book.genre}</p>}
                  <p className="text-xs text-gray-500 mt-1">Источник: {book.source}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookParser; 