'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../app/page.module.css';
import { motion } from 'framer-motion';
import { type Country } from '@/data/countries';
import { useCart } from '@/context/CartContext';
import Cart from './Cart';
import Analytics from './Analytics';
import FavoriteItems from './FavoriteItems';
import { categories } from '@/data/categories';
import { useTranslation } from '@/hooks/useTranslation';

type Settings = {
    isTaxFreeEnabled: boolean;
    taxFreeRate: number;
    selectedCountries: Country[];
};

const DEFAULT_SETTINGS: Settings = {
    isTaxFreeEnabled: true,
    taxFreeRate: 10,
    selectedCountries: [
        { code: 'TR', name: 'Turkey', currency: 'TRY', flag: '🇹🇷', region: 'Europe' },
        { code: 'JP', name: 'Japan', currency: 'JPY', flag: '🇯🇵', region: 'Asia' },
    ]
};

export default function Calculator() {
    const [price, setPrice] = useState<string>('');
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const { addItem } = useCart();
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const { t } = useTranslation();
    const [isTaxFreeEnabled, setIsTaxFreeEnabled] = useState(true);

    useEffect(() => {
        setMounted(true);
        try {
            const savedSettings = localStorage.getItem('taxFreeSettings');
            if (savedSettings) {
                const parsedSettings = JSON.parse(savedSettings);
                setSettings(parsedSettings);
                setIsTaxFreeEnabled(parsedSettings.isTaxFreeEnabled);
            }
        } catch (error) {
            console.error('LocalStorage error:', error);
            setSettings(DEFAULT_SETTINGS);
            setIsTaxFreeEnabled(DEFAULT_SETTINGS.isTaxFreeEnabled);
        }
    }, []);

    useEffect(() => {
        if (mounted && settings?.selectedCountries) {
            const touristCurrency = settings.selectedCountries[1].currency;
            fetchExchangeRates(touristCurrency);
        }
    }, [settings, mounted]);

    const fetchExchangeRates = async (baseCurrency: string) => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://api.frankfurter.app/latest?from=${baseCurrency}`
            );

            if (!response.ok) {
                const usdResponse = await fetch(
                    `https://api.frankfurter.app/latest?from=USD`
                );
                const usdData = await usdResponse.json();

                const jpyRate = usdData.rates.JPY;
                const rates: Record<string, number> = {};

                Object.entries(usdData.rates).forEach(([currency, rate]) => {
                    if (currency === baseCurrency) {
                        rates[currency] = 1;
                    } else {
                        rates[currency] = Number(rate) / jpyRate;
                    }
                });

                setExchangeRates(rates);
            } else {
                const data = await response.json();
                setExchangeRates(data.rates);
            }

            setLoading(false);
        } catch (error) {
            console.error('Döviz kuru çekilirken hata oluştu:', error);
            setLoading(false);

            const fallbackRates = {
                USD: 0.0067,
                EUR: 0.0062,
                TRY: 0.2386,
            };
            setExchangeRates(fallbackRates);
        }
    };

    const calculatePrice = (amount: number, targetCurrency: string) => {
        if (!exchangeRates[targetCurrency]) return '-';
        const converted = amount * exchangeRates[targetCurrency];

        const locales: Record<string, string> = {
            TRY: 'tr-TR',
            USD: 'en-US',
            EUR: 'de-DE',
            JPY: 'ja-JP'
        };

        return new Intl.NumberFormat(locales[targetCurrency] || 'en-US', {
            style: 'currency',
            currency: targetCurrency,
            maximumFractionDigits: targetCurrency === 'JPY' ? 0 : 2
        }).format(converted);
    };

    const getOriginalPrice = () => {
        if (!price) return '-';
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
        }).format(Number(price));
    };

    const getTaxFreePrice = () => {
        if (!price || !settings) return '-';
        const taxFreeAmount = Number(price) * (1 - settings.taxFreeRate / 100);
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: settings.selectedCountries[1].currency,
        }).format(taxFreeAmount);
    };

    const handleAddToCart = () => {
        if (!price || !settings) return;

        const originalPrice = Number(price);
        const finalPrice = isTaxFreeEnabled
            ? originalPrice * (1 - settings.taxFreeRate / 100)
            : originalPrice;

        const exchangeRate = exchangeRates[settings.selectedCountries[0].currency] || 0;

        addItem({
            originalPrice,
            taxFreePrice: finalPrice,
            touristCountry: settings.selectedCountries[1],
            homeCountry: settings.selectedCountries[0],
            exchangeRate,
            category: selectedCategory,
        });

        setPrice('');
        setSelectedCategory(categories[0]);
    };

    const handleTaxFreeToggle = () => {
        const newValue = !isTaxFreeEnabled;
        setIsTaxFreeEnabled(newValue);

        // Settings'i güncelle
        const newSettings = {
            ...settings,
            isTaxFreeEnabled: newValue
        };
        setSettings(newSettings);

        // LocalStorage'ı güncelle
        localStorage.setItem('taxFreeSettings', JSON.stringify(newSettings));
    };

    if (!mounted) {
        return <div className={styles.loading}>{t('common.loading')}</div>;
    }

    if (!settings || loading) {
        return <div className={styles.loading}>{t('common.loading')}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.page}
        >
            <main className={styles.main}>
                <motion.h1
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className={styles.title}
                >
                    {t('common.title')}
                </motion.h1>

                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className={styles.calculator}
                >
                    <div className={styles.inputGroup}>
                        <label htmlFor="price" className={styles.inputLabel}>
                            <span className={styles.flag}>
                                {settings.selectedCountries[1].flag}
                            </span>
                            {t('common.priceIn')} {settings.selectedCountries[1].name}
                        </label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.currencyPrefix}>
                                {settings.selectedCountries[1].currency}
                            </span>
                            <input
                                type="number"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder={t('common.enterAmount')}
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.checkboxGroup}>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={isTaxFreeEnabled}
                                onChange={handleTaxFreeToggle}
                            />
                            <span className={styles.slider}></span>
                            <span className={styles.switchLabel}>
                                {t('common.calculateTaxFree')} ({settings.taxFreeRate}% {t('common.off')})
                            </span>
                        </label>
                    </div>

                    <div className={styles.results}>
                        <div className={styles.resultItem}>
                            <span>{t('common.originalPrice')} ({settings.selectedCountries[1].currency}):</span>
                            <span>{getOriginalPrice()}</span>
                        </div>

                        {isTaxFreeEnabled && (
                            <div className={styles.resultItem}>
                                <span>{t('common.taxFreePrice')} ({settings.selectedCountries[1].currency}):</span>
                                <span>{getTaxFreePrice()}</span>
                            </div>
                        )}

                        {settings.selectedCountries.map((country, index) => {
                            if (index === 1) return null;
                            const amount = isTaxFreeEnabled
                                ? Number(price) * (1 - settings.taxFreeRate / 100)
                                : Number(price);

                            return (
                                <div key={country.code} className={styles.resultItem}>
                                    <span>{t('common.priceIn')} {country.name} ({country.currency}):</span>
                                    <span>{price ? calculatePrice(amount, country.currency) : '-'}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.categorySelect}>
                        <label>
                            <span className={styles.categoryLabel}>
                                {t('common.category')}
                                <span className={styles.selectedCategory}>
                                    {selectedCategory.icon}
                                </span>
                            </span>
                        </label>
                        <div className={styles.categoryButtons}>
                            {categories.map(category => (
                                <motion.button
                                    key={category.id}
                                    className={`${styles.categoryButton} ${selectedCategory.id === category.id ? styles.selected : ''
                                        }`}
                                    onClick={() => setSelectedCategory(category)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span role="img" aria-label={category.name}>
                                        {category.icon}
                                    </span>
                                    <span>{t(`categories.${category.id}`)}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToCart}
                        className={styles.addToCartButton}
                        disabled={!price}
                    >
                        {t('common.addToCart')}
                    </motion.button>
                </motion.div>

                <Cart />
                <Analytics />
                <FavoriteItems />

                <Link href="/settings" className={styles.settingsButtonWrapper}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.settingsButton}
                    >
                        {t('common.settings')}
                    </motion.div>
                </Link>
            </main>
        </motion.div>
    );
} 