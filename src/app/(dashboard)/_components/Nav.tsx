// components/Nav.tsx
"use client";

import Link from "next/link";
import styles from "./nav.module.css";

type NavProps = {
  onMenuClick: () => void; // open sidebar on mobile
};

export default function Nav({ onMenuClick }: NavProps) {
  return (
    <header className={styles.nav}>
      {/* Hamburger (mobile) */}
      <button
        className={styles.menuBtn}
        aria-label="Open sidebar"
        onClick={onMenuClick}
      >
        {/* Simple hamburger icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      {/* Brand */}
      
<Link href="/">
  <div className="w 8 h-8 rounded-lg overflow-hidden">
    <img
      src="/logo.png"
      alt="School Logo"
      className="w-full h-full object-contain"
    />
  </div>
</Link>
       



      {/* Spacer */}
      <div className={styles.spacer} />

      {/* Right side (user info) */}
      <div className={styles.userBox}>
        <div className={styles.avatar} aria-hidden="true">
          A
        </div>
        <div className={styles.userMeta}>
          <div className={styles.userName}>Admin User</div>
          <div className={styles.userEmail}>administrator@school.com</div>
        </div>
        <Link href="/logout" >Logout </Link>
      </div>
    </header>
  );
}