// main.js
import React from 'react';

// Added imports for the relevant rendering functions
import { Header } from './components/Header';
import { MainContent } from './components/MainContent';
import { Footer } from './components/Footer';

// Rendering functions
const renderHeader = () => <Header />;

const renderMainContent = () => <MainContent />;

const renderFooter = () => <Footer />;

// Combined rendering function using the imported modules
const renderPage = () => (
  <div>
    {renderHeader()}
    {renderMainContent()}
    {renderFooter()}
  </div>
);

export default renderPage;