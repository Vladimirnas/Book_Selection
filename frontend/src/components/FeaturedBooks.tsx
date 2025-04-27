import { useState } from 'react';
import { Book } from '../types';
import BookCard from './BookCard';
import { Link } from 'react-router-dom';

interface FeaturedBooksProps {
  books: Book[];
}

const FeaturedBooks = ({ books }: FeaturedBooksProps) => {
  const [activeTab, setActiveTab] = useState<'popular' | 'new' | 'classic'>('popular');

  const getFilteredBooks = () => {
    switch (activeTab) {
      case 'popular':
        // В реальном приложении здесь была бы логика выборки популярных книг
        return books.slice(0, 4);
      case 'new':
        // Имитация новых книг (сортировка по году в обратном порядке)
        return [...books].sort((a, b) => b.year - a.year).slice(0, 4);
      case 'classic':
        // Имитация классики (книги до 1950 года)
        return books.filter(book => book.year < 1950).slice(0, 4);
      default:
        return books.slice(0, 4);
    }
  };

  // Проверяем, есть ли достаточно книг для отображения
  const hasEnoughBooks = books.length >= 4;

  // Если недостаточно книг или данные загружаются, не отображаем компонент
  if (!hasEnoughBooks) {
    return null;
  }

  const filteredBooks = getFilteredBooks();

  if (filteredBooks.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setActiveTab('popular')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              activeTab === 'popular'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-200`}
          >
            Популярные
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'new'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border-t border-b border-gray-200`}
          >
            Новинки
          </button>
          <button
            onClick={() => setActiveTab('classic')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              activeTab === 'classic'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-200`}
          >
            Классика
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <Link key={book.id} to={`/book/${book.id}`} className="no-underline text-inherit">
            <BookCard book={book} />
          </Link>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Link to="/catalog" className="btn btn-primary inline-block">
          Показать больше книг
        </Link>
      </div>
    </div>
  );
};

export default FeaturedBooks; 