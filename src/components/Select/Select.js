"use client";

import { useState, useRef, useEffect } from "react";
import { useFloating, offset, flip, shift, size as applySize, autoUpdate, FloatingPortal } from "@floating-ui/react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Dropdown } from "@/components/Dropdown";
import { MenuItem } from "@/components/MenuItem";
import classNames from "classnames";
import styles from "./Select.module.css";

export const Select = ({ options, placeholder = "Select...", value, onChange, size = "medium", floatingRef, maxHeight }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  const {
    refs,
    floatingStyles,
  } = useFloating({
    placement: "bottom-start",
    strategy: "fixed", // prevent flickering on page scroll when dropdown opened
    middleware: [
      offset(4),
      flip(),
      shift(),
      applySize({
        apply: ({ rects, elements }) => {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });


  useClickOutside([refs.reference, refs.floating], () => {
    setIsOpen(false);
  });

  const selected = options.find((opt) => opt.value === value);

  // assignment to only happen when the dropdown is open and the floating element has mounted
  useEffect(() => {
    if (!floatingRef || !isOpen) return;
  
    const el = refs.floating.current;
  
    if (el) {
      floatingRef.current = el;
    } else {
      // fallback to try next frame
      const frame = requestAnimationFrame(() => {
        if (refs.floating.current) {
          floatingRef.current = refs.floating.current;
        }
      });
  
      return () => cancelAnimationFrame(frame);
    }
  }, [floatingRef, isOpen, refs.floating]);
  
  // avoid future leakage, clear the ref on close
  useEffect(() => {
    if (!isOpen && floatingRef) {
      floatingRef.current = null;
    }
  }, [isOpen, floatingRef]);    


  return (
    <div className={styles.selectWrapper} ref={refs.setReference}>
      <button
        ref={buttonRef}
        className={classNames(styles.selectButton, styles[size])}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selected?.label || placeholder}
      </button>

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={styles.dropdownContainer}
          >
            <Dropdown maxHeight={maxHeight}>
              {options.map((option) => (
                <MenuItem
                    key={option.value}
                    onClick={() => {
                        onChange?.({ target: { value: option.value } });
                        setIsOpen(false);
                    }}
                    checked={option.value === value}
                    icon={option.icon} // ✅ Pass icon through
                >
                    {option.label}
                </MenuItem>                
              ))}
            </Dropdown>
          </div>
        </FloatingPortal>
      )}
    </div>
  );
};