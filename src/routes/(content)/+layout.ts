export const load = async ({ parent }) => {
	// Destructure parent
	const { passcode, released } = await parent();

	// Return data
	return { released, unlocked: passcode || released };
};
