'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import styles from './page.module.css';

// Ana component'i client-side only olarak import ediyoruz
const Calculator = dynamic(() => import('../components/Calculator'), {
  ssr: false,
});

export default function Home() {
  return (
    <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
      <Calculator />
    </Suspense>
  );
}
