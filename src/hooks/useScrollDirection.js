// hooks/useScrollDirection.js
'use client';

import { useEffect, useState } from 'react';

export const useScrollDirection = () => {
  const [scrollUp, setScrollUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollUp(currentY < lastScrollY);
      setScrollY(currentY);
      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return { scrollUp, scrollY };
};