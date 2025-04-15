import type { PostgrestError } from "@supabase/supabase-js";
import type { AlbumCreditKey, AlbumCreditTitles, CustomError } from "$lib/types/general";

import { error as svelteError } from "@sveltejs/kit";

/* Status messages */
export const Status = {
	LOADING: "Tulia kiambatasi…",
	ERROR: "An unknown error occurred. Kindly try again."
};

/* Utility helpers */
export const Utility = {
	/**
	 * An object with values for each corresponding key in `AlbumCredits`.
	 */
	creditTitles: {
		execProducers: "Executive producer",
		photography: "Photography",
		styling: "Styling",
		artwork: "Artwork",
		trailer: "Trailer",
		visualiser: "Visualiser",
		website: "Website"
	} as AlbumCreditTitles,
	/**
	 * Returns a custom error object.
	 * @param {number} code - The error code; defaults to `500` if not provided or invalid
	 * @param {string} message - The error message
	 * @returns An object with the error `code` and `message`
	 */
	customError: (code: number | undefined, message: string): CustomError =>
		!code || code < 400 || code > 599 ? { code: 500, message: Status.ERROR } : { code, message },
	/**
	 * Parses a `CustomError` object within a page/layout server load function and returns an error to be thrown.
	 * @param {CustomError} error - The error object
	 * @returns A new `Error` object if the error is unexpected, or a Svelte error otherwise
	 */
	parseLoadError: (error: CustomError) =>
		error.code === 500 ? new Error(error.message) : svelteError(error.code, { message: error.message }),
	/**
	 * Parses a `PostgrestError` object and returns a custom error object if any has occurred.
	 * @param {PostgrestError | null} postgrestError - The `PostgrestError` object, or `null` if no error occurred
	 * @returns An object with an `error` if any has occurred
	 */
	parsePostgrestError: (postgrestError: PostgrestError | null): { error?: CustomError } => {
		// Return undefined if no error occurred
		let error: CustomError | undefined;
		if (!postgrestError) return { error };

		// Return custom error if hint is a number between 400 and 599
		const customErrorCode = Number(postgrestError.hint);
		if (!isNaN(customErrorCode) && customErrorCode >= 400 && customErrorCode <= 599) {
			error = Utility.customError(customErrorCode, postgrestError.message);
			return { error };
		}

		// Map Postgrest error codes to custom error codes
		const errorMap = [
			{ code: "08", status: 503 },
			{ code: "09", status: 500 },
			{ code: "0L", status: 403 },
			{ code: "0P", status: 403 },
			{ code: "23503", status: 409 },
			{ code: "23505", status: 409 },
			{ code: "25006", status: 405 },
			{ code: "25", status: 500 },
			{ code: "28", status: 403 },
			{ code: "2D", status: 500 },
			{ code: "38", status: 500 },
			{ code: "39", status: 500 },
			{ code: "3B", status: 500 },
			{ code: "40", status: 500 },
			{ code: "53400", status: 500 },
			{ code: "53", status: 503 },
			{ code: "54", status: 500 },
			{ code: "55", status: 500 },
			{ code: "57", status: 500 },
			{ code: "58", status: 500 },
			{ code: "F0", status: 500 },
			{ code: "HV", status: 500 },
			{ code: "P0001", status: 400 },
			{ code: "P0", status: 500 },
			{ code: "XX", status: 500 },
			{ code: "42883", status: 404 },
			{ code: "42P01", status: 404 },
			{ code: "42P17", status: 500 },
			{ code: "42501", status: 403 }
		];

		// Return custom error if Postgrest error code is found
		for (const { code, status } of errorMap)
			if (postgrestError.code === code || postgrestError.code.startsWith(code)) {
				error = Utility.customError(status, Status.ERROR);
				return { error };
			}

		// Return generic error
		error = Utility.customError(500, Status.ERROR);
		return { error };
	},
	/**
	 * Renders a credit title in singular or plural as appropriate.
	 * @param {AlbumCreditKey} key - An `AlbumCreditKey`
	 * @returns {string} A formatted string with the credit title
	 */
	renderCreditTitle: (key: AlbumCreditKey): string => Utility.creditTitles[key]
};
