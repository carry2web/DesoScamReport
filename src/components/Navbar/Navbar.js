"use client";

import Link from "next/link";

import { SearchProfiles } from "@/components/SearchProfiles";
import { ThemeSelector } from "@/components/ThemeSelector";

import { Button } from "@/components/Button";

import { useAuth } from "@/context/AuthContext";

import { 
  Home as HomeIcon
} from '@/assets/icons';

import { UserMenu } from "@/components/UserMenu";

import styles from "./Navbar.module.css";

export const Navbar = () => {

  const { userPublicKey } = useAuth();

  return (
    <nav className={styles.container}>
      <div className={styles.start}>
        <Link href="/" className={styles.logo}><HomeIcon label="Home" /></Link>
      </div>

      <div className={styles.middle}>
        <SearchProfiles />
      </div>

      <div className={styles.end}>

        {userPublicKey && (
          <Button href="/compose/post" size="small">
            Post
          </Button>
        )}        

        <UserMenu />
        <ThemeSelector />
      </div>
    </nav>
  );
};
