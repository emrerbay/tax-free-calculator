'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { categories } from '@/data/categories';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './FavoriteItems.module.css';
import { type Category } from '@/data/categories';

export default function FavoriteItems() {
    const [showFavorites, setShowFavorites] = useState(false);
    const { items } = useCart();
    const { t } = useTranslation();

    // Kategorilere göre harcamaları grupla
    const categoryTotals = items.reduce((acc, item) => {
        const categoryId = item.category?.id || 'other';
        if (!acc[categoryId]) {
            acc[categoryId] = {
                count: 0,
                total: 0,
                category: item.category || categories[categories.length - 1]
            };
        }
        acc[categoryId].count++;
        acc[categoryId].total += item.taxFreePrice;
        return acc;
    }, {} as Record<string, { count: number; total: number; category: Category }>);

    if (items.length === 0) {
        return null;
    }

    return (
        <motion.div className={styles.favorites}>
            <button
                className={styles.toggleButton}
                onClick={() => setShowFavorites(!showFavorites)}
            >
                {showFavorites ? t('favorites.hide') : t('favorites.show')}
            </button>

            <AnimatePresence>
                {showFavorites && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={styles.categoriesList}
                    >
                        {categories.map(category => {
                            const stats = categoryTotals[category.id];
                            if (!stats) return null;

                            return (
                                <motion.div
                                    key={category.id}
                                    className={styles.categoryItem}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className={styles.categoryInfo}>
                                        <span className={styles.categoryIcon}>
                                            {category.icon}
                                        </span>
                                        <span className={styles.categoryName}>
                                            {t(`categories.${category.id}`)}
                                        </span>
                                    </div>
                                    <div className={styles.categoryStats}>
                                        <span className={styles.categoryTotal}>
                                            {items[0] && new Intl.NumberFormat('ja-JP', {
                                                style: 'currency',
                                                currency: items[0].touristCountry.currency
                                            }).format(stats.total)}
                                        </span>
                                        <span className={styles.categoryCount}>
                                            {stats.count} {t('favorites.timesBought')}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
} 