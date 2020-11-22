import React from 'react';
import './App.scss';
import SheetHandler from './components/sheet/SheetHandler';
import { SheetPage } from './components/sheet/SheetPage';

export const App = () => {
  return (
    <div className="App">
      <header><h1>Learn Music Sight Reading</h1></header>
      <main>
        <SheetPage sheetHandler={new SheetHandler()} />
      </main>
    </div>
  );
}