import type { PageServerLoad } from "./$types";
import type { ContributorsByTier } from "$lib/ambient";

import { List } from "$lib/helpers/contributors";
import { supabase } from "$lib/supabaseClient";

export const load: PageServerLoad = async (): Promise<{
	contributors: Promise<ContributorsByTier | null>;
}> => {
	try {
		const { data, error } = await supabase.from("contributors").select("name, amount");
		return { contributors: new Promise((resolve) => resolve(error ? null : List.getByTier(data))) };
	} catch (error) {
		console.error(error);
		return { contributors: new Promise((resolve) => resolve(null)) };
	}
};
