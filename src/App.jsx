import React from 'react';
import './styles/globals.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import TrafficMonitor from './components/dashboard/TrafficMonitor';
import './styles/globals.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <TrafficMonitor />
      </main>
      <Footer />
    </div>
  );
}

export default App;