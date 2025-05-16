'use client';

import { useRef, useState, useEffect } from 'react';
import { useDeSoApi } from '@/api/useDeSoApi';
import { useQuery } from '@tanstack/react-query';
import { isMaybePublicKey } from '@/utils/profileUtils';
import classNames from 'classnames';
import Link from "next/link";

import { Input } from '@/components/Input';
import { Dropdown } from "@/components/Dropdown";

import { useClickOutside } from '@/hooks/useClickOutside';

import { Avatar } from "@/components/Avatar";

import { queryKeys } from '@/queries';

import styles from './SearchProfiles.module.css';

export const SearchProfiles = () => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const { getProfiles, getSingleProfile } = useDeSoApi();

    const containerRef = useRef(null);

    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedQuery(query.trim());
        }, 300);
        return () => clearTimeout(delay);
    }, [query]);

    const isPublicKey = isMaybePublicKey(debouncedQuery);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: isPublicKey
        ? queryKeys.profileByPublicKey(debouncedQuery)
        : queryKeys.searchProfilesByUsernamePrefix(debouncedQuery),        
        // supports seach by public key
        queryFn: async () => {
            if (isPublicKey) {
              const response = await getSingleProfile({ PublicKeyBase58Check: debouncedQuery });
              if (!response.success || !response.data?.Profile) {
                throw new Error(response.error || 'Profile not found');
              }
              return [response.data.Profile]; // keep format consistent with list
            } else {
              const response = await getProfiles({ UsernamePrefix: debouncedQuery });
              if (!response.success) throw new Error(response.error);
              return response.data?.ProfilesFound || [];
            }
        },        
        enabled: !!debouncedQuery,
        staleTime: 30 * 1000,
        cacheTime: 5 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
    });

    useClickOutside(containerRef, () => {
        setQuery('');
        setDebouncedQuery('');
    });    

    return (
        <div className={styles.container} ref={containerRef}>

            <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search profiles..."       
            />

            {debouncedQuery && (
                <Dropdown className={styles.dropdown}>
                    {isError ? (
                        <div className={classNames(styles.message, styles.errorMessage)}>
                            {error.message || 'Failed to load profiles'}
                        </div>
                    ) : isLoading ? (
                            <div className={styles.message}>Loading...</div>
                        ) : data?.length > 0 ? (
                            data.map((profile) => (
                                <Link
                                    key={profile.PublicKeyBase58Check}
                                    href={`/${profile.Username}`}
                                    className={styles.item}
                                    onClick={() => {
                                        setQuery('');
                                        setDebouncedQuery('');
                                    }}
                                >
                                    <Avatar profile={profile} size={60} />
                                    <div className={styles.info}>
                                        <div className={styles.username}>@{profile.Username}</div>
                                        {profile.Description && (
                                            <div className={styles.description}>
                                                {profile.Description}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))
                        ) : (
                        <div className={styles.message}>No profiles found</div>
                    )}
                </Dropdown>
            )}
        </div>
    );
};
