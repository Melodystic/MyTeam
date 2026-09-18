import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/ru';
import { getLocaleSetting, saveLocaleSetting } from '../db';
import {
  translate,
  type AppLocale,
  type TranslationKey,
} from '../i18n/ui';
import { getDomainCopy, type DomainCopy } from '../i18n/domain';

interface LocaleContextValue {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  t: (
    key: TranslationKey,
    variables?: Record<string, string | number>,
  ) => string;
  dateFormat: string;
  formatDate: (timestamp: number, includeTime?: boolean) => string;
  domain: DomainCopy;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>('ru');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getLocaleSetting().then((stored) => {
      setLocaleState(stored);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    dayjs.locale(locale);
    document.documentElement.lang = locale;
    document.title = translate(locale, 'app.title');
  }, [locale]);

  const setLocale = useCallback((nextLocale: AppLocale) => {
    setLocaleState(nextLocale);
    void saveLocaleSetting(nextLocale);
  }, []);

  const t = useCallback(
    (
      key: TranslationKey,
      variables?: Record<string, string | number>,
    ) => translate(locale, key, variables),
    [locale],
  );

  const formatDate = useCallback(
    (timestamp: number, includeTime = false) =>
      new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        ...(includeTime
          ? {
              hour: '2-digit',
              minute: '2-digit',
            }
          : {}),
      }).format(timestamp),
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      dateFormat: locale === 'ru' ? 'DD.MM.YYYY' : 'MM/DD/YYYY',
      formatDate,
      domain: getDomainCopy(locale),
    }),
    [formatDate, locale, setLocale, t],
  );

  if (!ready) return null;

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components
export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
