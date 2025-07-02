import { Placeholder } from './Placeholder';

const themeDecorator = (theme) => (Story) => (
  <div
    data-theme={theme}
    style={{
      padding: '1rem',
      minWidth: '200px',
      background: theme === 'light' ? '#fff' : '#1d2125',
    }}
  >
    <Story />
  </div>
);

export default {
  title: 'Components/Placeholder',
  component: Placeholder,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

// === BLOCK ===
export const BlockDark = {
  name: 'Block (Dark Theme)',
  args: {
    width: '200px',
    height: '100px',
  },
  decorators: [themeDecorator('dark')],
};

export const BlockLight = {
  name: 'Block (Light Theme)',
  args: {
    width: '200px',
    height: '100px',
  },
  decorators: [themeDecorator('light')],
};

// === TEXT LINE ===
export const TextLineDark = {
  args: {
    width: '150px',
    height: '16px',
    borderRadius: '4px',
  },
  decorators: [themeDecorator('dark')],
};

export const TextLineLight = {
  args: {
    width: '150px',
    height: '16px',
    borderRadius: '4px',
  },
  decorators: [themeDecorator('light')],
};

// === CIRCLE (Avatar) ===
export const CircleDark = {
  args: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
  },
  decorators: [themeDecorator('dark')],
};

export const CircleLight = {
  args: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
  },
  decorators: [themeDecorator('light')],
};

// === FULL WIDTH BAR ===
export const FullWidthDark = {
  args: {
    width: '100%',
    height: '24px',
  },
  decorators: [themeDecorator('dark')],
};

export const FullWidthLight = {
  args: {
    width: '100%',
    height: '24px',
  },
  decorators: [themeDecorator('light')],
};

// === MIXED EXAMPLE ===
export const MixedExampleDark = {
  name: 'Mixed Example (Dark)',
  render: () => (
    <div
      data-theme="dark"
      style={{
        width: '300px',
        gap: '8px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        <Placeholder width="40px" height="40px" borderRadius="50%" />
        <div style={{ flex: 1 }}>
          <Placeholder
            width="100%"
            height="14px"
            style={{ marginBottom: '8px' }}
          />
          <Placeholder width="80%" height="14px" />
        </div>
      </div>
      <Placeholder width="100%" height="150px" borderRadius="var(--radius-md)" />
    </div>
  ),
};

export const MixedExampleLight = {
  name: 'Mixed Example (Light)',
  render: () => (
    <div
      data-theme="light"
      style={{
        width: '300px',
        gap: '8px',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        padding: '1rem',
      }}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        <Placeholder width="40px" height="40px" borderRadius="50%" />
        <div style={{ flex: 1 }}>
          <Placeholder
            width="100%"
            height="14px"
            style={{ marginBottom: '8px' }}
          />
          <Placeholder width="80%" height="14px" />
        </div>
      </div>
      <Placeholder width="100%" height="150px" borderRadius="var(--radius-md)" />
    </div>
  ),
};
