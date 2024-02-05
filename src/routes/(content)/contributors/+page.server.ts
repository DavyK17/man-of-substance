import type { PageServerLoad } from "./$types";
import type { ContributorsByTier } from "$lib/ambient";

import { List } from "$lib/helpers/contributors";
import { supabase } from "$lib/supabaseClient";

export const load: PageServerLoad = async (): Promise<{
	contributors: Promise<ContributorsByTier | null>;
}> => {
	const { data, error } = await supabase.from("contributors").select("name, amount");
	return {
		contributors: new Promise((resolve, reject) =>
			error ? reject(error) : resolve(List.getByTier(data))
		)
	};
};
