import type { Track } from "$lib/types/general";

import { expect, it } from "vitest";
import { List, Page } from "./tracks";

it("builds tracklist correctly", () => {
	const tracklist = List.build(List.mockData as Track[], "base");
	expect(tracklist).toHaveLength(10);
});

it("gets tracklist parts correctly", () => {
	const tracklist = List.build(List.mockData as Track[], "full");

	const one = List.getPart(tracklist, "full", 1);
	expect(one).toHaveLength(7);

	const two = List.getPart(tracklist, "full", 2);
	expect(two).toHaveLength(7);

	const three = List.getPart(tracklist, "full", 3);
	expect(three).toHaveLength(3);
});

it("formats runtime unit correctly", () => {
	let formatted = Page.formatRuntimeUnit("min", 3);
	expect(formatted).toBe("3 minutes");

	formatted = Page.formatRuntimeUnit("sec", 3);
	expect(formatted).toBe("3 seconds");
});

it("displays writers correctly", () => {
	const writers = Page.displayWriters(List.mockData[0] as Track);
	expect(writers).toBe("Davy Kamanzi, Ariane Uwizera, and Sidney Kamanzi");
});

it("displays runtime correctly", () => {
	const runtime = Page.displayRuntime(List.mockData[0] as Track);
	expect(runtime).toBe("1 minute and 4 seconds");
});

it("renders credit title correctly", () => {
	let title = Page.renderCreditTitle("producers", ["John Doe"]);
	expect(title).toBe("Producer");

	title = Page.renderCreditTitle("producers", ["John Doe", "Jane Doe"]);
	expect(title).toBe("Producers");
});
