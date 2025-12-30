import React from 'react';
import Home from './pages/Home';
import ThemeToggle from './components/ThemeToggle'; // Import the toggle button

function App() {
  return (
    // This outer div handles the Light/Dark background colors for the whole app
    <div className="min-h-screen w-full transition-colors duration-500 bg-emerald-50 dark:bg-[#022c22]">
      
      {/* The Floating Toggle Button */}
      <ThemeToggle />
      
      {/* Your Main App Page */}
      <Home />
      
    </div>
  );
}

export default App;