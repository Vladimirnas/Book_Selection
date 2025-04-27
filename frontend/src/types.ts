export interface Book {
  id: number | null;
  title: string;
  author: string;
  genre: string | null;
  year: number;
  cover?: string;
  coverUrl?: string;
  description?: string;
  summary?: string;
  source?: string;
  sourceUrl?: string;
  parsedAt?: string | null;
  sources?: BookSource[];
}

export interface BookSource {
  source: string;
  sourceUrl: string;
}

export type Genre = 'Роман' | 'Фантастика' | 'Детектив' | 'Научно-популярное' | 'Приключения' | 'Поэзия' | 'Биография';

export interface FilterOptions {
  title?: string;
  author?: string;
  genre?: string;
} 