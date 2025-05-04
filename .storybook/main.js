import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

/** @type { import('@storybook/nextjs').StorybookConfig } */
const config = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  staticDirs: ["../public"],

  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test"
  ],

  framework: {
    name: "@storybook/experimental-nextjs-vite",
    options: {}
  },

  viteFinal: async (config, { configType }) => {
    const __dirname = dirname(fileURLToPath(import.meta.url));

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': join(__dirname, '../src'),
    };

    return config;
  }
};

export default config;




// /** @type { import('@storybook/nextjs').StorybookConfig } */
// const config = {
//   "stories": [
//     "../src/**/*.mdx",
//     "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
//   ],
//   "addons": [
//     "@storybook/addon-essentials",
//     "@storybook/addon-onboarding",
//     "@chromatic-com/storybook",
//     "@storybook/experimental-addon-test"
//   ],
//   "framework": {
//     "name": "@storybook/experimental-nextjs-vite",
//     "options": {}
//   },
//   // "staticDirs": [
//   //   "..\\public"
//   // ]
//   "staticDirs": ["../public"]
// };
// export default config;