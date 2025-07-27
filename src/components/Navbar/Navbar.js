"use client";

import Link from "next/link";
import Image from "next/image";

import { SearchProfiles } from "@/components/SearchProfiles";
import { ThemeSelector } from "@/components/ThemeSelector";

import { Button } from "@/components/Button";

import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/context/PermissionContext";
import { PERMISSIONS } from "@/lib/permissions";

import { UserMenu } from "@/components/UserMenu";

import styles from "./Navbar.module.css";

export const Navbar = () => {

  const { userPublicKey } = useAuth();
  const { hasPermission } = usePermissions();

  return (
    <nav className={styles.container}>
      <div className={styles.start}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.svg" alt="DeSo Scam Report" width={32} height={32} />
          <span className={styles.logoText}>DeSo Scam Report</span>
        </Link>
      </div>

      <div className={styles.middle}>
        <SearchProfiles />
      </div>

      <div className={styles.end}>
        <Link href="/reports" className={styles.navLink}>
          Reports
        </Link>
        
        <Link href="/about" className={styles.navLink}>
          About
        </Link>
        
        {hasPermission(PERMISSIONS.VIEW_INVESTIGATION_PANEL) && (
          <Link href="/admin/investigation" className={styles.navLink}>
            Investigation
          </Link>
        )}
        
        {hasPermission(PERMISSIONS.VIEW_NODE_TRACKER) && (
          <Link href="/admin/nodes" className={styles.navLink}>
            Nodes
          </Link>
        )}
        
        {hasPermission(PERMISSIONS.VIEW_ADMIN_PANEL) && (
          <Link href="/admin" className={styles.navLink}>
            Admin
          </Link>
        )}
        
        {userPublicKey && (
          <>
            {hasPermission(PERMISSIONS.SUBMIT_REPORTS) && (
              <Link href="/reports/submit" className={styles.navLink}>
                Submit Report
              </Link>
            )}
            <Button href="/compose/post" size="small" variant="primary">
              Post Alert
            </Button>
          </>
        )}        

        <UserMenu />
        <ThemeSelector />
      </div>
    </nav>
  );
};
