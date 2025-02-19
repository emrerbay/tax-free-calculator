'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../app/page.module.css';
import { motion } from 'framer-motion';
import { type Country } from '@/data/countries';
import { useCart } from '@/context/CartContext';
import Cart from './Cart';

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

    useEffect(() => {
        setMounted(true);
        try {
            const savedSettings = localStorage.getItem('taxFreeSettings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
        } catch (error) {
            console.error('LocalStorage error:', error);
            // Varsayılan ayarları kullan
            setSettings(DEFAULT_SETTINGS);
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
            currency: 'JPY',
        }).format(taxFreeAmount);
    };

    const handleAddToCart = () => {
        if (!price || !settings) return;

        const originalPrice = Number(price);
        const taxFreePrice = originalPrice * (1 - settings.taxFreeRate / 100);
        const exchangeRate = exchangeRates[settings.selectedCountries[0].currency] || 0;

        addItem({
            originalPrice,
            taxFreePrice,
            touristCountry: settings.selectedCountries[1],
            homeCountry: settings.selectedCountries[0],
            exchangeRate,
        });

        // Optional: Clear price after adding to cart
        setPrice('');
    };

    if (!mounted) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (!settings || loading) {
        return <div className={styles.loading}>Loading...</div>;
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
                    Tax-Free Shopping Calculator
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
                            Price in {settings.selectedCountries[1].name}
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
                                placeholder="Enter amount..."
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.checkboxGroup}>
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.isTaxFreeEnabled}
                                readOnly
                            />
                            Calculate Tax-Free Price ({settings.taxFreeRate}% off)
                        </label>
                    </div>

                    <div className={styles.results}>
                        <div className={styles.resultItem}>
                            <span>Original Price ({settings.selectedCountries[1].currency}):</span>
                            <span>{getOriginalPrice()}</span>
                        </div>

                        {settings.isTaxFreeEnabled && (
                            <div className={styles.resultItem}>
                                <span>Tax-Free Price ({settings.selectedCountries[1].currency}):</span>
                                <span>{getTaxFreePrice()}</span>
                            </div>
                        )}

                        {settings.selectedCountries.map((country, index) => {
                            if (index === 1) return null; // Turist ülkesini atlıyoruz
                            const amount = settings.isTaxFreeEnabled ?
                                Number(price) * (1 - settings.taxFreeRate / 100) :
                                Number(price);

                            return (
                                <div key={country.code} className={styles.resultItem}>
                                    <span>Price in {country.name} ({country.currency}):</span>
                                    <span>{price ? calculatePrice(amount, country.currency) : '-'}</span>
                                </div>
                            );
                        })}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToCart}
                        className={styles.addToCartButton}
                        disabled={!price}
                    >
                        Add to Cart 🛒
                    </motion.button>
                </motion.div>

                <Cart />

                <Link href="/settings" className={styles.settingsButtonWrapper}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.settingsButton}
                    >
                        ⚙️ Settings
                    </motion.div>
                </Link>
            </main>
        </motion.div>
    );
} 