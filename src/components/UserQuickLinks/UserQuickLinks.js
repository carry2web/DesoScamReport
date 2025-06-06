'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import { Avatar } from '@/components/Avatar';
import { useClickOutside } from '@/hooks/useClickOutside';
import { Dropdown } from "@/components/Dropdown";
import styles from './UserQuickLinks.module.css';

export const UserQuickLinks = ({ profile, rawParam }) => {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const base = encodeURIComponent(rawParam);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const links = [
        { label: '📝 User Posts', href: `/${base}/posts` },
        { label: '🙂 Follow Feed', href: `/${base}/feed` },
        { label: '🔔 Notifications', href: `/${base}/notifications` },
    ];    

    const toggleMenu = () => {
        setOpen((prev) => !prev);
    };

    useEffect(() => {
        let lastY = window.scrollY;
        let accumulatedDelta = 0;

        const handleScroll = () => {
            const currentY = window.scrollY;
            const delta = Math.abs(currentY - lastY);
            accumulatedDelta += delta;

            if (open && accumulatedDelta > 30) {
                setOpen(false);
                accumulatedDelta = 0; // reset after closing
            }

            lastY = currentY;
        };

        // Reset accumulation when menu opens
        if (open) {
            accumulatedDelta = 0;
            lastY = window.scrollY;
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [open]);

    // ✅ Close on outside click
    useClickOutside([menuRef, buttonRef], () => {
        if (open) setOpen(false);
    });

    return (
    <div className={styles.fabContainer}>
        <button ref={buttonRef} onClick={toggleMenu} className={styles.fabButton}>
            {open ? <span className={styles.fabIconClose}>×</span> : <span className={styles.fabIconMenu}>☰</span>} {/* Use a simple icon or text for toggle */}
        </button>

        {/* Always render the menu element for proper animation */}
        <div
            ref={menuRef}
            // aria-hidden={!open}
            className={classNames(styles.menuWrapper, {
                [styles.menuOpen]: open,
                [styles.menuClosed]: !open,
            })}
        >
            <Dropdown className={styles.dropdown}>
                <Link href={`/${base}`} className={styles.avatarWrapper} onClick={() => setOpen(false)}>
                    <Avatar profile={profile} size="medium" />
                </Link>
                <div className={styles.linksSection}>
                    {links.map(({ label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            onClick={() => setOpen(false)}
                            className={classNames(styles.link, {
                                [styles.active]: pathname === href,
                            })}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </Dropdown>
        </div>
    </div>
    );
};