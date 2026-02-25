import {useTranslation} from 'react-i18next';
import {useCallback} from 'react';

export type SupportedLanguage = 'en' | 'ko' | 'id';

export const LANGUAGES: {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
}[] = [
  {code: 'en', label: 'English', nativeLabel: 'English'},
  {code: 'ko', label: 'Korean', nativeLabel: '한국어'},
  {code: 'id', label: 'Indonesian', nativeLabel: 'Bahasa Indonesia'},
];

export function useLanguage() {
  const {i18n} = useTranslation();

  const currentLanguage = (i18n.language || 'en') as SupportedLanguage;

  const changeLanguage = useCallback(
    async (lang: SupportedLanguage) => {
      await i18n.changeLanguage(lang);
    },
    [i18n],
  );

  return {currentLanguage, changeLanguage, languages: LANGUAGES};
}
