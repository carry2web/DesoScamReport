import { fn } from '@storybook/test';
import { Button } from './Button';
import { Home } from '@/assets/icons'; // example icon

const themeDecorator = (theme) => (Story) => (
  <div data-theme={theme} style={{ padding: '1rem', background: theme === 'light' ? '#fff' : '#1d2125' }}>
    <Story />
  </div>
);

export default {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

// === PRIMARY ===
export const PrimaryDark = {
  name: 'Primary (Dark Theme)',
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Primary Button',
  },
  decorators: [themeDecorator('dark')],
};

export const PrimaryLight = {
  name: 'Primary (Light Theme)',
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Primary Button',
  },
  decorators: [themeDecorator('light')],
};

// === SECONDARY ===
export const SecondaryDark = {
  args: {
    variant: 'secondary',
    size: 'medium',
    children: 'Secondary Button',
  },
  decorators: [themeDecorator('dark')],
};

export const SecondaryLight = {
  args: {
    variant: 'secondary',
    size: 'medium',
    children: 'Secondary Button',
  },
  decorators: [themeDecorator('light')],
};

// === DANGER ===
export const DangerDark = {
  args: {
    variant: 'danger',
    size: 'medium',
    children: 'Danger Button',
  },
  decorators: [themeDecorator('dark')],
};

export const DangerLight = {
  args: {
    variant: 'danger',
    size: 'medium',
    children: 'Danger Button',
  },
  decorators: [themeDecorator('light')],
};

// === WITH ICON ===
export const WithIconDark = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'With Icon',
    icon: <Home />,
  },
  decorators: [themeDecorator('dark')],
};

export const WithIconLight = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'With Icon',
    icon: <Home />,
  },
  decorators: [themeDecorator('light')],
};

// === LOADING ===
export const LoadingDark = {
  args: {
    variant: 'primary',
    size: 'medium',
    isLoading: true,
    children: 'Loading...',
  },
  decorators: [themeDecorator('dark')],
};

export const LoadingLight = {
  args: {
    variant: 'primary',
    size: 'medium',
    isLoading: true,
    children: 'Loading...',
  },
  decorators: [themeDecorator('light')],
};

// === SIZES ===
export const SmallDark = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Small Button',
  },
  decorators: [themeDecorator('dark')],
};

export const SmallLight = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Small Button',
  },
  decorators: [themeDecorator('light')],
};

export const LargeDark = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large Button',
  },
  decorators: [themeDecorator('dark')],
};

export const LargeLight = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large Button',
  },
  decorators: [themeDecorator('light')],
};
