import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (value === undefined || value === null) return key;
      value = value[k];
    }
    return value !== undefined && value !== null ? value : key;
  };

  const tArray = (key) => {
    const result = t(key);
    return Array.isArray(result) ? result : [];
  };

  return { t, tArray, language };
};
