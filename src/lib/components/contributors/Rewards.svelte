<script lang="ts">
	import type { SubmitFunction } from "@sveltejs/kit";
	import type { DownloadDataOutput } from "aws-amplify/storage";
	import type { Contributor, ContributorRewardFile } from "$lib/ambient";

	import { onDestroy } from "svelte";
	import { isCancelError } from "aws-amplify/storage";

	import { browser } from "$app/environment";
	import { enhance } from "$app/forms";
	import { beforeNavigate } from "$app/navigation";

	import {
		getContributorTier,
		contributorRewards,
		createDownloadTask,
		getMaxTracksForTier
	} from "$lib/helpers";
	import { PUBLIC_AWS_CLOUDFRONT } from "$env/static/public";

	import TrackDownload from "./TrackDownload.svelte";
	import { tracks } from "$lib/data.json";

	export let contributor: Contributor | undefined;
	export let message: string | undefined;

	$: tier = getContributorTier(contributor as Contributor);
	$: rewards = contributorRewards.filter((reward) => reward.tiers.includes(tier));

	$: status = message ?? "";
	$: if (browser && message) {
		const timeout = setTimeout(() => {
			status = "";
		}, 3000);

		onDestroy(() => clearTimeout(timeout));
	}

	let request: DownloadDataOutput | null;
	$: request = null;
	beforeNavigate(async (navigation) => {
		if (request) {
			request.cancel();
			try {
				await request.result;
			} catch (err) {
				console.error(err);
				if (isCancelError(err)) {
					status = err.message;
					navigation.cancel();
				}
			}
		}
	});

	const downloadRewards: SubmitFunction = async (event) => {
		// Cancel existing request if any
		if (request) {
			request.cancel();

			try {
				await request.result;
			} catch (err) {
				console.error(err);
				if (isCancelError(err)) {
					status = err.message;
					return event.cancel();
				}
			}
		}

		// Download rewards
		const { formData, cancel } = event;
		const responses = ["Wazi champ", "Fiti mkuu", "Safi kiongos"];

		try {
			if (tier === "supporter") {
				let id = Number(formData.get("track-select") as string);
				let filename = tracks[id - 1].filename + ".mp3";
				let key = "mp3/" + filename;

				await createDownloadTask(key, ({ transferredBytes, totalBytes }) => {
					status = `Downloading: ${Math.round((transferredBytes / (totalBytes as number)) * 100)}%`;
				}).result;
			}

			if (tier === "bronze" || tier === "silver") {
				let checked: number[] = [];
				let format = formData.get("format-select") as string;
				for (let value of formData.values()) if (value !== format) checked.push(Number(value));

				let remaining = getMaxTracksForTier(tier) - checked.length;
				if (remaining > 0) {
					status = `Kindly select ${remaining} ${remaining === 5 ? " " : "more "}${
						remaining === 1 ? "song" : "songs"
					} to download.`;
					return cancel();
				}

				let files: ContributorRewardFile[] = [];
				checked.map((id) => {
					let filename = `${tracks[id - 1].filename}.${tier === "silver" ? format : "mp3"}`;
					let key = `${tier === "silver" ? format : "mp3"}/${filename}`;
					return files.push({ filename, key });
				});

				// TODO: Create and download ZIP
				console.log(files);
			}

			if (tier === "gold") {
				let files: ContributorRewardFile[] = [];
				let format = formData.get("format-select") as string;

				tracks.map((track) => {
					let filename = track.filename + `.${format}`;
					let key = `${format}/` + filename;
					files.push({ filename, key });
				});

				// TODO: Create and download ZIP
				console.log(files);
			}

			if (tier === "platinum" || tier === "executive") {
				let files: { music: ContributorRewardFile[]; commentary: ContributorRewardFile[] } = {
					music: [],
					commentary: []
				};

				let { music, commentary } = files;
				let format = formData.get("format-select") as string;

				tracks.map((track) => {
					let filename = track.filename + `.${format}`;
					let key = `${format}/` + filename;
					music.push({ filename, key });

					filename = track.filename + ".m4a";
					key = "m4a/" + filename;
					return commentary.push({ filename, key });
				});

				// TODO: Create and download ZIP
				console.log(files);
			}

			status = responses[Math.floor(Math.random() * responses.length)];
		} catch (err) {
			console.error(err);
			if (isCancelError(err)) {
				status = err.message;
			} else status = "An unknown error occurred. Kindly try again.";
		}

		cancel(); // Remove this line when all TODOs are done
	};
