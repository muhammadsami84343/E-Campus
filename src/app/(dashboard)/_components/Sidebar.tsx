"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "./nav";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>e‑Campus</div>

      <nav>
        <ul className={styles.menu}>
          {nav.map(item => {
            const active = pathname === item.href;
            return (
              <li key={item.href} className={active ? styles.active : undefined}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}