'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import styles from './home.module.css';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (session) {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className={styles.loading}>
        Loading...
      </div>
    );
  }

  if (session) {
    return null; // Will redirect
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Welcome to Craft Hub</h1>
        <p className={styles.subtitle}>
          Your personal craft project tracker for knitting, quilting, sewing, and more creative endeavors.
        </p>
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📋</div>
            <h3 className={styles.featureTitle}>Project Tracking</h3>
            <p className={styles.featureDescription}>
              Keep track of all your craft projects with detailed progress monitoring
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🧵</div>
            <h3 className={styles.featureTitle}>Supply Management</h3>
            <p className={styles.featureDescription}>
              Organize your craft supplies and link them to your projects
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📊</div>
            <h3 className={styles.featureTitle}>Progress Visualization</h3>
            <p className={styles.featureDescription}>
              Visual progress bars and completion tracking for all your projects
            </p>
          </div>
        </div>
        <div className={styles.actions}>
          <Link href="/register" className={styles.primaryButton}>
            Get Started
          </Link>
          <Link href="/login" className={styles.secondaryButton}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
