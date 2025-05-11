"use client";

import styles from './Footer.module.css';

export const Footer = () => {

  return (
    <footer className={styles.container}>
        <div>
          Designed by <a href="https://focus.xyz/brootle" target="_blank" rel="noreferrer">brootle</a>
        </div>
        <div>
          Source code at <a href="https://github.com/brootle/deso-starter-nextjs-plus" target="_blank" rel="noreferrer">Github</a>
        </div>
    </footer>
  );
}
