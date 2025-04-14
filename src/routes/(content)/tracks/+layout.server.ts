import { List } from "$lib/helpers/tracks";
import { Utility } from "$lib/helpers/general";

export const load = async ({ locals: { supabase } }) => {
	// Get tracks from database
	const { data, error } = await supabase.from("tracks").select();
	if (error) {
		const { error: loadError } = Utility.parsePostgrestError(error);
		throw Utility.parseLoadError(loadError!);
	}

	// Format data
	const tracks = data.map((track) => {
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

	// Return data
	return { tracks };
};
