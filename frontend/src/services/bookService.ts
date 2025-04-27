import { Book } from '../types';

const API_URL = 'http://localhost:8000/api';

export const bookService = {
  // Получение всех книг
  async getBooks(): Promise<Book[]> {
    try {
      const response = await fetch(`${API_URL}/books/`);
      if (!response.ok) {
        throw new Error('Ошибка при получении книг');
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка в getBooks:', error);
      return [];
    }
  },

  // Поиск книг по параметрам
  async searchBooks(title?: string, author?: string, genre?: string): Promise<Book[]> {
    try {
      const params = new URLSearchParams();
      if (title) params.append('title', title);
      if (author) params.append('author', author);
      if (genre) params.append('genre', genre);

      const response = await fetch(`${API_URL}/search/?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Ошибка при поиске книг');
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка в searchBooks:', error);
      return [];
    }
  },

  // Парсинг книг с OpenLibrary
  async parseOpenLibrary(query: string, limit: number = 5): Promise<Book[]> {
    try {
      const response = await fetch(
        `${API_URL}/books/parse/openlibrary/?query=${encodeURIComponent(query)}&limit=${limit}`,
        { method: 'POST' }
      );
      if (!response.ok) {
        throw new Error('Ошибка при парсинге книг');
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка в parseOpenLibrary:', error);
      return [];
    }
  },

  // Парсинг книг с GoodReads
  async parseGoodReads(query: string, limit: number = 5): Promise<Book[]> {
    try {
      const response = await fetch(
        `${API_URL}/books/parse/goodreads/?query=${encodeURIComponent(query)}&limit=${limit}`,
        { method: 'POST' }
      );
      if (!response.ok) {
        throw new Error('Ошибка при парсинге книг');
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка в parseGoodReads:', error);
      return [];
    }
  },

  // Получение книги по ID
  async getBook(id: number): Promise<Book | null> {
    try {
      const response = await fetch(`${API_URL}/books/${id}`);
      if (!response.ok) {
        throw new Error('Ошибка при получении книги');
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка в getBook:', error);
      return null;
    }
  },

  // Экспорт книг в JSON
  async exportBooksJson(): Promise<Book[]> {
    try {
      const response = await fetch(`${API_URL}/export/json/`);
      if (!response.ok) {
        throw new Error('Ошибка при экспорте книг');
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка в exportBooksJson:', error);
      return [];
    }
  }
}; 