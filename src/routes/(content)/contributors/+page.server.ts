import type { PageServerLoad } from "./$types";
import type { ContributorsByTier } from "$lib/types/general";

import { List } from "$lib/helpers/contributors";

export const load: PageServerLoad = async ({
	locals: { supabase }
}): Promise<{
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
