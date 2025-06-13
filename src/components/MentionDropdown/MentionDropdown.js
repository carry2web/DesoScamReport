import { FloatingPortal } from "@floating-ui/react";
import { Avatar } from "@/components/Avatar";
import { Dropdown } from "@/components/Dropdown";
import { MenuItem } from "@/components/MenuItem";
import styles from "./MentionDropdown.module.css";

export const MentionDropdown = ({
  isOpen,
  profiles,
  isLoading,
  selectedIndex,
  floatingStyles,
  floatingRef,
  onSelect,
  onHover,
}) => {
  if (!isOpen) return null;

  return (
    <FloatingPortal>
      <div
        ref={floatingRef}
        style={floatingStyles}
        className={styles.container}
      >
        <Dropdown className={styles.dropdown}>
          {isLoading ? (
            <div className={styles.message}>Searching...</div>
          ) : profiles.length > 0 ? (
            profiles.map((profile, index) => (
              <div
                key={profile.PublicKeyBase58Check}
                onMouseEnter={() => onHover(index)}
              >
                <MenuItem
                  onClick={() => onSelect(profile)}
                  checked={index === selectedIndex}
                  icon={<Avatar profile={profile} size={24} />}
                >
                  @{profile.Username}
                </MenuItem>
              </div>
            ))
          ) : (
            <div className={styles.message}>No users found</div>
          )}
        </Dropdown>
      </div>
    </FloatingPortal>
  );
};