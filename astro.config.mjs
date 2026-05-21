// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	// SITE_URL is set per environment (.env for local, GitHub Actions vars for CI).
	// Required by @astrojs/sitemap; when unset, the sitemap integration skips.
	site: process.env.SITE_URL,
	integrations: [
		starlight({
			title: 'Agile Flow',
			description:
				'Documentation for the Agile Flow agent harness — a multi-agent development workflow for solo founders.',
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/vibeacademy/agile-flow',
				},
			],
			sidebar: [
				{
					label: 'Start here',
					items: [{ label: 'Introduction', slug: 'guides/example' }],
				},
				{
					label: 'Reference',
					items: [{ autogenerate: { directory: 'reference' } }],
				},
			],
		}),
	],
});
