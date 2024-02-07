import type { PageServerLoad, Actions } from "./$types";
import type { Contributor } from "$lib/ambient";

import moment from "moment";
import { fail, redirect } from "@sveltejs/kit";

import { supabase } from "$lib/supabaseClient";
import { Generic } from "$lib/helpers/status";

export const load: PageServerLoad = async ({ cookies }) => {
	const email = cookies.get("mos-contributor");
    if (email) throw redirect(307, "/contributors/rewards");
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		try {
			// Get form data
			const formData = await request.formData();

			// Validate existence of email
			const email = formData.get("email") as string;
			if (!email) return fail(400, { message: "Please enter a valid email address" });

			// Get contributor
			const { data, error } = await supabase.from("contributors").select("*").eq("email", email);

			if (error) {
				const { code, message } = error;
				console.error(message);
				return fail(Number(code), { message: "An unknown error occurred. Kindly try again." });
			}

			// If no data returned, return error
			if (data.length === 0)
				return fail(404, { message: "This email does not exist in the database" });

			// If rewards already claimed, return error
			if (data[0].rewards_claimed)
				return fail(403, { message: "Rewards have already been claimed for this user" });

			// CONTENT LOCK CHECKS
			const { amount } = data[0] as Contributor;

			//-/ Supporter and bronze
			if (amount >= 100 && amount <= 1999 && Date.now() < 1667509200000)
				return fail(403, {
					message: `Your rewards will be available ${moment(1667509200000).fromNow()}`
				});

			//-/ Silver to platinum
			if (amount >= 2000 && amount <= 49999 && Date.now() < 1667250000000)
				return fail(403, {
					message: `Your rewards will be available ${moment(1667250000000).fromNow()}`
				});

			//-/ Executive
			if (amount >= 50000 && Date.now() < 1666904400000)
				return fail(403, {
					message: `Your rewards will be available ${moment(1666904400000).fromNow()}`
				});

			// Set cookie
			cookies.set("mos-contributor", email, {
				path: "/contributors",
				expires: new Date(Date.now() + 86400) // next day
			});

            // Redirect to rewards
            return { success: true };
		} catch (err) {
			console.error(err);
			return fail(500, { message: Generic.ERROR });
		}
	}
};
