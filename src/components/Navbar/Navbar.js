"use client";

import styles from "./Navbar.module.css";
import Link from "next/link";

import { SearchProfiles } from "@/components/SearchProfiles";
import { ThemeSelector } from "@/components/ThemeSelector";

import { UserMenu } from "@/components/UserMenu";

export const Navbar = () => {

  return (
    <nav className={styles.container}>
      <div className={styles.start}>
        <Link href="/" className={styles.logo}>Home</Link>
      </div>

      <div className={styles.middle}>
        <SearchProfiles />
      </div>

      <div className={styles.end}>
        <UserMenu />
        <ThemeSelector />
      </div>
    </nav>
  );
};
