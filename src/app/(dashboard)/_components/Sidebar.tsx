// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import type { MenuNode, MenuGroup, MenuLink } from "./menudata";
import { menu } from "./menudata";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  
  // Track which groups are expanded (by label path)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [currentPath, setCurrentPath] = useState(pathname);

  // Update currentPath when pathname changes
  useEffect(() => {
    setCurrentPath(pathname);
    // Reset expanded state when navigating to a new path
    if (pathname === '/') {
      setExpanded({});
    }
  }, [pathname]);

  const toggle = (key: string) =>
    setExpanded((s) => ({ ...s, [key]: !s[key] }));

  const flatKey = (labels: string[]) => labels.join(" › ");

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return currentPath === "/";
    }
    return href === currentPath;
  };

  const isActiveGroup = (children: MenuNode[]): boolean => {
    const isActive = children.some((child): boolean => {
      if (child.type === "link") return isActiveLink(child.href);
      if (child.type === "group") return isActiveGroup((child as MenuGroup).children);
      return false;
    });
    return isActive;
  };

  const shouldExpandGroup = (group: MenuGroup): boolean => {
    return isActiveGroup(group.children) || !!expanded[flatKey([group.label])];
  };

  const renderNode = (node: MenuNode, path: string[] = []) => {
    if (node.type === "link") {
      const link = node as MenuLink;
      return (
        <li key={flatKey([...path, link.label])}>
          <Link
            href={link.href}
            className={
              isActiveLink(link.href)
                ? `${styles.link} ${styles.activeLink}`
                : styles.link
            }
            onClick={() => {
              onClose();
              if (link.href === '/') {
                setExpanded({});
              }
            }}
          >
            {link.icon && (
              <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
              </svg>
            )}
            {link.label}
          </Link>
        </li>
      );
    }
    const group = node as MenuGroup;
    const key = flatKey([...path, group.label]);
    const isOpen = shouldExpandGroup(group);
    return (
      <li key={key} className={styles.group}>
        <button
          type="button"
          className={
            isActiveGroup(group.children)
              ? `${styles.groupBtn} ${styles.activeGroup}`
              : styles.groupBtn
          }
          aria-expanded={isOpen}
          onClick={() => toggle(key)}
        >
          <span className={styles.caret} aria-hidden="true">
            {/* rotate when open via CSS */}
          </span>
          <div className={styles.buttonContent}>
            {group.icon && (
              <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={group.icon} />
              </svg>
            )}
            {group.label}
          </div>
        </button>
        <ul className={`${styles.childList} ${isOpen ? styles.childListOpen : ""}`}>
          {group.children.map((child) => renderNode(child, [...path, group.label]))}
        </ul>
      </li>
    );
  };

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
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