</script>

<header class="rewards-head">
	<h1 class="name">{contributor?.name}</h1>
	<div class="info">
		<p class="tier">{tier.charAt(0).toUpperCase() + tier.slice(1)}</p>
		<p class="email">{contributor?.email}</p>
	</div>
</header>
{#if contributor?.amount && contributor?.amount >= 2000}
	<div class="video">
		<video controls>
			<source src={`${PUBLIC_AWS_CLOUDFRONT}/public/mp4/${contributor?.id}.mp4`} type="video/mp4" />
			<track kind="captions" />
		</video>
	</div>
{/if}
<div class="rewards-list">
	<h2 class="sr-only">Your rewards</h2>
	{#each rewards as { name, perks }}
		<div class="reward">
			<h3>{name}</h3>
			<ul>
				{#each perks as perk}
					<li>{perk}</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>
<form class="rewards-claim" method="POST" action="?/claim" use:enhance={downloadRewards}>
	<TrackDownload {tier} />
	<footer class="link-buttons">
		<input type="hidden" name="email" value={contributor?.email} />
		<button type="submit">Claim rewards</button>
		<button formaction="?/logout" on:click={() => (status = "Ndio kutoka sasa? Haya…")}
			>Logout</button
		>
		<p id="status">{status}</p>
	</footer>
</form>

<style lang="scss">
	.rewards-head {
		text-align: center;
		h1 {
			font-family: $font-head;
			font-weight: bold;
			font-size: 2rem;
			text-transform: uppercase;
		}
		.info {
			margin: 1rem 0;
			p {
				margin: unset;
			}
			.tier {
				font-family: $font-head;
				font-size: 0.75rem;
				text-transform: uppercase;
				color: $red;
				margin-bottom: 0.25rem;
				opacity: 0.5;
			}
			.email {
				font-size: 0.75rem;
				margin: unset;
				margin-top: 0.5rem;
				opacity: 0.6;
			}
		}
	}

	@media only screen and (max-width: 768px) {
		.rewards-head {
			h1 {
				font-size: 1.5rem;
			}
		}
	}

	.video {
		display: flex;
		width: 100%;
		justify-content: center;
		video {
			width: 100%;
			max-width: 500px;
			margin-bottom: 1rem;
			border: 1px solid black;
		}
	}

	.rewards-list {
		display: flex;
		flex-direction: column;
		align-content: center;
		flex-wrap: wrap;
		margin-top: 1rem;
		padding: 1rem 0;
		border-top: 1px solid rgba(0, 0, 0, 0.5);
		.reward {
			text-align: center;
			margin: 1rem 0;
			h3 {
				font-family: $font-head;
				font-weight: bold;
				text-transform: uppercase;
			}
			ul {
				line-height: 1.5;
				list-style-type: none;
				margin: unset;
				margin-top: 1rem;
				padding: unset;
			}
		}
	}

	.rewards-claim {
		margin: auto;
		border-top: 1px solid rgba(0, 0, 0, 0.5);
		.link-buttons {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			button {
				font-size: 1rem;
				width: 300px;
				@extend %link-buttons;
				&:hover,
				&:focus {
					@extend %link-buttons-hover;
				}
				&:active {
					color: $red;
				}
			}
		}
	}
</style>
