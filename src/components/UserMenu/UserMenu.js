"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

import { Button } from "@/components/Button";
//import { Select } from "@/components/SelectBasic";
import { Select } from "@/components/Select";
import { Dropdown, DropdownSection } from "@/components/Dropdown";

import { useClickOutside } from '@/hooks/useClickOutside';

import { Avatar } from "@/components/Avatar";

import styles from "./UserMenu.module.css";

export const UserMenu = () => {
    const { userPublicKey, login, logout, setActiveUser } = useAuth();
    const { altUserProfiles, isAltUserProfileSLoading, userProfile, isUserProfileLoading } = useUser();

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const selectFloatingRef = useRef(null);

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

    useClickOutside([containerRef, selectFloatingRef], () => {
        closeDropdown();
    });

    const selectOptions = [
        {
          value: userPublicKey,
          label: userProfile?.Username || userPublicKey,
          icon: <Avatar profile={userProfile} size={24} />,
        },
        ...(altUserProfiles?.length > 0
          ? altUserProfiles.map((user) => ({
              value: user.PublicKeyBase58Check,
              label: user.ProfileEntryResponse?.Username || user.PublicKeyBase58Check,
              icon: <Avatar profile={user.ProfileEntryResponse} size={24} />,
            }))
          : []),
    ];    


  return (
    <div className={styles.container} ref={containerRef}>

        <div className={styles.start} onClick={toggleDropdown}>
            <Avatar profile={userProfile} size={38} />
        </div>  

        {isOpen && (
            <Dropdown className={styles.dropdown}>

                <DropdownSection label="Logged as">                    
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
                </DropdownSection>

                <DropdownSection label="Alt users">
                    <div className={styles.altUserSelector}>
                        <div>
                        {isAltUserProfileSLoading
                            ?<span>Loading...</span>
                            :   
                            <Select
                                floatingRef={selectFloatingRef}
                                value={userPublicKey}
                                onChange={(e) => handleUserSelect(e.target.value)}
                                placeholder="Select alternate user"
                                options={selectOptions}
                                maxHeight="200px"
                            />                                              
                        }       
                        </div>
                        <div><Button onClick={handleLogin} variant="secondary">Add User</Button></div>          
                    </div>      
                </DropdownSection>         

                <DropdownSection>
                    {userPublicKey ? (
                        <Button onClick={handleLogout}>Log out</Button>
                    ) : (
                        <Button onClick={handleLogin}>Log in</Button>
                    )}
                </DropdownSection>
            </Dropdown>
        )}
    </div>
  );
};
