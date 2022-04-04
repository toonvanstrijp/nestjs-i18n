// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'nestjs-i18n',
  tagline: 'The i18n module for Nest.',
  url: 'https://nestjs-i18n.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  organizationName: 'toonvanstrijp', // Usually your GitHub org/user name.
  projectName: 'nestjs-i18n', // Usually your repo name.
  trailingSlash: false,
  scripts: [
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js',
    'js/confetti.js',
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/toonvanstrijp/nestjs-i18n/tree/main',
        },
        theme: {
          customCss: [require.resolve('./static/css/custom.css')],
        },
        blog: false,
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'nestjs-i18n logo',
          src: 'img/logo.svg',
          href: '/',
          target: '_self',
        },
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
        logo: {
          src: 'img/debugged.svg',
          width: 400,
          alt: 'debugged',
        },
        copyright: `Sponsored by <a href="https://www.debugged.nl" target="_blank">Debugged</a>`,
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
        appId: 'OY3TO41FL5',
        apiKey: '5386b9f525ec76279a8fdf64c38ab950',
        indexName: 'nestjs-i18n',
        contextualSearch: true,
      },
    }),
};

module.exports = config;
