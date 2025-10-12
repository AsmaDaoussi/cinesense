import { useState } from 'react';
import Home from './routes/Home';
import Auth from './routes/Auth';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'auth'>('home');

  if (currentPage === 'auth') {
    return <Auth />;
  }

  return (
    <Home
      onNavigateToLogin={() => setCurrentPage('auth')}
      onNavigateToSignup={() => setCurrentPage('auth')}
    />
  );
}