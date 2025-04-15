import type { Actions } from "./$types";

import { fail } from "@sveltejs/kit";
import { CHALLENGE_ANSWER } from "$env/static/private";

import { Status } from "$lib/helpers/tracks";
import { Status as Generic } from "$lib/helpers/general";

export const actions: Actions = {
	start: async ({ request }) => {
		const formData = await request.formData();
		const answer = formData.get("answer");

		if (!answer) return fail(400, { started: false, message: "No answer provided!" });
		return { data: { answer: answer as string }, started: true };
	},
	attempt: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const answer = formData.get("answer") as string;
		const name = formData.get("name") as string;
		const phone = formData.get("phone") as string;

		try {
			const { error } = await supabase.from("challenge_attempts").insert({ name, phone, answer: Number(answer) });
			if (error) {
				// Database triggers: Check for challenge completed and daily attempt limit errors
				console.log(error.message);
				return fail(Number(error.code), {
					data: { answer, name, phone },
					started: true,
					success: false,
					message: Generic.ERROR
				});
			}

			// Edge Function: Add payment for successful attempt

			return {
				data: answer === CHALLENGE_ANSWER ? undefined : { name, phone },
				started: false,
				success: answer === CHALLENGE_ANSWER,
				message: answer === CHALLENGE_ANSWER ? Status.CHALLENGE_SUCCESSFUL : Status.CHALLENGE_FAILED
			};
		} catch (err) {
			console.error(err);
			return fail(500, {
				data: { answer, name, phone },
				started: true,
				success: false,
				message: Generic.ERROR
			});
		}
	}
};
