"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

import { useClickOutside } from '@/hooks/useClickOutside';

import styles from "./UserMenu.module.css";

export const UserMenu = () => {
    const { userPublicKey, login, logout, setActiveUser, isUserPublicKeyLoading } = useAuth();
    const { altUserProfiles, isAltUserProfileSLoading, userProfile, isUserProfileLoading } = useUser();

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const toggleDropdown = () => setIsOpen((prev) => !prev);
    const closeDropdown = () => setIsOpen(false);

    const handleUserSelect = (publicKey) => {
        setActiveUser(publicKey);
        closeDropdown();
    };

    const handleLogin = () => {
        login();
        closeDropdown();
    };

    const handleLogout = () => {
        logout();
        closeDropdown();
    };

    
    useClickOutside(containerRef, () => {
        closeDropdown();
    });    

  return (
    <div className={styles.container} ref={containerRef}>

        {isUserPublicKeyLoading 
            ?<div>Loading...</div>
            :
            <div className={styles.start} onClick={toggleDropdown}>
                START
            </div>
        }

        {isOpen && (
            <div className={styles.dropdown}>

                <div className={styles.loggedUserData}>
                    Logged as:
                    {userPublicKey &&<div>{userPublicKey}</div>}
                    <div>
                        { isUserProfileLoading 
                            ?<>Loading...</>
                            :
                            <>
                                {userProfile?.Username
                                ?<>{userProfile.Username}</>
                                :<>No username</>
                                }
                            </>
                        }
                    </div>
                </div>

                <div className={styles.altUserSelector}>
                    <div>
                    {isAltUserProfileSLoading
                        ?<span>Loading...</span>
                        :
                        <select
                            onChange={(e) => handleUserSelect(e.target.value)}
                            defaultValue=""
                        >
                        <option value="" disabled hidden>Select alternate user</option>
                        {altUserProfiles && altUserProfiles.length > 0 ? (
                            altUserProfiles.map((user) => (
                            <option key={user.PublicKeyBase58Check} value={user.PublicKeyBase58Check}>
                                {user.ProfileEntryResponse?.Username || user.PublicKeyBase58Check}
                            </option>
                            ))
                        ) : (
                            <option disabled>No alt users</option>
                        )}
                        </select>         
                    }       
                    </div>
                    <div><button className={styles.addUser} onClick={handleLogin}>Add User</button></div> 
                </div>            

                
                <div className={styles.authButtons}>
                    {userPublicKey ? (
                    <button onClick={handleLogout} className={styles.actionButton}>
                        Log out
                    </button>
                    ) : (
                    <button onClick={handleLogin} className={styles.actionButton}>
                        Log in
                    </button>
                    )}
                </div>

            </div>
        )}
    </div>
  );
};
