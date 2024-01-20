import type { ParamMatcher } from "@sveltejs/kit";

export const match: ParamMatcher = (param: string) => {
	return parseInt(param) >= 1 && parseInt(param) <= 17;
};
