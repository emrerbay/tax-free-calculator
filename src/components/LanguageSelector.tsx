'use client';

import { useTranslation } from '@/hooks/useTranslation';
import styles from './LanguageSelector.module.css';

const languageNames = {
    en: { name: 'English', flag: '🇬🇧' },
    ja: { name: '日本語', flag: '🇯🇵' },
    tr: { name: 'Türkçe', flag: '🇹🇷' }
};

export default function LanguageSelector() {
    const { language, changeLanguage, availableLanguages } = useTranslation();

    return (
        <div className={styles.languageSelector}>
            {availableLanguages.map((lang) => (
                <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`${styles.languageButton} ${language === lang ? styles.active : ''
                        }`}
                >
                    <span className={styles.flag}>{languageNames[lang].flag}</span>
                    <span className={styles.name}>{languageNames[lang].name}</span>
                </button>
            ))}
        </div>
    );
} 