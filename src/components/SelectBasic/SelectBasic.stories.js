import { Select } from './Select';

const themeDecorator = (theme) => (Story) => (
  <div data-theme={theme} style={{ padding: '1rem', background: theme === 'light' ? '#fff' : '#1d2125' }}>
    <Story />
  </div>
);

export default {
  title: 'Components/SelectBasic',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

const options = [
  { value: '', label: 'Select option', disabled: true },
  { value: 'one', label: 'Option One' },
  { value: 'two', label: 'Option Two' },
  { value: 'three', label: 'Option Three' },
];

// === DARK THEME ===
export const DefaultDark = {
  name: 'Default (Dark Theme)',
  args: {
    value: '',
    onChange: () => {},
    placeholder: 'Select an option',
    options,
    size: 'medium',
  },
  decorators: [themeDecorator('dark')],
};

export const ErrorDark = {
  args: {
    value: '',
    onChange: () => {},
    placeholder: 'Select an option',
    options,
    error: true,
  },
  decorators: [themeDecorator('dark')],
};

export const DisabledDark = {
  args: {
    value: '',
    onChange: () => {},
    placeholder: 'Disabled select',
    options,
    disabled: true,
  },
  decorators: [themeDecorator('dark')],
};

// === LIGHT THEME ===
export const DefaultLight = {
  name: 'Default (Light Theme)',
  args: {
    value: '',
    onChange: () => {},
    placeholder: 'Select an option',
    options,
    size: 'medium',
  },
  decorators: [themeDecorator('light')],
};

export const ErrorLight = {
  args: {
    value: '',
    onChange: () => {},
    placeholder: 'Select an option',
    options,
    error: true,
  },
  decorators: [themeDecorator('light')],
};

export const DisabledLight = {
  args: {
    value: '',
    onChange: () => {},
    placeholder: 'Disabled select',
    options,
    disabled: true,
  },
  decorators: [themeDecorator('light')],
};