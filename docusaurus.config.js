// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'nestjs-i18n',
  tagline: 'The i18n module for Nest.',
  url: 'nestjs-i18n.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  organizationName: 'toonvanstrijp', // Usually your GitHub org/user name.
  projectName: 'nestjs-i18n', // Usually your repo name.
  trailingSlash: false,
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/toonvanstrijp/nestjs-i18n/tree/main',
        },
        blog: false
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'nestjs-i18n',
        items: [
          {
            href: 'https://github.com/toonvanstrijp/nestjs-i18n',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/ToonvanStrijp/nestjs-i18n',
              },
            ],
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        appId: '4QSCSRMRXX',
        apiKey: '25838fffe3d103d0e180fc4ef4121c50',
        indexName: 'nestjs_i18n',
        contextualSearch: true
      }
    }),
};

module.exports = config;
