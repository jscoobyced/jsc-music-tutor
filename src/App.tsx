import React from 'react';
import './App.scss';
import { SheetPage } from './components/SheetPage';

export const App = () => {
  return (
    <div className="App">
      <header><h1>Learn Music Sight Reading</h1></header>
      <main>
        <SheetPage />
      </main>
    </div>
  );
}