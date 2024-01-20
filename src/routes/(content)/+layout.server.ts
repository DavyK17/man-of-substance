import type { LayoutServerLoad, LayoutServerLoadEvent } from "./$types";

export const load: LayoutServerLoad = async ({ cookies, parent }: LayoutServerLoadEvent) => {
	const passcode = cookies.get("passcode");
	const released = (await parent()).released;

	return { released, unlocked: passcode === "true" || released };
};
