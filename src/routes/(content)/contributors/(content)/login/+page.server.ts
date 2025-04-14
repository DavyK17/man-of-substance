import { fail, redirect } from "@sveltejs/kit";
import moment from "moment";

import { env } from "$env/dynamic/private";
import { Status, Utility } from "$lib/helpers/general";

/* Load function */
export const load = async ({ locals: { user } }) => {
	if (user) throw redirect(307, "/contributors/rewards");
};

/* Form action */
export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		try {
			// Get form data
			const formData = await request.formData();

			// Validate email
			const email = formData.get("email") as string;
			if (!email) return fail(400, { message: "Please enter a valid email address." });

			// Log in
			const {
				data: { user },
				error: loginError
			} = await supabase.auth.signInWithPassword({ email, password: env.CONTRIBUTOR_PASSWORD });
			if (loginError) return fail(loginError.status ?? 500, { message: loginError.message });

			// Get contributor data
			const { data, error: contributorError } = await supabase
				.from("contributors")
				.select("amount, rewards_claimed")
				.eq("email", user!.email!)
				.single();
			if (contributorError) {
				const { error } = Utility.parsePostgrestError(contributorError);
				return fail(error!.code, { message: error!.message });
			}
			const { amount, rewards_claimed: rewardsClaimed } = data;

			// Log out and return error if rewards already claimed
			if (rewardsClaimed) {
				const { error } = await supabase.auth.signOut();
				if (error) return fail(error.status ?? 500, { message: error.message });
				return fail(403, { message: "Rewards have already been claimed for this user." });
			}

			// CONTENT LOCK CHECKS
			//-/ Supporter and bronze (unlocks on release day)
			if (amount >= 100 && amount <= 1999 && Date.now() < 1667509200000)
				return fail(403, {
					message: `Your rewards will be available ${moment(1667509200000).fromNow()}.`
				});

			//-/ Silver to platinum (unlocks 3 days early)
			if (amount >= 2000 && amount <= 49999 && Date.now() < 1667250000000)
				return fail(403, {
					message: `Your rewards will be available ${moment(1667250000000).fromNow()}.`
				});

			//-/ Executive (unlocks 7 days early)
			if (amount >= 50000 && Date.now() < 1666904400000)
				return fail(403, {
					message: `Your rewards will be available ${moment(1666904400000).fromNow()}.`
				});

			// Redirect to rewards
			return { success: true };
		} catch (err) {
			console.error(err);
			return fail(500, { message: Status.ERROR });
		}
	}
};
