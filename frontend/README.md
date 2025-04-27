# Книжный API с SQLite и парсером

Проект представляет собой API для управления коллекцией книг с использованием базы данных SQLite и функционалом парсинга информации о книгах из OpenLibrary.

## Структура проекта

- `server.py` - Основной файл сервера Flask с API эндпоинтами
- `database.py` - Модуль для работы с базой данных SQLite
- `book_parser.py` - Парсер книг из OpenLibrary API
- `run.py` - Скрипт для настройки и запуска проекта
- `requirements.txt` - Зависимости проекта

## Функциональность

- REST API для управления книгами (CRUD-операции)
- Хранение данных в SQLite базе данных
- Парсинг информации о книгах из OpenLibrary API
- Фильтрация книг по заголовку, автору и жанру
- Получение списка уникальных жанров
- Экспорт данных в JSON формат

## Установка и запуск

1. Клонировать репозиторий
2. Установить зависимости:
   ```
   pip install -r requirements.txt
   ```
3. Запустить приложение:
   ```
   python run.py
   ```

## Запуск с различными параметрами

```
python run.py --setup --parse --server
```

Параметры:
- `--setup` - Выполнить начальную настройку (установка зависимостей, инициализация базы данных)
- `--parse` - Запустить парсер книг
- `--server` - Запустить веб-сервер
- `--query` - Указать запросы для парсера (например, `--query "Война и мир" "Преступление и наказание"`)
- `--limit` - Указать лимит книг для каждого запроса (по умолчанию 3)

## API Эндпоинты

- `GET /api/books` - Получить список всех книг (с опциональной фильтрацией)
- `GET /api/books/{id}` - Получить информацию о конкретной книге
- `POST /api/books` - Добавить новую книгу
- `PUT /api/books/{id}` - Обновить информацию о книге
- `DELETE /api/books/{id}` - Удалить книгу
- `GET /api/books/genres` - Получить список уникальных жанров
- `GET /api/export` - Экспортировать данные в JSON файл
- `GET /api/health` - Проверить работоспособность API

## Пример работы с API

1. Получение списка всех книг:
   ```
   GET http://localhost:5003/api/books
   ```

2. Фильтрация книг по названию:
   ```
   GET http://localhost:5003/api/books?title=война
   ```

3. Добавление новой книги:
   ```
   POST http://localhost:5003/api/books
   Content-Type: application/json

   {
     "title": "Новая книга",
     "author": "Автор книги",
     "year": 2023,
     "genre": "Роман",
     "summary": "Описание книги",
     "coverUrl": "https://example.com/cover.jpg",
     "source": "manual",
     "sourceUrl": "https://example.com/book"
   }
   ```

## Пример JSON формата книги

```json
{
  "id": 1,
  "title": "War and Peace",
  "author": "Лев Толстой",
  "year": 1864,
  "genre": "Роман",
  "summary": "Описание книги",
  "coverUrl": "https://covers.openlibrary.org/b/id/12621906-L.jpg",
  "source": "openlibrary",
  "sourceUrl": "https://openlibrary.org/works/OL267171W",
  "parsedAt": "2023-04-20T15:30:45.123456"
}
```

## Схема базы данных

```sql
CREATE TABLE books (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT NOT NULL,
    author        TEXT NOT NULL,
    publish_year  INTEGER,
    genre         TEXT,
    summary       TEXT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source_url    TEXT,
    cover_url     TEXT,
    parsed_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source        TEXT DEFAULT 'unknown'
);

CREATE UNIQUE INDEX ux_book_unique ON books (title, author, publish_year);
```
