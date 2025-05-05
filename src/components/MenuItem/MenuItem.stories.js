import { MenuItem } from './MenuItem';
import { Home } from '@/assets/icons';

const themeDecorator = (theme) => (Story) => (
  <div data-theme={theme} style={{ padding: '1rem', background: theme === 'light' ? '#fff' : '#1d2125' }}>
    <Story />
  </div>
);

export default {
  title: 'Components/MenuItem',
  component: MenuItem,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    variant: {
        control: { type: 'select' },
        options: ['default', 'danger'],
    },    
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export const DefaultDark = {
  name: 'Default (Dark Theme)',
  args: {
    children: 'Menu Item',
    size: 'medium',
  },
  decorators: [themeDecorator('dark')],
};

export const DefaultLight = {
  name: 'Default (Light Theme)',
  args: {
    children: 'Menu Item',
    size: 'medium',
  },
  decorators: [themeDecorator('light')],
};

export const WithIconDark = {
  args: {
    children: 'With Icon',
    size: 'medium',
    icon: <Home />,
  },
  decorators: [themeDecorator('dark')],
};

export const WithIconLight = {
  args: {
    children: 'With Icon',
    size: 'medium',
    icon: <Home />,
  },
  decorators: [themeDecorator('light')],
};

export const CheckedDark = {
  args: {
    children: 'Checked Item',
    size: 'medium',
    checked: true,
  },
  decorators: [themeDecorator('dark')],
};

export const CheckedLight = {
  args: {
    children: 'Checked Item',
    size: 'medium',
    checked: true,
  },
  decorators: [themeDecorator('light')],
};

export const DisabledDark = {
  args: {
    children: 'Disabled Item',
    size: 'medium',
    disabled: true,
  },
  decorators: [themeDecorator('dark')],
};

export const DisabledLight = {
  args: {
    children: 'Disabled Item',
    size: 'medium',
    disabled: true,
  },
  decorators: [themeDecorator('light')],
};

export const DangerDark = {
    name: 'Danger (Dark Theme)',
    args: {
      children: 'Delete item',
      variant: 'danger',
    //   trailingIcon: <Trash />,
    },
    decorators: [themeDecorator('dark')],
 };
  
export const DangerLight = {
    name: 'Danger (Light Theme)',
    args: {
        children: 'Delete item',
        variant: 'danger',
    //   trailingIcon: <Trash />,
    },
    decorators: [themeDecorator('light')],
};