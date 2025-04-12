import type { Track, TrackCredits } from "$lib/types/general";

import { render, screen } from "@testing-library/svelte";
import Credits from "./Credits.svelte";

it("renders the correct credits", () => {
	const credits: TrackCredits = {
		writers: ["Writer1", "Writer2"],
		featuring: ["Artist1", "Artist2"],
		producers: ["Producer1"],
		mixMaster: ["MixMaster1", "MixMaster2"],
		recorded: [{ studio: "Studio1", city: "City1" }]
	};

	const current: Track = {
		id: 1,
		title: "Title1",
		filename: "Filename1",
		runtime: 120,
		style: ["Style1"],
		synopsis: "Synopsis1",
		lyrics: "Lyrics1",
		credits
	};

	render(Credits, { props: { current } });

	expect(screen.getByText("Featuring")).toBeInTheDocument();
	expect(screen.getByText("Artist1")).toBeInTheDocument();
	expect(screen.getByText("Artist2")).toBeInTheDocument();

	expect(screen.getByText("Producer")).toBeInTheDocument();
	expect(screen.getByText("Producer1")).toBeInTheDocument();

	expect(screen.getByText("Mixing and mastering")).toBeInTheDocument();
	expect(screen.getByText("MixMaster1")).toBeInTheDocument();
	expect(screen.getByText("MixMaster2")).toBeInTheDocument();

	expect(screen.getByText("Recorded at")).toBeInTheDocument();
	expect(screen.getByText("Studio1")).toBeInTheDocument();
	expect(screen.getByText("City1")).toBeInTheDocument();
});

it("renders the correct credits for group members", () => {
	const credits: TrackCredits = {
		writers: ["Writer1", "Writer2"],
		featuring: ["Group1", ["Member1", "Member2"]],
		producers: ["Producer1", "Producer2"],
		mixMaster: ["MixMaster1", "MixMaster2"],
		recorded: [{ studio: "Studio1", city: "City1" }],
		interpolates: [{ title: "Sample1", info: "Info1" }]
	};

	const current: Track = {
		id: 2,
		title: "Title2",
		filename: "Filename2",
		runtime: 150,
		style: ["Style2"],
		synopsis: "Synopsis2",
		lyrics: "Lyrics2",
		credits
	};

	render(Credits, { props: { current } });

	expect(screen.getByText("Featuring")).toBeInTheDocument();
	expect(screen.getByText("Group1")).toBeInTheDocument();
	expect(screen.getByText("Member1")).toBeInTheDocument();
	expect(screen.getByText("Member2")).toBeInTheDocument();

	expect(screen.getByText("Producers")).toBeInTheDocument();
	expect(screen.getByText("Producer1")).toBeInTheDocument();
	expect(screen.getByText("Producer2")).toBeInTheDocument();

	expect(screen.getByText("Mixing and mastering")).toBeInTheDocument();
	expect(screen.getByText("MixMaster1")).toBeInTheDocument();
	expect(screen.getByText("MixMaster2")).toBeInTheDocument();

	expect(screen.getByText("Recorded at")).toBeInTheDocument();
	expect(screen.getByText("Studio1")).toBeInTheDocument();
	expect(screen.getByText("City1")).toBeInTheDocument();
});
