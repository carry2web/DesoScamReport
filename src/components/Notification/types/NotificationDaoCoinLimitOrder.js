"use client";

import BigNumber from 'bignumber.js';
import Link from 'next/link';
import { Avatar } from '@/components/Avatar';
import { isMaybePublicKey } from '@/utils/profileUtils';
import styles from '../Notification.module.css';

// DESO creator public key (mainnet)
const DESO_CREATOR_PUBLIC_KEY = 'BC1YLbnP7rndL92x7DbLp6bkUpCgKmgoHgz7xEbwhgHTps3ZrXA6LtQ';

function formatOrderAmount(quantityHex, coinKey) {
  if (!quantityHex) return null;
  let num = new BigNumber(quantityHex, 16);
  if (coinKey === DESO_CREATOR_PUBLIC_KEY) {
    num = num.dividedBy('1e9'); // nanos to DESO
  } else {
    num = num.dividedBy('1e18'); // DAO coins
  }
  return formatCoinAmount(num);
}

// Coin symbol display helper
function getCoinSymbol(pubKey, profilesByPublicKey) {
  if (pubKey === DESO_CREATOR_PUBLIC_KEY) return 'DESO';
  const profile = profilesByPublicKey?.[pubKey];
  if (profile?.Username) return profile.Username;
  return pubKey;
}

function formatCoinAmount(val) {
  if (!val) return '0';
  const num = new BigNumber(val);
  if (num.isZero()) return '0';
  if (num.abs().isLessThan('0.00000001')) return '< 0.00000001';
  let formatted = num.toFormat(8);
  formatted = formatted.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
  return formatted;
}

function formatFillAmount(valueHex, pubKey) {
  if (!valueHex) return new BigNumber(0);
  let num = new BigNumber(valueHex, 16);
  if (pubKey === DESO_CREATOR_PUBLIC_KEY) {
    num = num.dividedBy('1e9'); // nanos to DESO
  } else {
    num = num.dividedBy('1e18'); // DAO coins
  }
  return num;
}

function aggregateFills(fills, orderPlacerKey, originalBuyingCoinKey, originalSellingCoinKey) {
  let totalBought = new BigNumber(0); // Total of the coin the order placer wanted to buy
  let totalSold = new BigNumber(0);   // Total of the coin the order placer paid with
  
  // Get all fulfilled fills
  const fulfilledFills = fills.filter(fill => fill.IsFulfilled);
  
  // Track which trades we've already counted to avoid double-counting
  const processedTrades = new Set();
  
  fulfilledFills.forEach(fill => {
    const boughtAmount = formatFillAmount(fill.CoinQuantityInBaseUnitsBought, fill.BuyingDAOCoinCreatorPublicKey);
    const soldAmount = formatFillAmount(fill.CoinQuantityInBaseUnitsSold, fill.SellingDAOCoinCreatorPublicKey);
    
    // Create a unique identifier for this trade based on amounts and coins
    const tradeId = `${fill.BuyingDAOCoinCreatorPublicKey}-${fill.SellingDAOCoinCreatorPublicKey}-${fill.CoinQuantityInBaseUnitsBought}-${fill.CoinQuantityInBaseUnitsSold}`;
    const reverseTradeId = `${fill.SellingDAOCoinCreatorPublicKey}-${fill.BuyingDAOCoinCreatorPublicKey}-${fill.CoinQuantityInBaseUnitsSold}-${fill.CoinQuantityInBaseUnitsBought}`;
    
    // Skip if we've already processed this trade (from the opposite perspective)
    if (processedTrades.has(tradeId) || processedTrades.has(reverseTradeId)) {
      return;
    }
    
    if (fill.TransactorPublicKeyBase58Check === orderPlacerKey) {
      // This is from the order placer's perspective
      if (fill.BuyingDAOCoinCreatorPublicKey === originalBuyingCoinKey) {
        totalBought = totalBought.plus(boughtAmount);
      }
      if (fill.SellingDAOCoinCreatorPublicKey === originalSellingCoinKey) {
        totalSold = totalSold.plus(soldAmount);
      }
    } else {
      // This is from the counterparty's perspective - flip it
      if (fill.BuyingDAOCoinCreatorPublicKey === originalSellingCoinKey && 
          fill.SellingDAOCoinCreatorPublicKey === originalBuyingCoinKey) {
        totalBought = totalBought.plus(soldAmount); // Order placer received what counterparty sold
        totalSold = totalSold.plus(boughtAmount);   // Order placer paid what counterparty bought
      }
    }
    
    // Mark this trade as processed
    processedTrades.add(tradeId);
  });
  
  return { totalBought, totalSold };
}

