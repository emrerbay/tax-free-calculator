'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import styles from './Cart.module.css';

export default function Cart() {
    const { items, removeItem, total } = useCart();

    if (items.length === 0) {
        return (
            <div className={styles.emptyCart}>
                <span className={styles.emptyIcon}>🛒</span>
                <p>Your cart is empty</p>
            </div>
        );
    }

    return (
        <div className={styles.cart}>
            <h2 className={styles.cartTitle}>Shopping Cart</h2>

            <div className={styles.cartItems}>
                <AnimatePresence>
                    {items.map(item => (
                        <motion.div
                            key={item.id}
                            className={styles.cartItem}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                        >
                            <div className={styles.itemInfo}>
                                <div className={styles.priceInfo}>
                                    {item.originalPrice !== item.taxFreePrice ? (
                                        <>
                                            <span className={styles.originalPrice}>
                                                {item.touristCountry.flag} {new Intl.NumberFormat('ja-JP', {
                                                    style: 'currency',
                                                    currency: item.touristCountry.currency
                                                }).format(item.originalPrice)}
                                            </span>
                                            <span className={styles.taxFreePrice}>
                                                Tax-Free: {new Intl.NumberFormat('ja-JP', {
                                                    style: 'currency',
                                                    currency: item.touristCountry.currency
                                                }).format(item.taxFreePrice)}
                                            </span>
                                        </>
                                    ) : (
                                        <span className={styles.regularPrice}>
                                            {item.touristCountry.flag} {new Intl.NumberFormat('ja-JP', {
                                                style: 'currency',
                                                currency: item.touristCountry.currency
                                            }).format(item.originalPrice)}
                                        </span>
                                    )}
                                </div>
                                <div className={styles.homePrice}>
                                    {item.homeCountry.flag} {new Intl.NumberFormat('tr-TR', {
                                        style: 'currency',
                                        currency: item.homeCountry.currency
                                    }).format(item.taxFreePrice * item.exchangeRate)}
                                </div>
                            </div>
                            <div className={styles.itemActions}>
                                <span className={styles.date}>
                                    {new Date(item.date).toLocaleDateString()}
                                </span>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className={styles.removeButton}
                                >
                                    ✕
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className={styles.cartTotal}>
                <div className={styles.totalItem}>
                    <span>Total ({total.tourist.currency}):</span>
                    <span>{new Intl.NumberFormat('ja-JP', {
                        style: 'currency',
                        currency: total.tourist.currency
                    }).format(total.tourist.amount)}</span>
                </div>
                <div className={styles.totalItem}>
                    <span>Total ({total.home.currency}):</span>
                    <span>{new Intl.NumberFormat('tr-TR', {
                        style: 'currency',
                        currency: total.home.currency
                    }).format(total.home.amount)}</span>
                </div>
            </div>
        </div>
    );
} 