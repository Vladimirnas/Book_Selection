import { Book } from '../types';
import BookCard from './BookCard';
import { useNavigate } from 'react-router-dom';

interface BookGridProps {
  books: Book[];
}

const BookGrid = ({ books }: BookGridProps) => {
  const navigate = useNavigate();

  const handleBookClick = (bookId: number) => {
    navigate(`/book/${bookId}`);
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl text-gray-600">Нет книг, соответствующих вашему запросу</h3>
        <p className="mt-2 text-gray-500">Попробуйте изменить параметры поиска</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {books.map((book) => (
        <div 
          key={book.id} 
          onClick={() => handleBookClick(book.id)}
          className="cursor-pointer h-full"
        >
          <BookCard book={book} />
        </div>
      ))}
    </div>
  );
};

export default BookGrid; 