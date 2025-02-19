'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import dynamic from 'next/dynamic';
import styles from './Analytics.module.css';
import type { ChartOptions } from 'chart.js';

// Chart'ı client-side'da dinamik olarak import edelim
const Line = dynamic(
    () => import('react-chartjs-2').then(mod => mod.Line),
    { ssr: false }
);

// Chart.js bileşenlerini dinamik olarak yükleyelim
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Scale,
    ScaleOptionsByType,
    LinearScaleOptions
} from 'chart.js';

// Callback fonksiyonu için tip tanımı
type FormatCallback = (value: number, context: unknown) => string;

export default function Analytics() {
    const { items } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Chart.js'i client-side'da register edelim
        ChartJS.register(
            CategoryScale,
            LinearScale,
            PointElement,
            LineElement,
            Title,
            Tooltip,
            Legend
        );
        setMounted(true);
    }, []);

    if (!mounted || items.length === 0) return null;

    // Son 7 günün verilerini grupla
    const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
    }).reverse();

    const dailyTotals = last7Days.map(date => {
        const dayItems = items.filter(item =>
            item.date.split('T')[0] === date
        );
        return {
            date,
            total: dayItems.reduce((sum, item) => sum + item.taxFreePrice, 0)
        };
    });

    const data = {
        labels: last7Days.map(date => new Date(date).toLocaleDateString()),
        datasets: [
            {
                label: 'Daily Tax-Free Shopping',
                data: dailyTotals.map(day => day.total),
                borderColor: 'rgb(124, 58, 237)',
                backgroundColor: 'rgba(124, 58, 237, 0.5)',
                tension: 0.4
            }
        ]
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Shopping Analysis'
            }
        },
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                beginAtZero: true,
                ticks: {
                    callback: function (value: number) {
                        if (items.length > 0) {
                            return new Intl.NumberFormat('ja-JP', {
                                style: 'currency',
                                currency: items[0].touristCountry.currency
                            }).format(value);
                        }
                        return value.toString();
                    }
                }
            }
        }
    };

    return (
        <div className={styles.analytics}>
            <Line options={options} data={data} />
        </div>
    );
} 