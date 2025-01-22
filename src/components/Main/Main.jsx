import React from 'react';
import './Main.css';
import SearchSection from './SearchSection';
import CategoriesSection from './CategoriesSection';
import RecommendationsSection from './RecommendationsSection';

export const Main = () => {
  return (
    <main className="main-container">
      <SearchSection />
      <CategoriesSection />
      <RecommendationsSection />
    </main>
  );
};

export default Main;