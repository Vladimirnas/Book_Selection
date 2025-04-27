import json
import requests
from datetime import datetime
import database as db
import logging
import os
import time
import random

# Настройка логирования
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    handlers=[logging.FileHandler("parser.log"),
                              logging.StreamHandler()])
logger = logging.getLogger(__name__)

# API URL для получения данных
OPENLIBRARY_API_URL = "https://openlibrary.org/api/books"
OPENLIBRARY_SEARCH_URL = "https://openlibrary.org/search.json"
OPENLIBRARY_WORK_URL = "https://openlibrary.org/works/"

# Ожидание между запросами, чтобы не перегружать API (в секундах)
REQUEST_DELAY = 1

def search_books_by_title(title, limit=10):
    """Поиск книг по названию в OpenLibrary API"""
    logger.info(f"Поиск книг по запросу: {title}")
    params = {
        'q': title,
        'limit': limit
    }
    
    try:
        response = requests.get(OPENLIBRARY_SEARCH_URL, params=params)
        response.raise_for_status()
        data = response.json()
        
        results = []
        for doc in data.get('docs', [])[:limit]:
            book = {
                'title': doc.get('title'),
                'author': doc.get('author_name', ['Неизвестный автор'])[0] if 'author_name' in doc else 'Неизвестный автор',
                'year': doc.get('first_publish_year'),
                'key': doc.get('key')
            }
            results.append(book)
        
        logger.info(f"Найдено книг: {len(results)}")
        return results
    except Exception as e:
        logger.error(f"Ошибка при поиске книг: {str(e)}")
        return []

def get_book_details(work_key):
    """Получение подробной информации о книге по ее ключу"""
    if not work_key:
        return None
    
    if work_key.startswith('/works/'):
        work_key = work_key[7:]  # Убираем префикс /works/
    
    url = f"{OPENLIBRARY_WORK_URL}{work_key}.json"
    logger.info(f"Запрос информации о книге: {url}")
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        book_data = response.json()
        
        # Получаем описание книги
        description = None
        if 'description' in book_data:
            if isinstance(book_data['description'], dict):
                description = book_data['description'].get('value')
            else:
                description = book_data['description']
        
        # Получаем обложку книги
        cover_id = None
        if 'covers' in book_data and len(book_data['covers']) > 0:
            cover_id = book_data['covers'][0]
        
        cover_url = None
        if cover_id:
            cover_url = f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
        
        # Получаем жанры (subjects)
        genres = book_data.get('subjects', [])
        genre = genres[0] if genres else None
        
        # Формируем URL источника
        source_url = f"https://openlibrary.org{book_data.get('key')}"
        
        return {
            'summary': description,
            'genre': genre,
            'coverUrl': cover_url,
            'source': 'openlibrary',
            'sourceUrl': source_url
        }
    except Exception as e:
        logger.error(f"Ошибка при получении данных о книге {work_key}: {str(e)}")
        return None

def parse_and_save_books(search_queries, limit_per_query=5):
    """
    Парсит книги по списку поисковых запросов и сохраняет их в базу данных
    
    Args:
        search_queries (list): Список поисковых запросов (названий книг)
        limit_per_query (int): Максимальное количество книг для каждого запроса
        
    Returns:
        list: Список добавленных книг
    """
    total_parsed = 0
    added_books = []
    
    # Инициализируем базу данных
    db.init_db()
    
    for query in search_queries:
        logger.info(f"Обработка запроса: {query}")
        
        # Поиск книг
        search_results = search_books_by_title(query, limit=limit_per_query)
        
        for book_basic in search_results:
            try:
                # Делаем паузу, чтобы не перегружать API
                time.sleep(REQUEST_DELAY + random.uniform(0, 1))
                
                # Получаем дополнительные детали о книге
                book_details = get_book_details(book_basic.get('key'))
                
                if not book_details:
                    continue
                
                # Создаем объект книги для сохранения в БД
                book_data = {
                    'title': book_basic.get('title'),
                    'author': book_basic.get('author'),
                    'year': book_basic.get('year'),
                    'genre': book_details.get('genre'),
                    'summary': book_details.get('summary'),
                    'coverUrl': book_details.get('coverUrl'),
                    'source': book_details.get('source'),
                    'sourceUrl': book_details.get('sourceUrl'),
                    'parsedAt': datetime.now().isoformat()
                }
                
                # Сохраняем книгу в базу данных
                added_book = db.add_book(book_data)
                
                if added_book:
                    logger.info(f"Книга добавлена: {book_data['title']} - {book_data['author']}")
                    total_parsed += 1
                    added_books.append(added_book)
                else:
                    logger.warning(f"Книга не была добавлена: {book_data['title']} - {book_data['author']}")
                    
            except Exception as e:
                logger.error(f"Ошибка при обработке книги: {str(e)}")
    
    logger.info(f"Парсинг завершен. Всего добавлено книг: {total_parsed}")
    return added_books

def export_books_to_json(output_file="parsed_books.json"):
    """Экспортирует книги из базы данных в JSON файл"""
    return db.export_to_json(output_file)

if __name__ == "__main__":
    # Список поисковых запросов (можно изменить или загрузить из файла)
    search_queries = [
        "War and Peace",
        "Война и мир",
        "Crime and Punishment",
        "Master and Margarita",
        "Dead Souls Gogol",
        "Idiot Dostoevsky",
        "Fathers and Sons Turgenev",
        "Eugene Onegin",
        "Hero of Our Time Lermontov",
        "Doctor Zhivago"
    ]
    
    # Парсим и сохраняем книги
    parse_and_save_books(search_queries, limit_per_query=2)
    
    # Экспортируем книги в JSON
    export_books_to_json() 