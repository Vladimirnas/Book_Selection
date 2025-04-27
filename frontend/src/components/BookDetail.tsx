import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Book } from '../types';
import { fetchBookById } from '../services/api';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        const data = await fetchBookById(id as string);
        setBook(data);
      } catch (err) {
        setError('Ошибка при загрузке книги');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadBook();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (error || !book) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">Книга не найдена</h2>
        <button 
          onClick={() => navigate('/')} 
          className="mt-4 btn btn-primary"
        >
          Вернуться на главную
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center text-primary mb-6 hover:underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Назад к списку
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 p-4 flex items-center justify-center">
            <div className="relative w-full max-w-xs">
              <div className="pb-[140%] relative">
                <img
                  src={book.coverUrl || book.cover || '/placeholder-book.png'}
                  alt={`Обложка книги "${book.title}"`}
                  className="absolute inset-0 w-full h-full object-contain rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{book.author}</p>
            
            <div className="flex items-center mb-6">
              <span className="book-genre mr-3">{book.genre || 'Жанр не указан'}</span>
              <span className="text-sm text-gray-500">Год издания: {book.year}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-xl font-semibold mb-3">Описание</h2>
              <p className="text-gray-700 leading-relaxed">{book.summary || book.description || 'Описание отсутствует'}</p>
            </div>

            {book.sources && book.sources.length > 0 && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h2 className="text-xl font-semibold mb-3">Источники</h2>
                <div className="flex flex-wrap gap-2">
                  {book.sources.map((source, index) => (
                    <a 
                      key={index} 
                      href={source.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md text-gray-700 transition-colors flex items-center"
                    >
                      <span className="mr-1">{source.source}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {book.parsedAt && (
              <div className="mt-4 text-sm text-gray-500">
                Добавлено: {new Date(book.parsedAt).toLocaleDateString('ru-RU')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail; 