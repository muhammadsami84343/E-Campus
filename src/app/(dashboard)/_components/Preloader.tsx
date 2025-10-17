'use client';

import styles from './Preloader.module.css';
import Image from 'next/image';

export default function Preloader() {

  return (
    <div className={styles.preloaderWrapper}>
      <div className={styles.preloader}>
        <div className={styles.logoContainer}>
          <Image src="/logo.png" alt="E-Campus" width={80} height={80} className={styles.logo} />
          {/* Animated arcs */}
          <div className={styles.arc1} />
          <div className={styles.arc2} />
          <div className={styles.arc3} />
        </div>
      </div>
    </div>
  );
}