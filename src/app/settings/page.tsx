'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { countries, regions, groupedCountries } from '@/data/countries';
import styles from './settings.module.css';
import { useTranslation } from '@/hooks/useTranslation';

const languageNames = {
    en: { name: 'English', flag: '🇬🇧' },
    ja: { name: '日本語', flag: '🇯🇵' },
    tr: { name: 'Türkçe', flag: '🇹🇷' }
};

export default function Settings() {
    const [settings, setSettings] = useState({
        isTaxFreeEnabled: true,
        taxFreeRate: 10,
        selectedCountries: [
            countries.find(c => c.code === 'TR')!,
            countries.find(c => c.code === 'JP')!
        ]
    });

    const { t, language, changeLanguage, availableLanguages } = useTranslation();

    useEffect(() => {
        const savedSettings = localStorage.getItem('taxFreeSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('taxFreeSettings', JSON.stringify(settings));
        window.location.href = '/';
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.page}
        >
            <div className={styles.settings}>
                <h1 className={styles.title}>{t('common.settings')}</h1>

                <div className={styles.section}>
                    <h2>{t('settings.language')}</h2>
                    <div className={styles.languageButtons}>
                        {availableLanguages.map((lang) => (
                            <button
                                key={lang}
                                onClick={() => changeLanguage(lang)}
                                className={`${styles.languageButton} ${language === lang ? styles.active : ''
                                    }`}
                            >
                                <span className={styles.flag}>
                                    {languageNames[lang].flag}
                                </span>
                                <span className={styles.name}>
                                    {languageNames[lang].name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>{t('settings.taxFree')}</h2>
                    <div className={styles.taxFreeSettings}>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={settings.isTaxFreeEnabled}
                                onChange={(e) =>
                                    setSettings(prev => ({
                                        ...prev,
                                        isTaxFreeEnabled: e.target.checked
                                    }))
                                }
                            />
                            <span className={styles.slider}></span>
                            <span className={styles.switchLabel}>
                                {t('settings.enableTaxFree')}
                            </span>
                        </label>

                        <div className={styles.rateInput}>
                            <label>{t('settings.taxFreeRate')}</label>
                            <input
                                type="number"
                                value={settings.taxFreeRate}
                                onChange={(e) =>
                                    setSettings(prev => ({
                                        ...prev,
                                        taxFreeRate: Number(e.target.value)
                                    }))
                                }
                                min="0"
                                max="100"
                            />
                            <span>%</span>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>{t('settings.countries')}</h2>
                    {regions.map(region => (
                        <div key={region} className={styles.regionGroup}>
                            <h3 className={styles.regionTitle}>{region}</h3>
                            <div className={styles.countryGrid}>
                                {groupedCountries[region].map(country => (
                                    <button
                                        key={country.code}
                                        className={`${styles.countryButton} ${settings.selectedCountries.some(
                                            c => c.code === country.code
                                        )
                                            ? styles.selected
                                            : ''
                                            }`}
                                        onClick={() => {
                                            // Ülke seçimi mantığı
                                            const isSelected = settings.selectedCountries.some(
                                                c => c.code === country.code
                                            );
                                            if (isSelected) {
                                                setSettings(prev => ({
                                                    ...prev,
                                                    selectedCountries: prev.selectedCountries.filter(
                                                        c => c.code !== country.code
                                                    )
                                                }));
                                            } else if (settings.selectedCountries.length < 2) {
                                                setSettings(prev => ({
                                                    ...prev,
                                                    selectedCountries: [...prev.selectedCountries, country]
                                                }));
                                            }
                                        }}
                                    >
                                        <span className={styles.flag}>{country.flag}</span>
                                        <span className={styles.name}>{country.name}</span>
                                        <span className={styles.currency}>
                                            {country.currency}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.buttons}>
                    <Link href="/" className={styles.cancelButton}>
                        {t('common.cancel')}
                    </Link>
                    <button onClick={handleSave} className={styles.saveButton}>
                        {t('common.save')}
                    </button>
                </div>
            </div>
        </motion.div>
    );
} 