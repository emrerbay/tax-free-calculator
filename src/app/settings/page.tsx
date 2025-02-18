'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './settings.module.css';

type Country = {
    code: string;
    name: string;
    currency: string;
};

const AVAILABLE_COUNTRIES: Country[] = [
    { code: 'TR', name: 'Turkey', currency: 'TRY' },
    { code: 'JP', name: 'Japan', currency: 'JPY' },
    { code: 'US', name: 'United States', currency: 'USD' },
    // Daha fazla ülke eklenebilir
];

export default function Settings() {
    const router = useRouter();
    const [isTaxFreeEnabled, setIsTaxFreeEnabled] = useState(true);
    const [taxFreeRate, setTaxFreeRate] = useState('10');
    const [selectedCountries, setSelectedCountries] = useState<Country[]>([
        AVAILABLE_COUNTRIES[0], // Turkey
        AVAILABLE_COUNTRIES[1], // Japan
    ]);

    const handleCountryChange = (index: number, country: Country) => {
        const newCountries = [...selectedCountries];
        newCountries[index] = country;
        setSelectedCountries(newCountries);
    };

    const handleAddThirdCountry = () => {
        if (selectedCountries.length < 3) {
            const availableCountry = AVAILABLE_COUNTRIES.find(
                country => !selectedCountries.includes(country)
            );
            if (availableCountry) {
                setSelectedCountries([...selectedCountries, availableCountry]);
            }
        }
    };

    const handleRemoveThirdCountry = () => {
        if (selectedCountries.length === 3) {
            setSelectedCountries(selectedCountries.slice(0, 2));
        }
    };

    const handleSave = () => {
        // Burada ayarları localStorage'a kaydedebiliriz
        const settings = {
            isTaxFreeEnabled,
            taxFreeRate: Number(taxFreeRate),
            selectedCountries,
        };
        localStorage.setItem('taxFreeSettings', JSON.stringify(settings));
        router.push('/');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Settings</h1>

            <div className={styles.section}>
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
                    <div className={styles.settingItem}>
                        <label className={styles.label}>
                            Tax-Free Rate (%)
                            <input
                                type="number"
                                value={taxFreeRate}
                                onChange={(e) => setTaxFreeRate(e.target.value)}
                                min="0"
                                max="100"
                                className={styles.input}
                            />
                        </label>
                    </div>
                )}
            </div>

            <div className={styles.section}>
                <h2 className={styles.subtitle}>Country Selection</h2>

                {selectedCountries.map((country, index) => (
                    <div key={index} className={styles.settingItem}>
                        <label className={styles.label}>
                            {index === 0 ? 'Home Country' : index === 1 ? 'Tourist Country' : 'Third Country'}
                            <select
                                value={country.code}
                                onChange={(e) => {
                                    const newCountry = AVAILABLE_COUNTRIES.find(c => c.code === e.target.value);
                                    if (newCountry) handleCountryChange(index, newCountry);
                                }}
                                className={styles.select}
                            >
                                {AVAILABLE_COUNTRIES.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.name} ({c.currency})
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                ))}

                {selectedCountries.length < 3 ? (
                    <button onClick={handleAddThirdCountry} className={styles.addButton}>
                        Add Third Country
                    </button>
                ) : (
                    <button onClick={handleRemoveThirdCountry} className={styles.removeButton}>
                        Remove Third Country
                    </button>
                )}
            </div>

            <button onClick={handleSave} className={styles.saveButton}>
                Save Settings
            </button>
        </div>
    );
} 