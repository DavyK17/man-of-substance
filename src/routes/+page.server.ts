import type { Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { UNLOCK_CODE } from "$env/static/private";

export const actions: Actions = {
	unlock: async ({ cookies, request }) => {
		const data = await request.formData();
		const passcode = data.get("passcode") as string;

		if (passcode !== UNLOCK_CODE) {
			return fail(400, { message: "Incorrect passcode." });
		}

		cookies.set("passcode", "confirmed", { path: "/" });
		return { success: true };
	},

	skip: ({ cookies }) => {
		cookies.set("passcode", "", { path: "/" });
		return { success: true };
	}
};
