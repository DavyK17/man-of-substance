export const load = async ({ cookies, locals: { session, safeGetSession, tracks } }) => {
	// Retrieve user
	const { user } = await safeGetSession();

	// Return data
	return {
		cookies: cookies.getAll(),
		session,
		tracks,
		user
	};
};
