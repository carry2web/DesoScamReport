"use client";

import { useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useClickOutside } from '@/hooks/useClickOutside';

import { 
  ThemeSelector as ThemeSelectIcon,
  ThemeLight as ThemeLightIcon, 
  ThemeDark as ThemeDarkIcon, 
} from '@/assets/icons';

import styles from './ThemeSelector.module.css';

export const ThemeSelector = () => {
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => setOpen(false));

  const handleThemeSelect = (value) => {
    setTheme(value);
    setOpen(false);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <button className={styles.button} onClick={() => setOpen((prev) => !prev)}>
        <ThemeSelectIcon />
      </button>

      {open && (
        <div className={styles.dropdown}>
          <button
            className={styles.item}
            onClick={() => handleThemeSelect('dark')}
          >
            <ThemeDarkIcon />
          </button>
          <button
            className={styles.item}
            onClick={() => handleThemeSelect('light')}
          >
            <ThemeLightIcon />
          </button>
        </div>
      )}
    </div>
  );
};




// import { useTheme } from 'next-themes';

// export const ThemeSelector = () => {
//   const { theme, setTheme } = useTheme();

//   return (
//     <select value={theme} onChange={(e) => setTheme(e.target.value)}>
//       <option value="dark">Dark</option>
//       <option value="light">Light</option>
//     </select>
//   );
// };