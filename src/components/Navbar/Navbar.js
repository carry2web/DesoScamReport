"use client";

import styles from "./Navbar.module.css";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

import { SearchProfiles } from "@/components/SearchProfiles";
import { ThemeSelector } from "@/components/ThemeSelector";

export const Navbar = () => {

  const { userPublicKey, login, logout, setActiveUser, isUserPublicKeyLoading } = useAuth();

  const { altUserProfiles, isAltUserProfileSLoading } = useUser();

  return (
    <nav className={styles.container}>
      <div className={styles.start}>
        <Link href="/" className={styles.logo}>Home</Link>
      </div>

      <div className={styles.middle}>
        <SearchProfiles />
      </div>

      <div className={styles.end}>
        <div>
          {isAltUserProfileSLoading
            ?<span>Loading...</span>
            :
            <select
              onChange={(e) => {
                const selectedKey = e.target.value;
                if (selectedKey) setActiveUser(selectedKey);
              }}
              defaultValue=""
            >
              <option value="" disabled>Select alternate user</option>
              {altUserProfiles && altUserProfiles.length > 0 ? (
                altUserProfiles.map((user) => (
                  <option key={user.PublicKeyBase58Check} value={user.PublicKeyBase58Check}>
                    {user.ProfileEntryResponse?.Username || user.PublicKeyBase58Check}
                  </option>
                ))
              ) : (
                <option disabled>No alternate users</option>
              )}
            </select>         
          }        
        </div>
        <div><button onClick={login} disabled={isUserPublicKeyLoading}>Add User</button></div>
        <div>
          {userPublicKey ? (
            <button onClick={logout} disabled={isUserPublicKeyLoading}>Log out</button>
          ) : (
            <button onClick={login} disabled={isUserPublicKeyLoading}>Log in</button>
          )}
        </div>
        <ThemeSelector />
      </div>
    </nav>
  );
};
