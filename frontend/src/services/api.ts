import { Book, FilterOptions } from '../types';

const API_URL = 'http://localhost:8081/api/v1';

// Проверка доступности сервера
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    console.log('Проверка соединения с API...');
    const response = await fetch(`${API_URL}/books`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      console.error('API недоступен:', response.status);
      return false;
    }

    console.log('API доступен');
    return true;
  } catch (error) {
    console.error('Ошибка при проверке API:', error);
    return false;
  }
};

export const fetchBooks = async (filters?: FilterOptions): Promise<Book[]> => {
  try {
    let url = `${API_URL}/books`;

    if (filters) {
      const params = new URLSearchParams();
      if (filters.title) params.append('title', filters.title);
      if (filters.author) params.append('author', filters.author);
      if (filters.genre) params.append('genre', filters.genre);
      if (params.toString()) url += `?${params.toString()}`;
    }

    console.log('Запрос к API:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Ошибка при получении списка книг: ${response.status}`);
    }

    const books = await response.json();
    console.log('Получено книг:', books.length);

    return books.map((book: any) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      year: book.publishYear ?? book.year ?? null,
      coverUrl: book.coverUrl ?? null,
      summary: book.summary ?? null,
      source: book.source ?? 'unknown',
      sourceUrl: book.sourceUrl ?? '',
      parsedAt: book.parsedAt ?? null
    }));
  } catch (error) {
    console.error('Ошибка при получении списка книг:', error);
    return [];
  }
};

export const fetchBookById = async (id: number | string): Promise<Book | null> => {
  try {
    console.log(`Запрос книги с ID ${id}`);
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Ошибка при получении книги: ${response.status}`);
    }

    const book = await response.json();
    console.log('Получена книга:', book.title);

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      year: book.publishYear ?? book.year ?? null,
      coverUrl: book.coverUrl ?? null,
      summary: book.summary ?? null,
      source: book.source ?? 'unknown',
      sourceUrl: book.sourceUrl ?? '',
      parsedAt: book.parsedAt ?? null
    };
  } catch (error) {
    console.error(`Ошибка при получении книги с ID ${id}:`, error);
    return null;
  }
};

export const fetchGenres = async (): Promise<string[]> => {
  try {
    console.log('Запрос жанров');
    const books = await fetchBooks();
    const uniqueGenres = [...new Set(books.map(book => book.genre).filter(Boolean))] as string[];
    console.log('Получено жанров:', uniqueGenres.length);
    return uniqueGenres;
  } catch (error) {
    console.error('Ошибка при получении жанров:', error);
    return [];
  }
};

export const addBook = async (book: Omit<Book, 'id'>): Promise<Book | null> => {
  try {
    console.log('Добавление новой книги:', book.title);

    const bookDto = {
      title: book.title,
      author: book.author,
      genre: book.genre,
      publishYear: book.year ?? null,
      summary: book.summary ?? null,
      coverUrl: book.coverUrl ?? null,
      source: book.source ?? 'manual',
      sourceUrl: book.sourceUrl ?? '',
      parsedAt: book.parsedAt ?? new Date().toISOString()
    };

    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookDto)
    });

    if (!response.ok) {
      throw new Error(`Ошибка при добавлении книги: ${response.status}`);
    }

    const newBook = await response.json();
    console.log('Книга добавлена с ID:', newBook.id);

    return {
      id: newBook.id,
      title: newBook.title,
      author: newBook.author,
      genre: newBook.genre,
      year: newBook.publishYear ?? newBook.year ?? null,
      coverUrl: newBook.coverUrl ?? null,
      summary: newBook.summary ?? null,
      source: newBook.source ?? 'unknown',
      sourceUrl: newBook.sourceUrl ?? '',
      parsedAt: newBook.parsedAt ?? null
    };
  } catch (error) {
    console.error('Ошибка при добавлении книги:', error);
    return null;
  }
};

export const updateBook = async (id: number, book: Partial<Book>): Promise<Book | null> => {
  try {
    console.log(`Обновление книги с ID ${id}`);

    const bookDto: any = {};
    if (book.title !== undefined) bookDto.title = book.title;
    if (book.author !== undefined) bookDto.author = book.author;
    if (book.genre !== undefined) bookDto.genre = book.genre;
    if (book.year !== undefined) bookDto.publishYear = book.year;
    if (book.summary !== undefined) bookDto.summary = book.summary;
    if (book.coverUrl !== undefined) bookDto.coverUrl = book.coverUrl;

    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookDto)
    });

    if (!response.ok) {
      throw new Error(`Ошибка при обновлении книги: ${response.status}`);
    }

    const updatedBook = await response.json();
    console.log('Книга обновлена:', updatedBook.title);

    return {
      id: updatedBook.id,
      title: updatedBook.title,
      author: updatedBook.author,
      genre: updatedBook.genre,
      year: updatedBook.publishYear ?? updatedBook.year ?? null,
      coverUrl: updatedBook.coverUrl ?? null,
      summary: updatedBook.summary ?? null,
      source: updatedBook.source ?? 'unknown',
      sourceUrl: updatedBook.sourceUrl ?? '',
      parsedAt: updatedBook.parsedAt ?? null
    };
  } catch (error) {
    console.error(`Ошибка при обновлении книги с ID ${id}:`, error);
    return null;
  }
};

export const deleteBook = async (id: number): Promise<boolean> => {
  try {
    console.log(`Удаление книги с ID ${id}`);

    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Ошибка при удалении книги: ${response.status}`);
    }

    console.log('Книга успешно удалена');
    return true;
  } catch (error) {
    console.error(`Ошибка при удалении книги с ID ${id}:`, error);
    return false;
  }
};

export const searchBooks = async (author: string = '', title: string = ''): Promise<boolean> => {
  try {
    console.log(`Парсинг книг по автору: "${author}", названию: "${title}"`);
    
    const requestBody = {
      author: author || '',
      title: title || ''
    };
    
    console.log('Отправляемый JSON:', JSON.stringify(requestBody));
    
    const response = await fetch(`${API_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Ошибка при парсинге книг: ${response.status}`);
    }

    console.log('Парсинг книг успешно запущен');
    return true;
  } catch (error) {
    console.error('Ошибка при парсинге книг:', error);
    return false;
  }
};
