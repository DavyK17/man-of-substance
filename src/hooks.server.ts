import type { Handle } from "@sveltejs/kit";
import type { Database } from "$lib/types/database";

import { sequence } from "@sveltejs/kit/hooks";
import { createServerClient } from "@supabase/ssr";

import { env } from "$env/dynamic/public";
import { List } from "$lib/helpers/tracks";

// Supabase SSR
export const supabaseHandle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient<Database>(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				/**
				 * Note: You have to add the `path` variable to the
				 * set and remove method due to sveltekit's cookie API
				 * requiring this to be set, setting the path to an empty string
				 * will replicate previous/standard behavior (https://kit.svelte.dev/docs/types#public-types-cookies)
				 */
				cookiesToSet.forEach(({ name, value, options }) => event.cookies.set(name, value, { ...options, path: "/" }));
			}
		}
	});

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) return { session: null, user: null };

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) return { session: null, user: null };

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === "content-range" || name === "x-supabase-api-version";
		}
	});
};

// Tracks
export const tracksHandle: Handle = async ({ event, resolve }) => {
	// Get tracks from database
	const { data, error } = await event.locals.supabase.from("tracks").select();
	if (error)
		return resolve(event, {
			filterSerializedResponseHeaders(name) {
				return name === "content-range" || name === "x-supabase-api-version";
			}
		});

	// Format data
	event.locals.tracks = data.map((track) => {
		const { synopsis, lyrics, credits } = List.data.find(({ id }) => id === track.id)!;
		return {
			id: track.id,
			title: track.title,
			filename: track.filename,
			runtime: track.runtime,
			style: track.style,
			synopsis,
			lyrics,
			credits,
			missingFrom: track.missing_from ?? undefined
		};
	});

	// Resolve event
	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === "content-range" || name === "x-supabase-api-version";
		}
	});
};

// Export handlers
export const handle = sequence(supabaseHandle, tracksHandle);
export const handleError = ({ error }) => {
	console.error("An unexpected server error occurred.", error);
	return { message: "An unexpected server error occurred. Kindly try again." };
};
