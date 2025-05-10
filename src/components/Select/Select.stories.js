import { Select } from "./Select";

const themeDecorator = (theme) => (Story) => (
  <div
    data-theme={theme}
    style={{ padding: "10rem", background: theme === "light" ? "#fff" : "#1d2125" }}
  >
    <Story />
  </div>
);

export default {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
  },
};

const options = [
  { label: "Option 1", value: "opt1" },
  { label: "Option 2", value: "opt2" },
  { label: "Option 3", value: "opt3" },
];

export const DefaultDark = {
  name: "Default (Dark Theme)",
  render: (args) => <Select {...args} options={options} />,
  args: {
    size: "medium",
    placeholder: "Select an option",
  },
  decorators: [themeDecorator("dark")],
};

export const DefaultLight = {
  name: "Default (Light Theme)",
  render: (args) => <Select {...args} options={options} />,
  args: {
    size: "medium",
    placeholder: "Select an option",
  },
  decorators: [themeDecorator("light")],
};

export const WithSelectedValue = {
  name: "With Selected Value",
  render: (args) => <Select {...args} options={options} />,
  args: {
    size: "medium",
    placeholder: "Select an option",
    value: "opt2",
  },
  decorators: [themeDecorator("dark")],
};

export const SmallDark = {
  render: (args) => <Select {...args} options={options} />,
  args: {
    size: "small",
    placeholder: "Small select",
  },
  decorators: [themeDecorator("dark")],
};

export const LargeLight = {
  render: (args) => <Select {...args} options={options} />,
  args: {
    size: "large",
    placeholder: "Large select",
  },
  decorators: [themeDecorator("light")],
};
