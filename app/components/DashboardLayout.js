'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Projects', href: '/dashboard/projects', icon: '📋' },
    { name: 'Supplies', href: '/dashboard/supplies', icon: '🧵' },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className={styles.container}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.logo}>Craft Hub</h1>
          <button 
            className={styles.closeSidebar}
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className={styles.navigation}>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {session?.user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{session?.user?.name}</p>
              <p className={styles.userEmail}>{session?.user?.email}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className={styles.signOutButton}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={styles.main}>
        <header className={styles.header}>
          <button 
            className={styles.menuButton}
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h2 className={styles.pageTitle}>
            {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
          </h2>
        </header>

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
