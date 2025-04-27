import sqlite3
import os
import json
from datetime import datetime

# Путь к базе данных
DB_PATH = 'books.db'

def init_db():
    """Инициализация базы данных"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Создаем таблицу книг
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS books (
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
    )
    ''')
    
    # Создаем уникальный индекс
    cursor.execute('''
    CREATE UNIQUE INDEX IF NOT EXISTS ux_book_unique ON books (title, author, publish_year)
    ''')
    
    conn.commit()
    conn.close()

def import_data_from_json():
    """Импорт данных из JSON файла в базу данных (если файл существует)"""
    json_file = "books_data.json"
    if os.path.exists(json_file):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        with open(json_file, 'r', encoding='utf-8') as f:
            books_data = json.load(f)
            
        for book in books_data:
            try:
                # Проверяем наличие ключей и устанавливаем значения по умолчанию
                title = book['title']
                author = book['author']
                publish_year = book.get('year')
                genre = book.get('genre')
                summary = book.get('summary')
                cover_url = book.get('coverUrl')
                parsed_at = book.get('parsedAt', datetime.now().isoformat())
                
                # Обработка источников
                source = 'unknown'
                source_url = None
                
                if 'sources' in book and len(book['sources']) > 0:
                    source = book['sources'][0].get('source', 'unknown')
                    source_url = book['sources'][0].get('sourceUrl')
                
                # Вставляем данные в базу
                cursor.execute('''
                INSERT OR IGNORE INTO books (
                    title, author, publish_year, genre, summary, 
                    source_url, cover_url, parsed_at, source
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    title, author, publish_year, genre, summary,
                    source_url, cover_url, parsed_at, source
                ))
            except Exception as e:
                print(f"Ошибка при импорте книги: {e}")
                
        conn.commit()
        conn.close()

def get_all_books(title_filter=None, author_filter=None, genre_filter=None):
    """Получение списка всех книг с опциональной фильтрацией"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    query = "SELECT * FROM books"
    conditions = []
    params = []
    
    if title_filter:
        conditions.append("LOWER(title) LIKE ?")
        params.append(f"%{title_filter.lower()}%")
    
    if author_filter:
        conditions.append("LOWER(author) LIKE ?")
        params.append(f"%{author_filter.lower()}%")
    
    if genre_filter:
        conditions.append("genre = ?")
        params.append(genre_filter)
    
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    
    books = []
    for row in rows:
        book = dict(row)
        books.append(book)
    
    conn.close()
    return books

def get_book_by_id(book_id):
    """Получение книги по ID"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM books WHERE id = ?", (book_id,))
    row = cursor.fetchone()
    
    book = dict(row) if row else None
    
    conn.close()
    return book

def add_book(book_data):
    """Добавление новой книги"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    title = book_data['title']
    author = book_data['author']
    publish_year = book_data.get('year')
    genre = book_data.get('genre')
    summary = book_data.get('summary')
    cover_url = book_data.get('coverUrl')
    source = book_data.get('source', 'unknown')
    source_url = book_data.get('sourceUrl')
    parsed_at = book_data.get('parsedAt', datetime.now().isoformat())
    
    cursor.execute('''
    INSERT INTO books (
        title, author, publish_year, genre, summary, 
        source_url, cover_url, parsed_at, source
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        title, author, publish_year, genre, summary,
        source_url, cover_url, parsed_at, source
    ))
    
    last_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return get_book_by_id(last_id)

def update_book(book_id, book_data):
    """Обновление книги"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Получаем текущие данные книги
    cursor.execute("SELECT * FROM books WHERE id = ?", (book_id,))
    existing_book = cursor.fetchone()
    
    if not existing_book:
        conn.close()
        return None
    
    # Формируем запрос на обновление
    fields_to_update = []
    params = []
    
    for key, value in book_data.items():
        if key == 'title' and value:
            fields_to_update.append("title = ?")
            params.append(value)
        elif key == 'author' and value:
            fields_to_update.append("author = ?")
            params.append(value)
        elif key == 'year':
            fields_to_update.append("publish_year = ?")
            params.append(value)
        elif key == 'genre':
            fields_to_update.append("genre = ?")
            params.append(value)
        elif key == 'summary':
            fields_to_update.append("summary = ?")
            params.append(value)
        elif key == 'coverUrl':
            fields_to_update.append("cover_url = ?")
            params.append(value)
        elif key == 'source':
            fields_to_update.append("source = ?")
            params.append(value)
        elif key == 'sourceUrl':
            fields_to_update.append("source_url = ?")
            params.append(value)
    
    # Добавляем обновление updated_at
    fields_to_update.append("updated_at = CURRENT_TIMESTAMP")
    
    if fields_to_update:
        query = f"UPDATE books SET {', '.join(fields_to_update)} WHERE id = ?"
        params.append(book_id)
        
        cursor.execute(query, params)
        conn.commit()
    
    conn.close()
    return get_book_by_id(book_id)

def delete_book(book_id):
    """Удаление книги"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM books WHERE id = ?", (book_id,))
    if not cursor.fetchone():
        conn.close()
        return False
    
    cursor.execute("DELETE FROM books WHERE id = ?", (book_id,))
    conn.commit()
    conn.close()
    return True

def get_unique_genres():
    """Получение списка уникальных жанров"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT DISTINCT genre FROM books WHERE genre IS NOT NULL ORDER BY genre")
    genres = [row[0] for row in cursor.fetchall()]
    
    conn.close()
    return genres

def export_to_json(file_path="books_export.json"):
    """Экспорт данных из БД в JSON файл"""
    books = get_all_books()
    
    # Преобразуем данные для экспорта
    export_data = []
    for book in books:
        book_data = {
            "id": book["id"],
            "title": book["title"],
            "author": book["author"],
            "year": book["publish_year"],
            "genre": book["genre"],
            "summary": book["summary"],
            "coverUrl": book["cover_url"],
            "source": book["source"],
            "sourceUrl": book["source_url"],
            "parsedAt": book["parsed_at"]
        }
        export_data.append(book_data)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(export_data, f, ensure_ascii=False, indent=2)
    
    return export_data 