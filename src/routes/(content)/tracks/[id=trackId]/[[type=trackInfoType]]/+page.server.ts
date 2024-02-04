import type { Actions } from "./$types";

import { fail } from "@sveltejs/kit";
import { formatResponseMessage } from "$lib/helpers/helpers";
import { supabase } from "$lib/supabaseClient";

export const actions: Actions = {
	start: async ({ request }) => {
		const data = await request.formData();
		const answer = data.get("answer");

		if (!answer) return fail(400, { started: false, message: "No answer provided!" });
		return { data: { answer: answer as string }, started: true };
	},

	attempt: async ({ fetch, request }) => {
		const data = await request.formData();

		const answer = data.get("answer") as string;
		const name = data.get("name") as string;
		const phone = data.get("phone") as string;

		try {
			const ip: string = await (await fetch("https://api.ipify.org")).text();
			const url = `${serverUrl}/challenge`;
			const body = new URLSearchParams({ name, phone, ip, answer });

			const response = await fetch(url, { method: "POST", body });
			let message = formatResponseMessage(await response.text());

			if (response.status !== 200 && response.status !== 201)
				return fail(response.status, {
					data: { answer, name, phone },
					started: true,
					success: response.status === 403,
					message
				});

			return {
				data: response.status === 200 ? undefined : { name, phone },
				started: false,
				success: response.status === 200,
				message:
					response.status === 200
						? "Congratulations! You will receive your prize money shortly."
						: "Your answer was wrong. Try again."
			};
		} catch (err) {
			console.error(err);
			return fail(500, {
				data: { answer, name, phone },
				started: true,
				success: false,
				message: "An error occurred. Kindly try again."
			});
		}
	}
};
