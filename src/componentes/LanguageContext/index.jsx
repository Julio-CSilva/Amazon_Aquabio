import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  // Definindo o idioma padrão como 'en'
  const [language, setLanguage] = useState('en');

  const toggleLanguage = (lang) => {
    setLanguage(lang); // Atualiza o idioma
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
