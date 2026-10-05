import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This file runs in Node.js at build time. Keep browser code out of it.

// GitHub Pages serves a project site at https://<owner>.github.io/<repo>/.
// Change these two values if the repository is renamed or moved.
const githubOwner = 'avalynn-circe';
const githubRepo = 'circe-docs';

const config: Config = {
  title: 'Circe Docs',
  tagline: 'Technical writing by Avalynn Circe, published as code.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: `https://${githubOwner}.github.io`,
  baseUrl: `/${githubRepo}/`,
  organizationName: githubOwner,
  projectName: githubRepo,

  // Any internal link or anchor that points nowhere fails the build.
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: {
    // .md files are plain CommonMark; .mdx files get MDX. Keeps JSX syntax out of prose.
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          // Docs-only mode: the docs folder is the whole site.
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: `https://github.com/${githubOwner}/${githubRepo}/tree/main/`,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Circe Docs',
      items: [
        {
          href: 'https://avalynncirce.com/',
          label: 'AvalynnCirce.com',
          position: 'right',
        },
        {
          href: `https://github.com/${githubOwner}/${githubRepo}`,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Pages',
          items: [
            {label: 'Weather-aware AI skill', to: '/xweather-skill'},
            {label: 'MCP tutorial review', to: '/mcp-tutorial-review'},
          ],
        },
        {
          title: 'Elsewhere',
          items: [
            {label: 'AvalynnCirce.com', href: 'https://avalynncirce.com/'},
            {label: 'GitHub', href: `https://github.com/${githubOwner}/${githubRepo}`},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Avalynn Circe. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'python'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
