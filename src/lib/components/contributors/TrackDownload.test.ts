import { render, screen } from "@testing-library/svelte";
import TrackDownload from "./TrackDownload.svelte";

it("renders the correct initial state for supporter tier", async () => {
	render(TrackDownload, {
		props: { email: "test@example.com", tier: "supporter", downloadObject: undefined }
	});

	expect(screen.getByLabelText("Desired track (MP3):")).toBeInTheDocument();
});

it("renders the correct initial state for bronze tier", async () => {
	render(TrackDownload, {
		props: { email: "test@example.com", tier: "bronze", downloadObject: undefined }
	});

	expect(screen.getByText("Select tracks to download (MP3):")).toBeInTheDocument();
});

it("renders the correct initial state for silver tier", async () => {
	render(TrackDownload, {
		props: { email: "test@example.com", tier: "silver", downloadObject: undefined }
	});

	expect(screen.getByText("Select tracks to download (MP3 or WAV):")).toBeInTheDocument();
});
