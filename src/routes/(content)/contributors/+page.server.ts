import type { PageServerLoad } from "./$types";
import type { Contributors } from "$lib/ambient";

import { getContributors } from "$lib/helpers";
import { supabase } from "$lib/supabaseClient";

export const load: PageServerLoad = async (): Promise<{
	contributors: Promise<Contributors | null>;
}> => {
	const { data, error } = await supabase.from("contributors").select("name, amount");
	return {
		contributors: new Promise((resolve, reject) => {
			if (error) reject(error);
			else resolve(getContributors(data));
		})
	};
};
