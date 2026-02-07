import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('lang') || null;
  });

  const showLanguageSelector = language === null;

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language: language || 'hi', changeLanguage, showLanguageSelector }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
