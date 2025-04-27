import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 mr-3" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                />
              </svg>
              <h1 className="text-2xl font-bold">Selection Books</h1>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`hover:text-white/80 transition-colors ${isActive('/') ? 'font-semibold underline underline-offset-4' : ''}`}
            >
              Главная
            </Link>
            <Link 
              to="/ai-recommender" 
              className={`hover:text-white/80 transition-colors ${isActive('/ai-recommender') ? 'font-semibold underline underline-offset-4' : ''}`}
            >
              AI рекомендатель
            </Link>
            <Link 
              to="/new" 
              className={`hover:text-white/80 transition-colors ${isActive('/new') ? 'font-semibold underline underline-offset-4' : ''}`}
            >
              Новинки
            </Link>
            <div className="ml-6 pl-6 border-l border-white/20 flex items-center space-x-4">
              <a href="mailto:info@selectionbooks.ru" className="flex items-center hover:text-white/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">info@selectionbooks.ru</span>
              </a>
              <a href="tel:+78001234567" className="flex items-center hover:text-white/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm">+7 (800) 123-45-67</span>
              </a>
            </div>
          </div>
          
          <button 
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="mt-4 pb-2 space-y-3 md:hidden">
            <Link 
              to="/"
              className={`block hover:text-white/80 transition-colors ${isActive('/') ? 'font-semibold' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Главная
            </Link>
            <Link 
              to="/ai-recommender"
              className={`block hover:text-white/80 transition-colors ${isActive('/ai-recommender') ? 'font-semibold' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              AI рекомендатель
            </Link>
            <Link 
              to="/new"
              className={`block hover:text-white/80 transition-colors ${isActive('/new') ? 'font-semibold' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Новинки
            </Link>
            <div className="pt-3 mt-3 border-t border-white/20 space-y-2">
              <a 
                href="mailto:info@selectionbooks.ru" 
                className="flex items-center hover:text-white/80 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@selectionbooks.ru
              </a>
              <a 
                href="tel:+78001234567" 
                className="flex items-center hover:text-white/80 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +7 (800) 123-45-67
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 