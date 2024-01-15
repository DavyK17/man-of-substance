import type { ParamMatcher } from "@sveltejs/kit";

export const match: ParamMatcher = (param: string) => {
	return param === "synopsis" || param === "lyrics" || param === "credits";
};
