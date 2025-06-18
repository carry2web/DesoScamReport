// components/Notification/Notification.js
"use client";

import { 
    NotificationDefault, 
    NotificationFollow, 
    NotificationSubmitPost,
    NotificationDiamond,
    NotificationReaction,
    NotificationTransfer,
    NotificationDaoCoinTransfer,
    NotificationUserAssociation  
} from './types/';

import styles from './Notification.module.css';

export const Notification = ({ notification, postsByHash, profilesByPublicKey }) => {
    const { Metadata } = notification;

    const txnType = Metadata?.TxnType;
    const publicKey = Metadata?.TransactorPublicKeyBase58Check;
    const profile = profilesByPublicKey?.[publicKey];

    const transferMeta = Metadata?.BasicTransferTxindexMetadata;

    // related to SUBMIT_POST notifications
    const { SubmitPostTxindexMetadata: submitMeta } = Metadata || {};
    const submittedPost = postsByHash?.[submitMeta?.PostHashBeingModifiedHex];
    const submittedPostHex = submitMeta?.PostHashBeingModifiedHex;
    const parentPost = postsByHash?.[submitMeta?.ParentPostHashHex];

    // related to Diamond notifications
    const isDiamond =
        transferMeta?.DiamondLevel > 0 &&
        transferMeta?.PostHashHex &&
        transferMeta.PostHashHex.length > 0;   
        
    // related to Reaction notifications
    const isReaction = Metadata?.CreatePostAssociationTxindexMetadata?.AssociationType === 'REACTION';

    const isFocusTip = Metadata?.CreatePostAssociationTxindexMetadata?.AssociationType === 'DIAMOND' && 
        Metadata?.CreatePostAssociationTxindexMetadata?.AppPublicKeyBase58Check === 'BC1YLjEayZDjAPitJJX4Boy7LsEfN3sWAkYb3hgE9kGBirztsc2re1N' 

    switch (txnType) {
        case 'FOLLOW':
            return (
                <NotificationFollow
                    profile={profile}
                    publicKey={publicKey}
                    isUnfollow={Metadata?.FollowTxindexMetadata?.IsUnfollow}
                />
            );
        case 'SUBMIT_POST': 
            return (
                <NotificationSubmitPost
                    profile={profile}
                    publicKey={publicKey}
                    submittedPost={submittedPost}
                    submittedPostHex={submittedPostHex}
                    parentPost={parentPost}
                />
            );   
        case 'BASIC_TRANSFER': {
            if (isDiamond) {
                const post = postsByHash?.[transferMeta.PostHashHex];
                return (
                    <NotificationDiamond
                        profile={profile}
                        publicKey={publicKey}
                        post={post}
                        diamondLevel={transferMeta.DiamondLevel}
                    />
                );
            }

            return (
                <NotificationTransfer
                    profile={profile}
                    publicKey={publicKey}
                    nanosAmount={transferMeta?.TotalOutputNanos}
                />
            );            
        };
        case 'CREATE_POST_ASSOCIATION': {
            if (isReaction) {
                const post = postsByHash?.[Metadata?.CreatePostAssociationTxindexMetadata?.PostHashHex];
                const reaction = Metadata?.CreatePostAssociationTxindexMetadata?.AssociationValue
                return (
                    <NotificationReaction
                        profile={profile}
                        publicKey={publicKey}
                        post={post}
                        reaction={reaction}
                    />
                );
            }

            if (isFocusTip) {
                const post = postsByHash?.[Metadata?.CreatePostAssociationTxindexMetadata?.PostHashHex];
                return (
                    <NotificationDiamond
                        profile={profile}
                        publicKey={publicKey}
                        post={post}
                        isFocusTip={true}
                    />
                );
            }

            return <NotificationDefault notification={notification} />;
        };            
        case 'DAO_COIN_TRANSFER': {
            const daoMeta = Metadata?.DAOCoinTransferTxindexMetadata;
            const daoAmountHex = daoMeta?.DAOCoinToTransferNanos;
            const creatorUsername = daoMeta?.CreatorUsername;

            return (
                <NotificationDaoCoinTransfer
                    profile={profile}
                    publicKey={publicKey}
                    daoAmountHex={daoAmountHex}
                    creatorUsername={creatorUsername}
                />
            );
        }      
        case 'CREATE_USER_ASSOCIATION': {
            const assocMeta = Metadata?.CreateUserAssociationTxindexMetadata;
            return (
                <NotificationUserAssociation
                    profile={profile}
                    publicKey={publicKey}
                    associationType={assocMeta?.AssociationType}
                    associationValue={assocMeta?.AssociationValue}
                />
            );
        }                  
        case 'ATOMIC_TXNS_WRAPPER': {
            const innerTxns = Metadata?.AtomicTxnsWrapperTxindexMetadata?.InnerTxnsTransactionMetadata;
            if (!innerTxns?.length) return <NotificationDefault notification={notification} />;

            return (
                <div className={styles.atomicTransWrapper}>
                {innerTxns.map((tx, index) => {
                    const innerType = tx.TxnType;
                    const innerProfile = profilesByPublicKey?.[tx.TransactorPublicKeyBase58Check];

                    if (innerType === 'CREATE_POST_ASSOCIATION') {
                        const post = postsByHash?.[tx?.CreatePostAssociationTxindexMetadata?.PostHashHex];
                        const reaction = tx?.CreatePostAssociationTxindexMetadata?.AssociationValue;
                        return (
                            <div key={index}>   
                                <NotificationReaction
                                    profile={innerProfile}
                                    publicKey={tx.TransactorPublicKeyBase58Check}
                                    post={post}
                                    reaction={reaction}
                                />
                            </div>
                        );
                    }

                    if (innerType === 'CREATE_USER_ASSOCIATION') {
                        const assocMeta = tx?.CreateUserAssociationTxindexMetadata;
                        return (
                            <div key={index}>
                                <NotificationUserAssociation
                                    profile={innerProfile}
                                    publicKey={tx.TransactorPublicKeyBase58Check}
                                    associationType={assocMeta?.AssociationType}
                                    associationValue={assocMeta?.AssociationValue}
                                />
                            </div>
                        );
                    }                         

                    if (innerType === 'DAO_COIN_TRANSFER') {
                        const { CreatorUsername, DAOCoinToTransferNanos } = tx?.DAOCoinTransferTxindexMetadata || {};
                        return (
                            <div key={index}>
                                <NotificationDaoCoinTransfer
                                    profile={innerProfile}
                                    publicKey={tx.TransactorPublicKeyBase58Check}
                                    creatorUsername={CreatorUsername}
                                    daoAmountHex={DAOCoinToTransferNanos}
                                />
                            </div>
                        );
                    }                    

                    if (innerType === 'BASIC_TRANSFER') {
                        const amount = tx?.BasicTransferTxindexMetadata?.TotalOutputNanos;
                        return (
                            <div key={index}>
                                <NotificationTransfer
                                profile={innerProfile}
                                publicKey={tx.TransactorPublicKeyBase58Check}
                                nanosAmount={amount}
                                />
                            </div>
                        );
                    }                         

                    return (
                        <div key={index}><NotificationDefault notification={tx} /></div>
                    );
                })}
                </div>
            );
        } 
        default:
            return <NotificationDefault notification={notification} />;
    }
};