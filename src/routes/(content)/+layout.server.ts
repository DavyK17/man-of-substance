import type { PageServerLoad, PageServerLoadEvent } from "../$types";

export const load: PageServerLoad = async ({ cookies, parent }: PageServerLoadEvent) => {
	const passcode = cookies.get("passcode");
	const released = (await parent()).released;

	return { released, unlocked: passcode === "true" || released };
};
