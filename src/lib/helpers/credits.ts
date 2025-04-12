import type { AlbumCreditKey, AlbumCreditTitles } from "$lib/types/general";

export const Page = {
	/**
	 * An object with credit titles as values for each corresponding key in `AlbumCredits`.
	 */
	creditTitles: {
		execProducers: "Executive producer",
		photography: "Photography",
		styling: "Styling",
		artwork: "Artwork",
		trailer: "Trailer",
		visualiser: "Visualiser",
		website: "Website"
	} as AlbumCreditTitles,
	/**
	 * Renders a credit title in singular or plural as appropriate.
	 * @param {AlbumCreditKey} key - An `AlbumCreditKey` string
	 * @param {string[]} data - An array of credits as strings
	 * @returns {string} A formatted string with the credit title
	 */
	renderCreditTitle: (key: AlbumCreditKey, data: string[]): string => {
		return key === "execProducers" ? `${Page.creditTitles[key]}${data.length > 1 ? "s" : ""}` : Page.creditTitles[key];
	}
};
