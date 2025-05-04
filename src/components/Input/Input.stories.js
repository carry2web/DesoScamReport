import { fn } from '@storybook/test';
import { Input } from './Input';
import { Home as Icon } from '@/assets/icons';

const themeDecorator = (theme) => (Story) => (
    <div data-theme={theme} style={{ padding: '1rem', background: theme === 'light' ? '#fff' : '#1d2125' }}>
      <Story />
    </div>
);

export default {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    value: '',
    onChange: fn(),
    placeholder: 'Enter text...',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

// === DEFAULT ===
export const DefaultDark = {
  name: 'Default (Dark Theme)',
  args: {
    size: 'medium',
  },
  decorators: [themeDecorator('dark')],
};

export const DefaultLight = {
  name: 'Default (Light Theme)',
  args: {
    size: 'medium',
  },
  decorators: [themeDecorator('light')],
};

// === WITH ICON ===
export const WithIconDark = {
  args: {
    size: 'medium',
    icon: <Icon />,
  },
  decorators: [themeDecorator('dark')],
};

export const WithIconLight = {
  args: {
    size: 'medium',
    icon: <Icon />,
  },
  decorators: [themeDecorator('light')],
};

// === TRAILING ICON ===
export const TrailingIconDark = {
  args: {
    size: 'medium',
    trailingIcon: <Icon />,
  },
  decorators: [themeDecorator('dark')],
};

export const TrailingIconLight = {
  args: {
    size: 'medium',
    trailingIcon: <Icon />,
  },
  decorators: [themeDecorator('light')],
};

// === ERROR STATE ===
export const ErrorDark = {
  args: {
    size: 'medium',
    value: 'Invalid input',
    error: true,
  },
  decorators: [themeDecorator('dark')],
};

export const ErrorLight = {
  args: {
    size: 'medium',
    value: 'Invalid input',
    error: true,
  },
  decorators: [themeDecorator('light')],
};

// === DISABLED ===
export const DisabledDark = {
  args: {
    size: 'medium',
    value: 'Disabled',
    disabled: true,
  },
  decorators: [themeDecorator('dark')],
};

export const DisabledLight = {
  args: {
    size: 'medium',
    value: 'Disabled',
    disabled: true,
  },
  decorators: [themeDecorator('light')],
};

// === SIZES ===
export const SmallDark = {
  args: {
    size: 'small',
    placeholder: 'Small input',
  },
  decorators: [themeDecorator('dark')],
};

export const SmallLight = {
  args: {
    size: 'small',
    placeholder: 'Small input',
  },
  decorators: [themeDecorator('light')],
};

export const LargeDark = {
  args: {
    size: 'large',
    placeholder: 'Large input',
  },
  decorators: [themeDecorator('dark')],
};

export const LargeLight = {
  args: {
    size: 'large',
    placeholder: 'Large input',
  },
  decorators: [themeDecorator('light')],
};
