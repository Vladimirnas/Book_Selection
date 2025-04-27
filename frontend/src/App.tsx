import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { Book, FilterOptions } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Filters from './components/Filters';
import BookGrid from './components/BookGrid';
import BookDetail from './components/BookDetail';
import FeaturedBooks from './components/FeaturedBooks';
import AIAssistant from './components/AIAssistant';
import AIRecommender from './components/AIRecommender';
import { fetchBooks, checkApiHealth } from './services/api';

// Компонент для отображения сообщения об ошибке API
const ApiErrorPage = () => {
  return (
    <main className="flex-grow bg-background">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Ошибка подключения к API</h1>
        <p className="text-lg mb-8">
          Не удалось подключиться к серверу API. Пожалуйста, убедитесь, что сервер запущен и доступен.
        </p>
        <div className="bg-yellow-100 p-4 rounded-lg max-w-xl mx-auto">
          <h2 className="font-bold mb-2">Проверьте следующее:</h2>
          <ul className="text-left list-disc pl-5">
            <li>Сервер catalog-service запущен</li>
            <li>Сервер доступен по адресу <code className="bg-gray-200 px-1">http://localhost:8081</code></li>
            <li>Отсутствуют ошибки в консоли сервера</li>
          </ul>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/80 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    </main>
  );
};

function HomePage() {
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    title: '',
    author: '',
    genre: '',
  });

  // Загрузка всех книг с сервера
  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await fetchBooks();
      setAllBooks(data);
      setFilteredBooks(data);
    } catch (err) {
      console.error('Ошибка при загрузке книг:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // Применяем фильтры к загруженным книгам
  useEffect(() => {
    let result = [...allBooks];

    // Фильтр по названию
    if (filters.title && filters.title.length > 0) {
      result = result.filter(book => 
        book.title.toLowerCase().includes(filters.title?.toLowerCase() || '')
      );
    }

    // Фильтр по автору
    if (filters.author && filters.author.length > 0) {
      result = result.filter(book => 
        book.author.toLowerCase().includes(filters.author?.toLowerCase() || '')
      );
    }

    // Фильтр по жанру
    if (filters.genre) {
      result = result.filter(book => book.genre === filters.genre);
    }

    setFilteredBooks(result);
  }, [filters, allBooks]);

  // Обработчик изменения фильтров
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <>
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 pt-4 pb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/5 lg:w-1/6">
              <Filters 
                onFilterChange={handleFilterChange} 
                onRefresh={loadBooks}
              />
            </div>
            
            <div className="md:w-4/5 lg:w-5/6">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <BookGrid books={filteredBooks} />
              )}
            </div>
          </div>
          
          <FeaturedBooks books={allBooks} />
        </div>
      </main>
    </>
  );
}

function CatalogPage() {
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    title: '',
    author: '',
    genre: '',
  });

  // Загрузка книг
  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await fetchBooks(filters);
      setFilteredBooks(data);
      
      // Загружаем все книги для локальной фильтрации
      if (Object.values(filters).every(v => !v)) {
        setAllBooks(data);
      }
    } catch (err) {
      console.error('Ошибка при загрузке книг:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [filters]);

  // Обработчик изменения фильтров
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <main className="flex-grow bg-background">
      <div className="container mx-auto px-4 pt-4 pb-8">
        <h1 className="text-2xl font-bold mb-6">Каталог книг</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/5 lg:w-1/6">
            <Filters 
              onFilterChange={handleFilterChange} 
              onRefresh={loadBooks}
            />
          </div>
          
          <div className="md:w-4/5 lg:w-5/6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <BookGrid books={filteredBooks} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function NewBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Загрузка новых книг
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks();
        // Сортировка по году в обратном порядке
        const sortedBooks = [...data].sort((a, b) => b.year - a.year);
        setBooks(sortedBooks);
      } catch (err) {
        console.error('Ошибка при загрузке книг:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadBooks();
  }, []);

  return (
    <main className="flex-grow bg-background">
      <div className="container mx-auto px-4 pt-4 pb-8">
        <h1 className="text-2xl font-bold mb-6">Новинки</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <BookGrid books={books} />
        )}
      </div>
    </main>
  );
}

function AppContent() {
  const location = useLocation();
  const showAssistant = location.pathname !== '/ai-recommender';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/ai-recommender" element={<AIRecommender />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/new" element={<NewBooksPage />} />
      </Routes>
      
      {showAssistant && <AIAssistant />}
      
      <Footer />
    </div>
  );
}

function App() {
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkApi = async () => {
      try {
        setChecking(true);
        const available = await checkApiHealth();
        setApiAvailable(available);
      } catch (error) {
        console.error('Ошибка при проверке API:', error);
        setApiAvailable(false);
      } finally {
        setChecking(false);
      }
    };

    checkApi();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Подключение к серверу API...</p>
        </div>
      </div>
    );
  }

  if (apiAvailable === false) {
    return <ApiErrorPage />;
  }

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
