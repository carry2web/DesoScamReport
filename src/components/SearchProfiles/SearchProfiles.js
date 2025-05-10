import { useRef, useState, useEffect } from 'react';
import { useDeSoApi } from '@/api/useDeSoApi';
import { useQuery } from '@tanstack/react-query';
import Link from "next/link";

import { Input } from '@/components/Input';
import { Dropdown } from "@/components/Dropdown";

import { useClickOutside } from '@/hooks/useClickOutside';

import { Avatar } from "@/components/Avatar";

import styles from './SearchProfiles.module.css';

export const SearchProfiles = () => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const { getProfiles } = useDeSoApi();

    const containerRef = useRef(null);

    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedQuery(query.trim());
        }, 300);
        return () => clearTimeout(delay);
    }, [query]);

    const { data, isLoading } = useQuery({
        queryKey: ['search-profiles', debouncedQuery],
        queryFn: async () => {
            const payload = {
                PublicKeyBase58Check: '',
                Username: '',
                UsernamePrefix: debouncedQuery,
                Description: '',
                OrderBy: '',
                NumToFetch: 10,
                ReaderPublicKeyBase58Check: '',
                ModerationType: '',
                FetchUsersThatHODL: false,
                AddGlobalFeedBool: false,
            };
            const response = await getProfiles(payload);
            if (!response.success) throw new Error(response.error);
            return response.data?.ProfilesFound || [];
        },
        enabled: !!debouncedQuery,
        staleTime: 30 * 1000,
        cacheTime: 5 * 60 * 1000,
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
                    {isLoading ? (
                        <div className={styles.message}>Loading...</div>
                    ) : data?.length > 0 ? (
                        data.map((profile) => {
                            return (
                                <Link
                                    key={profile.PublicKeyBase58Check}
                                    href={`/${profile.Username}`}
                                    className={styles.item}
                                    onClick={() => {
                                        setQuery('');
                                        setDebouncedQuery('');
                                    }}
                                >

                                    <Avatar profile={profile} size={50} />

                                    <div className={styles.username}>@{profile.Username}</div>
                                    {profile.Description && (
                                        <div className={styles.description}>
                                            {profile.Description.slice(0, 80)}
                                        </div>
                                    )}
                                </Link>
                            );
                        })
                    ) : (
                        <div className={styles.message}>No profiles found</div>
                    )}
                </Dropdown>
            )}
        </div>
    );
};