export const NotificationDaoCoinLimitOrder = ({
  profile,
  publicKey,
  meta,
  profilesByPublicKey,
}) => {
  const username = profile?.Username || publicKey;
  const isPublicKey = isMaybePublicKey(username);
  const lookupKey = !isPublicKey ? `@${username}` : username;

  // Coin symbols for summary
  const buySymbol = getCoinSymbol(meta?.BuyingDAOCoinCreatorPublicKey, profilesByPublicKey);
  const sellSymbol = getCoinSymbol(meta?.SellingDAOCoinCreatorPublicKey, profilesByPublicKey);

  // Main summary with order details
  const orderAmount = formatOrderAmount(meta?.QuantityToFillInBaseUnits, meta?.BuyingDAOCoinCreatorPublicKey);
  
  const orderSummary = orderAmount ? (
    <span>
      placed an order to buy {orderAmount} <Link href={`/${buySymbol}`}>${buySymbol}</Link> with <Link href={`/${sellSymbol}`}>${sellSymbol}</Link>
    </span>
  ) : (
    <span>
      placed an order to buy <Link href={`/${buySymbol}`}>${buySymbol}</Link> with <Link href={`/${sellSymbol}`}>${sellSymbol}</Link>
    </span>
  );

  // Only show fulfilled fills
  const fills = Array.isArray(meta?.FilledDAOCoinLimitOrdersMetadata)
    ? meta.FilledDAOCoinLimitOrdersMetadata.filter(f => f.IsFulfilled)
    : [];

  let aggregatedFillSummary = null;
  
  if (fills.length > 0) {
    const { totalBought, totalSold } = aggregateFills(
      fills,
      publicKey,
      meta?.BuyingDAOCoinCreatorPublicKey,
      meta?.SellingDAOCoinCreatorPublicKey
    );
    
    if (totalBought.isGreaterThan(0) && totalSold.isGreaterThan(0)) {
      aggregatedFillSummary = (
        <div className={styles.daoOrderFills}>
          <div className={styles.daoOrderFill}>
            <Link href={`/${username}`}>{lookupKey}</Link> bought {formatCoinAmount(totalBought)} <Link href={`/${buySymbol}`}>${buySymbol}</Link> with {formatCoinAmount(totalSold)} <Link href={`/${sellSymbol}`}>${sellSymbol}</Link>
          </div>
        </div>
      );
    } else if (totalBought.isGreaterThan(0)) {
      aggregatedFillSummary = (
        <div className={styles.daoOrderFills}>
          <div className={styles.daoOrderFill}>
            <Link href={`/${username}`}>{lookupKey}</Link> bought {formatCoinAmount(totalBought)} <Link href={`/${buySymbol}`}>${buySymbol}</Link>
          </div>
        </div>
      );
    } else if (totalSold.isGreaterThan(0)) {
      aggregatedFillSummary = (
        <div className={styles.daoOrderFills}>
          <div className={styles.daoOrderFill}>
            <Link href={`/${username}`}>{lookupKey}</Link> sold {formatCoinAmount(totalSold)} <Link href={`/${sellSymbol}`}>${sellSymbol}</Link>
          </div>
        </div>
      );
    }
  }

  return (
    <div className={styles.notification}>
      <div role="img" aria-label="dao limit order" className={styles.transferIcon}>
        📈
      </div>
      <div className={styles.notificationContent}>
        <div className={styles.notificationHeader}>
          <Link href={`/${username}`}>
            <Avatar profile={profile} size={48} className={styles.avatar} />
            <Avatar profile={profile} size={45} className={styles.avatarMobile} />
          </Link>
          <div className={styles.notificationSummary}>
            {aggregatedFillSummary || (
              <div>
                <Link href={`/${username}`}>{lookupKey}</Link> {orderSummary}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/*
  NOTE: 
  This updated version aggregates all fulfilled fills into a single summary line
  showing the total amounts bought and sold, rather than displaying each individual fill.
  This provides a cleaner, more concise view of the overall trade result.
*/


// aggtregated version of the DAO_COIN_LIMIT_ORDER notification - but only shows fills in the summary
// "use client";

// import BigNumber from 'bignumber.js';
// import Link from 'next/link';
// import { Avatar } from '@/components/Avatar';
// import { isMaybePublicKey } from '@/utils/profileUtils';
// import styles from '../Notification.module.css';

// // DESO creator public key (mainnet)
// const DESO_CREATOR_PUBLIC_KEY = 'BC1YLbnP7rndL92x7DbLp6bkUpCgKmgoHgz7xEbwhgHTps3ZrXA6LtQ';

// // Coin symbol display helper
// function getCoinSymbol(pubKey, profilesByPublicKey) {
//   if (pubKey === DESO_CREATOR_PUBLIC_KEY) return 'DESO';
//   const profile = profilesByPublicKey?.[pubKey];
//   if (profile?.Username) return profile.Username;
//   return pubKey;
// }

// function formatCoinAmount(val) {
//   if (!val) return '0';
//   const num = new BigNumber(val);
//   if (num.isZero()) return '0';
//   if (num.abs().isLessThan('0.00000001')) return '< 0.00000001';
//   let formatted = num.toFormat(8);
//   formatted = formatted.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
//   return formatted;
// }

// function formatFillAmount(valueHex, pubKey) {
//   if (!valueHex) return new BigNumber(0);
//   let num = new BigNumber(valueHex, 16);
//   if (pubKey === DESO_CREATOR_PUBLIC_KEY) {
//     num = num.dividedBy('1e9'); // nanos to DESO
//   } else {
//     num = num.dividedBy('1e18'); // DAO coins
//   }
//   return num;
// }

// function aggregateFills(fills, orderPlacerKey, originalBuyingCoinKey, originalSellingCoinKey) {
//   let totalBought = new BigNumber(0); // Total of the coin the order placer wanted to buy
//   let totalSold = new BigNumber(0);   // Total of the coin the order placer paid with
  
//   // Get all fulfilled fills
//   const fulfilledFills = fills.filter(fill => fill.IsFulfilled);
  
//   // Track which trades we've already counted to avoid double-counting
//   const processedTrades = new Set();
  
//   fulfilledFills.forEach(fill => {
//     const boughtAmount = formatFillAmount(fill.CoinQuantityInBaseUnitsBought, fill.BuyingDAOCoinCreatorPublicKey);
//     const soldAmount = formatFillAmount(fill.CoinQuantityInBaseUnitsSold, fill.SellingDAOCoinCreatorPublicKey);
    
//     // Create a unique identifier for this trade based on amounts and coins
//     const tradeId = `${fill.BuyingDAOCoinCreatorPublicKey}-${fill.SellingDAOCoinCreatorPublicKey}-${fill.CoinQuantityInBaseUnitsBought}-${fill.CoinQuantityInBaseUnitsSold}`;
//     const reverseTradeId = `${fill.SellingDAOCoinCreatorPublicKey}-${fill.BuyingDAOCoinCreatorPublicKey}-${fill.CoinQuantityInBaseUnitsSold}-${fill.CoinQuantityInBaseUnitsBought}`;
    
//     // Skip if we've already processed this trade (from the opposite perspective)
//     if (processedTrades.has(tradeId) || processedTrades.has(reverseTradeId)) {
//       return;
//     }
    
//     if (fill.TransactorPublicKeyBase58Check === orderPlacerKey) {
//       // This is from the order placer's perspective
//       if (fill.BuyingDAOCoinCreatorPublicKey === originalBuyingCoinKey) {
//         totalBought = totalBought.plus(boughtAmount);
//       }
//       if (fill.SellingDAOCoinCreatorPublicKey === originalSellingCoinKey) {
//         totalSold = totalSold.plus(soldAmount);
//       }
//     } else {
//       // This is from the counterparty's perspective - flip it
//       if (fill.BuyingDAOCoinCreatorPublicKey === originalSellingCoinKey && 
//           fill.SellingDAOCoinCreatorPublicKey === originalBuyingCoinKey) {
//         totalBought = totalBought.plus(soldAmount); // Order placer received what counterparty sold
//         totalSold = totalSold.plus(boughtAmount);   // Order placer paid what counterparty bought
//       }
//     }
    
//     // Mark this trade as processed
//     processedTrades.add(tradeId);
//   });
  
//   return { totalBought, totalSold };
// }

// export const NotificationDaoCoinLimitOrder = ({
//   profile,
//   publicKey,
//   meta,
//   profilesByPublicKey,
// }) => {
//   const username = profile?.Username || publicKey;
//   const isPublicKey = isMaybePublicKey(username);
//   const lookupKey = !isPublicKey ? `@${username}` : username;

//   // Coin symbols for summary
//   const buySymbol = getCoinSymbol(meta?.BuyingDAOCoinCreatorPublicKey, profilesByPublicKey);
//   const sellSymbol = getCoinSymbol(meta?.SellingDAOCoinCreatorPublicKey, profilesByPublicKey);

//   // Main summary
//   const orderSummary = (
//     <span>
//       placed an order to buy <Link href={`/${buySymbol}`}>${buySymbol}</Link> with <Link href={`/${sellSymbol}`}>${sellSymbol}</Link>
//     </span>
//   );

//   // Only show fulfilled fills
//   const fills = Array.isArray(meta?.FilledDAOCoinLimitOrdersMetadata)
//     ? meta.FilledDAOCoinLimitOrdersMetadata.filter(f => f.IsFulfilled)
//     : [];

//   let aggregatedFillSummary = null;
  
//   if (fills.length > 0) {
//     const { totalBought, totalSold } = aggregateFills(
//       fills,
//       publicKey,
//       meta?.BuyingDAOCoinCreatorPublicKey,
//       meta?.SellingDAOCoinCreatorPublicKey
//     );
    
//     if (totalBought.isGreaterThan(0) && totalSold.isGreaterThan(0)) {
//       aggregatedFillSummary = (
//         <div className={styles.daoOrderFills}>
//           <div className={styles.daoOrderFill}>
//             <Link href={`/${username}`}>{lookupKey}</Link> bought {formatCoinAmount(totalBought)} <Link href={`/${buySymbol}`}>${buySymbol}</Link> with {formatCoinAmount(totalSold)} <Link href={`/${sellSymbol}`}>${sellSymbol}</Link>
//           </div>
//         </div>
//       );
//     } else if (totalBought.isGreaterThan(0)) {
//       aggregatedFillSummary = (
//         <div className={styles.daoOrderFills}>
//           <div className={styles.daoOrderFill}>
//             <Link href={`/${username}`}>{lookupKey}</Link> bought {formatCoinAmount(totalBought)} <Link href={`/${buySymbol}`}>${buySymbol}</Link>
//           </div>
//         </div>
//       );
//     } else if (totalSold.isGreaterThan(0)) {
//       aggregatedFillSummary = (
//         <div className={styles.daoOrderFills}>
//           <div className={styles.daoOrderFill}>
//             <Link href={`/${username}`}>{lookupKey}</Link> sold {formatCoinAmount(totalSold)} <Link href={`/${sellSymbol}`}>${sellSymbol}</Link>
//           </div>
//         </div>
//       );
//     }
//   }

//   return (
//     <div className={styles.notification}>
//       <div role="img" aria-label="dao limit order" className={styles.transferIcon}>
//         📈
//       </div>
//       <div className={styles.notificationContent}>
//         <div className={styles.notificationHeader}>
//           <Link href={`/${username}`}>
//             <Avatar profile={profile} size={48} className={styles.avatar} />
//             <Avatar profile={profile} size={45} className={styles.avatarMobile} />
//           </Link>
//           <div className={styles.notificationSummary}>          
//             {aggregatedFillSummary}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /*
//   NOTE: 
//   This updated version aggregates all fulfilled fills into a single summary line
//   showing the total amounts bought and sold, rather than displaying each individual fill.
//   This provides a cleaner, more concise view of the overall trade result.
// */


// // the version below is not aggregated and shows each fill individually
// // "use client";

// import BigNumber from 'bignumber.js';
// import Link from 'next/link';
// import { Avatar } from '@/components/Avatar';
// import { isMaybePublicKey } from '@/utils/profileUtils';
// import styles from '../Notification.module.css';

// // DESO creator public key (mainnet)
// const DESO_CREATOR_PUBLIC_KEY = 'BC1YLbnP7rndL92x7DbLp6bkUpCgKmgoHgz7xEbwhgHTps3ZrXA6LtQ';

// // Coin symbol display helper
// function getCoinSymbol(pubKey, profilesByPublicKey) {
//   if (pubKey === DESO_CREATOR_PUBLIC_KEY) return 'DESO';
//   const profile = profilesByPublicKey?.[pubKey];
//   if (profile?.Username) return profile.Username;
//   return pubKey;
// }

// function formatCoinAmount(val) {
//   if (!val) return '0';
//   const num = new BigNumber(val);
//   if (num.isZero()) return '0';
//   if (num.abs().isLessThan('0.00000001')) return '< 0.00000001';
//   let formatted = num.toFormat(8);
//   formatted = formatted.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
//   return formatted;
// }

// function formatFillAmount(valueHex, pubKey) {
//   if (!valueHex) return '0';
//   let num = new BigNumber(valueHex, 16);
//   if (pubKey === DESO_CREATOR_PUBLIC_KEY) {
//     num = num.dividedBy('1e9'); // nanos to DESO
//   } else {
//     num = num.dividedBy('1e18'); // DAO coins
//   }
//   return formatCoinAmount(num);
// }

// export const NotificationDaoCoinLimitOrder = ({
//   profile,
//   publicKey,
//   meta,
//   profilesByPublicKey,
// }) => {
//   const username = profile?.Username || publicKey;
//   const isPublicKey = isMaybePublicKey(username);
//   const lookupKey = !isPublicKey ? `@${username}` : username;

//   // Coin symbols for summary
//   const buySymbol = getCoinSymbol(meta?.BuyingDAOCoinCreatorPublicKey, profilesByPublicKey);
//   const sellSymbol = getCoinSymbol(meta?.SellingDAOCoinCreatorPublicKey, profilesByPublicKey);

//   // Main summary
//   const orderSummary = (
//     <span>
//       placed an order to buy <Link href={`/${buySymbol}`}>${buySymbol}</Link> with <Link href={`/${sellSymbol}`}>${sellSymbol}</Link>
//     </span>
//   );

//   // Only show fulfilled fills
//   const fills = Array.isArray(meta?.FilledDAOCoinLimitOrdersMetadata)
//     ? meta.FilledDAOCoinLimitOrdersMetadata.filter(f => f.IsFulfilled)
//     : [];

//   // Notification initiator (order-placer) public key
//   // const orderPlacerKey = notification?.TransactorPublicKeyBase58Check || publicKey;

//   return (
//     <div className={styles.notification}>
//       <div role="img" aria-label="dao limit order" className={styles.transferIcon}>
//         📈
//       </div>
//       <div className={styles.notificationContent}>
//         <div className={styles.notificationHeader}>
//           <Link href={`/${username}`}>
//             <Avatar profile={profile} size={48} className={styles.avatar} />
//             <Avatar profile={profile} size={45} className={styles.avatarMobile} />
//           </Link>
//           <div className={styles.notificationSummary}>
//             <div>
//               <Link href={`/${username}`}>{lookupKey}</Link> {orderSummary}
//             </div>
//             {fills.length > 0 && (
//               <div className={styles.daoOrderFills}>
//                 {fills.map((fill, idx) => {
//                   // Who filled the order?
//                   const fillerKey = fill.TransactorPublicKeyBase58Check;
//                   const fillerProfile = profilesByPublicKey?.[fillerKey];
//                   const fillerName = fillerProfile?.Username || fillerKey;
//                   const fillerLabel = isMaybePublicKey(fillerName) ? fillerName : `@${fillerName}`;

//                   // What did the filler buy/sell?
//                   const fillBuySymbol = getCoinSymbol(fill.BuyingDAOCoinCreatorPublicKey, profilesByPublicKey);
//                   const fillSellSymbol = getCoinSymbol(fill.SellingDAOCoinCreatorPublicKey, profilesByPublicKey);
//                   const bought = formatFillAmount(fill.CoinQuantityInBaseUnitsBought, fill.BuyingDAOCoinCreatorPublicKey);
//                   const sold = formatFillAmount(fill.CoinQuantityInBaseUnitsSold, fill.SellingDAOCoinCreatorPublicKey);

//                   // If fillerKey === orderPlacerKey, show as "You bought ... for ..."
//                   // Otherwise, show "@Filler bought ... for ..."
//                   return (
//                     <div key={idx} className={styles.daoOrderFill}>
//                        <Link href={`/${fillerLabel}`}>{fillerLabel}</Link> sold {sold} <Link href={`/${fillSellSymbol}`}>${fillSellSymbol}</Link> for {bought} <Link href={`/${fillBuySymbol}`}>${fillBuySymbol}</Link>
//                     </div>                    
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /*
//   NOTE: 
//   In DeSo, for DAO_COIN_LIMIT_ORDER notifications, "FilledDAOCoinLimitOrdersMetadata" represents fills 
//   performed by other users (counterparties). 
//   The filler ("TransactorPublicKeyBase58Check") bought the BuyCoin and paid with SellCoin.
//   The initiator (the order placer) always gets their order filled; 
//   so from their perspective, it’s always "bought X for Y" or "sold X for Y" depending on the role,
//   but on the notification feed, you'll see counterparty fills as "@Someone bought X for Y".
//   This matches the style on DeSo Explorer and Openfund trade UIs.
// */
