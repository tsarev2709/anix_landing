import React from 'react';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-anix-dark text-center p-4">
    <h1 className="text-7xl font-heading font-bold text-anix-teal mb-6">404</h1>
    <p className="text-2xl text-white mb-8">Страница не найдена</p>
    <a href="/" className="px-6 py-3 bg-anix-purple hover:bg-anix-teal transition-colors rounded-md text-white">Вернуться на главную</a>
  </div>
);

export default NotFound;
