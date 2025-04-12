import type { AlbumCreditKey } from "$lib/types/general";
import { Page } from "./credits";

it("renders executive producer title in singular", () => {
	const key: AlbumCreditKey = "execProducers";
	const data = ["John Doe"];
	const title = Page.renderCreditTitle(key, data);
	expect(title).toBe("Executive producer");
});

it("renders executive producer title in plural", () => {
	const key: AlbumCreditKey = "execProducers";
	const data = ["John Doe", "Jane Doe"];
	const title = Page.renderCreditTitle(key, data);
	expect(title).toBe("Executive producers");
});

it("renders non-executive producer title", () => {
	const key: AlbumCreditKey = "photography";
	const data = ["John Doe"];
	const title = Page.renderCreditTitle(key, data);
	expect(title).toBe("Photography");
});
