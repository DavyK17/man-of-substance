import type { Database } from "$lib/types/database";

import { createBrowserClient, createServerClient, isBrowser } from "@supabase/ssr";
import { env } from "$env/dynamic/public";

import cover from "$lib/img/cover.webp";
import cover_fallback from "$lib/img/cover.jpg";
import placeholder from "$lib/img/placeholder.webp";
import placeholder_fallback from "$lib/img/placeholder.png";

/* LOAD FUNCTION */
export const load = async ({ data: { cookies }, depends, fetch }) => {
	/**
	 * Declare a dependency so the layout can be invalidated, for example, on
	 * session refresh.
	 */
	depends("supabase:auth");

	const supabase = isBrowser()
		? createBrowserClient<Database>(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_KEY, {
				global: {
					fetch
				}
			})
		: createServerClient<Database>(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_KEY, {
				global: {
					fetch
				},
				cookies: {
					getAll() {
						return cookies;
					}
				}
			});

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */
	const {
		data: { session }
	} = await supabase.auth.getSession();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	// Listening party logic
	const passcode = Boolean(cookies.find(({ name }) => name === "passcode"));

	const locked = Date.now() < 1666904400000;
	const listeningParty = Date.now() > 1667059200000 && Date.now() < 1667070000000;
	const released = Date.now() > 1667509200000;

	let componentType: "countdown" | "listeningParty" | "home";
	if (locked) componentType = "countdown";
	else if (!passcode && listeningParty) componentType = "listeningParty";
	else componentType = "home";

	// Return data
	return {
		componentType,
		cover: {
			default: passcode || released ? cover : placeholder,
			fallback: passcode || released ? cover_fallback : placeholder_fallback
		},
		released,
		session,
		supabase,
		user
	};
};
