import { Dropdown } from "./Dropdown";
import { DropdownSection } from "./DropdownSection";
import { MenuItem } from "@/components/MenuItem";
import { Home } from "@/assets/icons";

const themeDecorator = (theme) => (Story) => (
  <div
    data-theme={theme}
    style={{ padding: "1rem", background: theme === "light" ? "#fff" : "#1d2125" }}
  >
    <Story />
  </div>
);

export default {
  title: "Components/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

const dropdownContent = (
  <Dropdown align="left" matchTriggerWidth>
    <DropdownSection label="Navigation">
      <MenuItem icon={<Home />}>Home</MenuItem>
      <MenuItem>Profile</MenuItem>
    </DropdownSection>
    <div className="separator" />
    <DropdownSection label="Danger Zone">
      <MenuItem variant="danger" trailingIcon={<Home />}>Delete Account</MenuItem>
    </DropdownSection>
  </Dropdown>
);

export const DefaultDark = {
  name: "Default (Dark Theme)",
  render: () => dropdownContent,
  decorators: [themeDecorator("dark")],
};

export const DefaultLight = {
  name: "Default (Light Theme)",
  render: () => dropdownContent,
  decorators: [themeDecorator("light")],
};
