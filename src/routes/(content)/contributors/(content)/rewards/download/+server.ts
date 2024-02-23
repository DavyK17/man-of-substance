import type { ContributorRewardDownload } from "$lib/ambient.js";
import type { RequestHandler } from "./$types";

import { json, error, redirect } from "@sveltejs/kit";
import JsFileDownloader from "js-file-downloader";

import { Rewards } from "$lib/helpers/contributors";
import { Generic } from "$lib/helpers/status";

/* TYPES */
// Copied from js-file-downloader (https://github.com/AleeeKoi/js-file-downloader/blob/master/index.d.ts)
interface OptionalParams {
	timeout?: number;
	headers?: { name: string; value: string }[];
	forceDesktopMode?: boolean;
	withCredentials?: boolean;
	method?: "GET" | "POST";
	process?: (event: ProgressEvent) => undefined;
	nameCallback?: (name: string) => string;
	autoStart?: boolean;
	filename?: string;
	contentType?: false | string;
	body?: Document | BodyInit | null;
	nativeFallbackOnError?: boolean;
	onloadstart?: () => void;
	contentTypeDetermination?: false | "header" | "signature" | "full";
	customFileSignatures?: { [key: string]: string };
}

type Params = OptionalParams & { url: string };

interface JsFileDownloaderBase {
	start(): Promise<void>;
	params: Params;
	link: HTMLAnchorElement;
	request: XMLHttpRequest;
	downloadedFile: null | Blob | File;
	abort(reason: any): void;
}

/* HANDLERS */
export const POST: RequestHandler = async ({ url, request, cookies }) => {
	const email = cookies.get("mos-contributor");
	if (!email) throw redirect(307, "/contributors/login");

	const type = url.searchParams.get("type") ?? "claim";

    if (type === "test") {
        const result = url.searchParams.get("result") ?? "true";
		return json({ success: result === "true" });
	}

	if (type === "claim") {
		const { file, files } = (await request.json()) as ContributorRewardDownload;
		if (!file && !files) return error(400, "No file(s) to download");
		if (file && files) return error(400, "Only one of `file` and `files` must be provided");

		let downloadUrl = "";
		let filename = "";
		let download: JsFileDownloaderBase | undefined;

		try {
			if (file) {
				const { name, path } = file;
				downloadUrl = (await Rewards.getFileUrl(path)) as string;
				filename = name;
			} else if (files) {
				const zipFile = await Rewards.generateZipFile(files);
				downloadUrl = URL.createObjectURL(zipFile);
				filename = "mos-rewards.zip";
			}

			download = new JsFileDownloader({ url: downloadUrl, filename, autoStart: false });
			if (download) await download.start();

			return json({ success: true });
		} catch (err) {
			if (download) download.abort(err);
			return error(500, Generic.ERROR);
		} finally {
			if (files && downloadUrl) URL.revokeObjectURL(downloadUrl);
		}
	}

	return error(400, `Usage: "/contributors/rewards/download?type=[claim|test]"`);
};
