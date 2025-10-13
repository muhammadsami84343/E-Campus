// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./Sidebar.module.css";
import type { MenuNode, MenuGroup, MenuLink } from "./menudata";
import { menu } from "./menudata";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  // Track which groups are expanded (by label path)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setExpanded((s) => ({ ...s, [key]: !s[key] }));

  const flatKey = (labels: string[]) => labels.join(" › ");

  const renderNode = (node: MenuNode, path: string[] = []) => {
    if (node.type === "link") {
      const link = node as MenuLink;
      return (
        <li key={flatKey([...path, link.label])}>
          <Link href={link.href} className={styles.link} onClick={onClose}>
            {link.label}
          </Link>
        </li>
      );
    }
    const group = node as MenuGroup;
    const key = flatKey([...path, group.label]);
    const isOpen = !!expanded[key];

    return (
      <li key={key} className={styles.group}>
        <button
          type="button"
          className={styles.groupBtn}
          aria-expanded={isOpen}
          onClick={() => toggle(key)}
        >
          <span className={styles.caret} aria-hidden="true">
            {/* rotate when open via CSS */}
          </span>
          {group.label}
        </button>
        <ul className={`${styles.childList} ${isOpen ? styles.childListOpen : ""}`}>
          {group.children.map((child) => renderNode(child, [...path, group.label]))}
        </ul>
      </li>
    );
  };

  // Prevent body scroll when sidebar is open on mobile
  useMemo(() => {
    if (typeof document === "undefined") return;
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  return (
    <>
      {/* Overlay (mobile) */}
      <div
        className={`${styles.overlay} ${open ? styles.overlayVisible : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />

      {/* Sidebar panel */}
      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`} aria-hidden={!open}>
        <div className={styles.header}>
          <div className={styles.title}>Main Menu</div>
          <button
            className={styles.closeBtn}
            aria-label="Close sidebar"
            onClick={onClose}
          >
            {/* X icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.list}>{menu.map((node) => renderNode(node))}</ul>
        </nav>
      </aside>
    </>
  );
}