export const load = async ({ cookies, locals: { session, safeGetSession } }) => {
	// Retrieve user
	const { user } = await safeGetSession();

	// Return data
	return {
		cookies: cookies.getAll(),
		session,
		user
	};
};
