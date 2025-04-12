import type { NavMenuItem } from "$lib/types/general";

export const Items = {
	/**
	 * An array of menu items, each with the following properties:
	 * - `title` — A string; the item's title as displayed on the site
	 * - `slug` — A string; the item's URL slug
	 */
	list: [
		{ title: "Contributors", slug: "contributors" },
		{ title: "Tracklist", slug: "tracks" },
		{ title: "Credits", slug: "credits" }
	] as NavMenuItem[],
	/**
	 * Returns a regular expression for a menu item to match when rendering its "active" class on the site.
	 * @param {string} slug - The item's URL slug
	 * @returns {RegExp} A regular expression
	 */
	getPathRegex: (slug: string): RegExp => new RegExp(`^/${slug}(?:/.*)?$`)
};
