import { Items } from "./nav";

it("has correct list of menu items", () => {
	const expectedList = [
		{ title: "Contributors", slug: "contributors" },
		{ title: "Tracklist", slug: "tracks" },
		{ title: "Credits", slug: "credits" }
	];
	expect(Items.list).toEqual(expectedList);
});

it("getPathRegex returns correct regex for given slug", () => {
	const regex = Items.getPathRegex("tracks");
	expect(regex).toEqual(/^\/tracks(?:\/.*)?$/);
});

it("getPathRegex matches correct paths", () => {
	const regex = Items.getPathRegex("credits");
	expect(regex.test("/credits")).toBe(true);
	expect(regex.test("/credits/extra")).toBe(true);
	expect(regex.test("/credits-extra")).toBe(false);
});
