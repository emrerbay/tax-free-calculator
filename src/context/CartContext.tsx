'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { type Country } from '@/data/countries';
import { type Category } from '@/data/categories';
import { categories } from '@/data/categories';

// Varsayılan kategori
const DEFAULT_CATEGORY = categories[categories.length - 1]; // "Other" kategorisi

export type CartItem = {
    id: string;
    originalPrice: number;
    taxFreePrice: number;
    touristCountry: Country;
    homeCountry: Country;
    exchangeRate: number;
    date: string;
    category: Category;
};

type CartContextType = {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'id' | 'date'>) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    total: {
        tourist: { amount: number; currency: string };
        home: { amount: number; currency: string };
    };
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('shopping-cart');
            if (savedCart) {
                const parsedItems = JSON.parse(savedCart);
                // Eski kayıtlara kategori ekle
                const updatedItems = parsedItems.map((item: CartItem) => ({
                    ...item,
                    category: item.category || DEFAULT_CATEGORY
                }));
                setItems(updatedItems);
            }
        } catch (error) {
            console.error('Cart load error:', error);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('shopping-cart', JSON.stringify(items));
    }, [items]);

    const addItem = (item: Omit<CartItem, 'id' | 'date'>) => {
        setItems(prev => [...prev, {
            ...item,
            category: item.category || DEFAULT_CATEGORY,
            id: Math.random().toString(36).substring(7),
            date: new Date().toISOString()
        }]);
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce((acc, item) => {
        return {
            tourist: {
                amount: acc.tourist.amount + item.taxFreePrice,
                currency: item.touristCountry.currency
            },
            home: {
                amount: acc.home.amount + (item.taxFreePrice * item.exchangeRate),
                currency: item.homeCountry.currency
            }
        };
    }, {
        tourist: { amount: 0, currency: items[0]?.touristCountry.currency || '' },
        home: { amount: 0, currency: items[0]?.homeCountry.currency || '' }
    });

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}; 