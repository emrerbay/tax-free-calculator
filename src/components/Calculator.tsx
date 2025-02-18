'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../app/page.module.css';

type Country = {
    code: string;
    name: string;
    currency: string;
};

type Settings = {
    isTaxFreeEnabled: boolean;
    taxFreeRate: number;
    selectedCountries: Country[];
};

export default function Calculator() {
    const [price, setPrice] = useState<string>('');
    const [settings, setSettings] = useState<Settings | null>(null);
    const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedSettings = localStorage.getItem('taxFreeSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    useEffect(() => {
        if (settings?.selectedCountries) {
            const touristCurrency = settings.selectedCountries[1].currency;
            fetchExchangeRates(touristCurrency);
        }
    }, [settings]);

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

    if (!mounted) {
        return null;
    }

    if (!settings || loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1 className={styles.title}>Tax-Free Shopping Calculator</h1>

                <div className={styles.calculator}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="price">
                            Price ({settings.selectedCountries[1].currency})
                        </label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Enter price..."
                            className={styles.input}
                        />
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
                </div>

                <Link href="/settings" className={styles.settingsButton}>
                    Settings
                </Link>
            </main>
        </div>
    );
} 