// Error handler
export const handleError = ({ error }) => {
	console.error("An unexpected client error occurred.", error);
	return { message: "An unexpected client error occurred. Kindly try again." };
};
