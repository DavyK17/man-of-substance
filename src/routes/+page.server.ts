import type { Actions } from "./$types";
import { UNLOCK_CODE } from "$env/static/private";

export const actions: Actions = {
	unlock: async ({ cookies, request }) => {
		const data = await request.formData();
		const passcode = data.get("passcode") as string;

		if (passcode !== UNLOCK_CODE) {
			(document.getElementById("status") as HTMLElement).innerHTML = "Incorrect status!";
			return { success: false };
		}

		cookies.set("passcode", "confirmed", { path: "/" });
		return { success: true };
	},

	skip: ({ cookies }) => {
		cookies.set("passcode", "", { path: "/" });
		return { success: true };
	}
};
