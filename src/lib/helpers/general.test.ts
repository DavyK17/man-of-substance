import type { AlbumCreditKey } from "$lib/types/general";

import { expect, it } from "vitest";
import { Utility } from "$lib/helpers/general";

it("renders titles correctly", () => {
	let key: AlbumCreditKey = "execProducers";
	let title = Utility.renderCreditTitle(key);
	expect(title).toBe("Executive producer");

	key = "photography";
	title = Utility.renderCreditTitle(key);
	expect(title).toBe("Photography");

	key = "styling";
	title = Utility.renderCreditTitle(key);
	expect(title).toBe("Styling");

	key = "artwork";
	title = Utility.renderCreditTitle(key);
	expect(title).toBe("Artwork");

	key = "trailer";
	title = Utility.renderCreditTitle(key);
	expect(title).toBe("Trailer");

	key = "visualiser";
	title = Utility.renderCreditTitle(key);
	expect(title).toBe("Visualiser");

	key = "website";
	title = Utility.renderCreditTitle(key);
	expect(title).toBe("Website");
});
