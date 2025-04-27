import React from 'react';
import BookParser from './BookParser';
import BookList from './BookList';

const ParserPage: React.FC = () => {
  return (
    <main className="flex-grow bg-background">
      <div className="container mx-auto px-4 pt-4 pb-8">
        <h1 className="text-2xl font-bold mb-6">Парсер книг</h1>
        <div className="grid grid-cols-1 gap-8">
          <BookParser />
          <BookList />
        </div>
      </div>
    </main>
  );
};

export default ParserPage; 