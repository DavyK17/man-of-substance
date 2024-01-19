import type { PageServerLoad, Actions } from "./$types";
import type { Contributor } from "$lib/ambient";

import { error, fail } from "@sveltejs/kit";
import { signIn, signOut } from "aws-amplify/auth";
import moment from "moment";

import { serverUrl, formatResponseMessage } from "$lib/helpers";
import { AWS_USERNAME, AWS_PASSWORD } from "$env/static/private";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const email = cookies.get("mos-contributor");
	if (email) {
		try {
			const contributor: Contributor = await (
				await fetch(`${serverUrl}/contributor?email=${email}`)
			).json();
			return { loggedIn: true, contributor };
		} catch (err) {
			console.error(err);
			throw error(
				500,
				"An unexpected error occurred while loading the page. Kindly refresh and try again."
			);
		}
	}

	return { loggedIn: false };
};

export const actions: Actions = {
	login: async ({ request, fetch, cookies }) => {
		try {
			// Get form data
			const data = await request.formData();

			// Validate existence of email
			const email = data.get("email") as string;
			if (!email) return fail(400, { message: "Please enter a valid email address" });

			// Get contributor
			const response = await fetch(`${serverUrl}/contributors?email=${email}`);
			if (response.status !== 200)
				return fail(response.status, { message: "This email does not exist in the database" });

			const contributor: Contributor = await response.json();

			// If rewards already claimed, return error
			if (contributor.rewardsClaimed)
				return fail(403, { message: "Rewards have already been claimed for this user" });

			// CONTENT LOCK CHECKS
			//-/ Supporter and bronze
			if (contributor.amount >= 100 && contributor.amount <= 1999 && Date.now() < 1667509200000)
				return fail(403, {
					message: `Your rewards will be available ${moment(1667509200000).fromNow()}`
				});

			//-/ Silver to platinum
			if (contributor.amount >= 2000 && contributor.amount <= 49999 && Date.now() < 1667250000000)
				return fail(403, {
					message: `Your rewards will be available ${moment(1667250000000).fromNow()}`
				});

			//-/ Executive
			if (contributor.amount >= 50000 && Date.now() < 1666904400000)
				return fail(403, {
					message: `Your rewards will be available ${moment(1666904400000).fromNow()}`
				});

			// Attempt login
			await signIn({ username: AWS_USERNAME, password: AWS_PASSWORD });

			// Set cookie
			cookies.set("mos-contributor", contributor.email, {
				path: "/contributors",
				expires: new Date(Date.now() + 86400) // next day
			});

			// Return data
			return { loggedIn: true, contributor };
		} catch (err) {
			console.error(err);
			return fail(500, { message: "An unknown error occurred. Kindly try again." });
		}
	},

	logout: async ({ cookies }) => {
		try {
			// Attempt logout
			await signOut();

			// Delete cookie
			const cookie = cookies.get("mos-contributor");
			if (cookie) cookies.delete("mos-contributor", { path: "/contributors" });

			// Return data
			return { loggedIn: false };
		} catch (err) {
			console.error(err);
			return fail(500, { message: "An unknown error occurred. Kindly try again." });
		}
	},

	claim: async ({ request, fetch, cookies }) => {
		try {
			// Get email
			const email = (await request.formData()).get("email") as string;
			const url = `${serverUrl}/contributors?email=${email}`;

			// Get response
			const response = await fetch(url, { method: "POST" });

			// Return error if status code is not 200
			if (response.status !== 200)
				return fail(response.status, {
					message: formatResponseMessage(await response.text())
				});

			// Attempt logout
			await signOut();

			// Delete cookie
			const cookie = cookies.get("mos-contributor");
			if (cookie) cookies.delete("mos-contributor", { path: "/contributors" });

			// Return data
			return { loggedIn: false };
		} catch (err) {
			console.error(err);
			return fail(500, { message: "An unknown error occurred. Kindly try again." });
		}
	}
};
