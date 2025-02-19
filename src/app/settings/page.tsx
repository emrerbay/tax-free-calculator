'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AVAILABLE_COUNTRIES, groupedCountries, type Country } from '@/data/countries';
import styles from './settings.module.css';

export default function Settings() {
    const router = useRouter();
    const [isTaxFreeEnabled, setIsTaxFreeEnabled] = useState(true);
    const [taxFreeRate, setTaxFreeRate] = useState('10');
    const [selectedCountries, setSelectedCountries] = useState<Country[]>([
        AVAILABLE_COUNTRIES[0], // Turkey
        AVAILABLE_COUNTRIES[1], // Japan
    ]);

    useEffect(() => {
        // Mevcut ayarları localStorage'dan yükle
        try {
            const savedSettings = localStorage.getItem('taxFreeSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                setIsTaxFreeEnabled(settings.isTaxFreeEnabled);
                setTaxFreeRate(String(settings.taxFreeRate));
                setSelectedCountries(settings.selectedCountries);
            }
        } catch (error) {
            console.error('LocalStorage error:', error);
        }
    }, []);

    const handleCountrySelect = (country: Country) => {
        if (selectedCountries.some(c => c.code === country.code)) {
            // Ülke zaten seçiliyse, kaldır
            setSelectedCountries(selectedCountries.filter(c => c.code !== country.code));
        } else if (selectedCountries.length < 3) {
            // Yeni ülke ekle
            setSelectedCountries([...selectedCountries, country]);
        }
    };

    const handleSave = () => {
        if (selectedCountries.length < 2) {
            alert('Please select at least 2 countries');
            return;
        }

        try {
            const settings = {
                isTaxFreeEnabled,
                taxFreeRate: Number(taxFreeRate),
                selectedCountries,
            };
            localStorage.setItem('taxFreeSettings', JSON.stringify(settings));
            router.push('/');
        } catch (error) {
            console.error('Settings save error:', error);
            alert('Failed to save settings. Please try again.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.container}
        >
            <h1 className={styles.title}>Settings</h1>

            <motion.div
                className={styles.section}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
            >
                <div className={styles.settingItem}>
                    <label className={styles.label}>
                        Tax-Free Calculation
                        <div className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={isTaxFreeEnabled}
                                onChange={(e) => setIsTaxFreeEnabled(e.target.checked)}
                            />
                            <span className={styles.slider}></span>
                        </div>
                    </label>
                </div>

                {isTaxFreeEnabled && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className={styles.settingItem}
                    >
                        <label className={styles.label}>
                            Tax-Free Rate (%)
                            <div className={styles.rateInput}>
                                <input
                                    type="number"
                                    value={taxFreeRate}
                                    onChange={(e) => setTaxFreeRate(e.target.value)}
                                    min="0"
                                    max="100"
                                    className={styles.input}
                                />
                                <span className={styles.percentSign}>%</span>
                            </div>
                        </label>
                    </motion.div>
                )}
            </motion.div>

            <motion.div
                className={styles.section}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className={styles.subtitle}>Country Selection</h2>
                <p className={styles.hint}>Select 2-3 countries (min: 2, max: 3)</p>

                {Object.entries(groupedCountries).map(([region, countries]) => (
                    <div key={region} className={styles.regionGroup}>
                        <h3 className={styles.regionTitle}>{region}</h3>
                        <div className={styles.countryGrid}>
                            {countries.map((country) => (
                                <motion.button
                                    key={country.code}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`${styles.countryButton} ${selectedCountries.some(c => c.code === country.code) ? styles.selected : ''
                                        }`}
                                    onClick={() => handleCountrySelect(country)}
                                    disabled={
                                        selectedCountries.length >= 3 &&
                                        !selectedCountries.some(c => c.code === country.code)
                                    }
                                >
                                    <span className={styles.flag}>{country.flag}</span>
                                    <span className={styles.countryName}>{country.name}</span>
                                    <span className={styles.currency}>{country.currency}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                ))}
            </motion.div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className={styles.saveButton}
                disabled={selectedCountries.length < 2}
            >
                Save Settings
            </motion.button>
        </motion.div>
    );
} 