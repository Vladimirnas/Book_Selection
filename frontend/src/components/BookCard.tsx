import { Link } from 'react-router-dom';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  return (
    <div className="book-card h-full flex flex-col">
      <div className="relative pb-[140%] overflow-hidden">
        <img
          src={book.coverUrl || book.cover || '/placeholder-book.png'}
          alt={`Обложка книги "${book.title}"`}
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>
      <div className="book-info flex-grow flex flex-col">
        <h3 className="book-title line-clamp-2 min-h-[2.5rem]">{book.title}</h3>
        <p className="book-author line-clamp-1">{book.author}</p>
        <div className="flex justify-between items-center mt-auto pt-2">
          <span className="book-genre">{book.genre || 'Не указан'}</span>
          <span className="text-xs text-gray-500">{book.year}</span>
        </div>
        {book.sources && book.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {book.sources.map((source, index) => (
              <a 
                key={index} 
                href={source.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-full text-gray-700 transition-colors"
              >
                {source.source}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard; 