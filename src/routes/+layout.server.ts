import type { LayoutServerLoad, LayoutServerLoadEvent } from "./$types";

import cover from "$lib/img/cover.webp";
import cover_fallback from "$lib/img/cover.jpg";

import placeholder from "$lib/img/placeholder.webp";
import placeholder_fallback from "$lib/img/placeholder.png";

export const load: LayoutServerLoad = ({ cookies }: LayoutServerLoadEvent) => {
	const passcode = Boolean(cookies.get("passcode"));

	const locked = Date.now() < 1666904400000;
	const listeningParty = Date.now() > 1667059200000 && Date.now() < 1667070000000;
	const released = Date.now() > 1667509200000;

	let componentType: "countdown" | "listeningParty" | "home";
	if (locked) componentType = "countdown";
	else if (!passcode && listeningParty) componentType = "listeningParty";
	else componentType = "home";

	return {
		released,
		componentType,
		cover: {
			default: passcode || released ? cover : placeholder,
			fallback: passcode || released ? cover_fallback : placeholder_fallback
		}
	};
};
