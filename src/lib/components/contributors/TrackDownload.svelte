<script lang="ts">
	import type { ContributorTier, ContributorRewardDownload, Track } from "$lib/types/general";

	import { createEventDispatcher } from "svelte";

	import { browser } from "$app/environment";
	import { enhance } from "$app/forms";

	import { Tiers, Rewards, Status } from "$lib/helpers/contributors";

	export let email: string;
	export let tier: ContributorTier;
	export let tracks: Track[];
	export let downloadObject: ContributorRewardDownload | undefined;

	const dispatch = createEventDispatcher();
	$: if (browser && downloadObject) dispatch("download", downloadObject);

	$: maxTracks = Tiers.maxTracks(tier);
	$: trackFormat = Rewards.getTrackFormat(tier);

	let parts = [
		{ start: 1, filter: (id: number) => id <= 7 },
		{ start: 8, filter: (id: number) => id >= 8 && id <= 14 },
		{ start: 15, filter: (id: number) => id >= 15 }
	];

	let selectedTracks: number[] = [];
	const maxCheck = ({ target }: MouseEvent) => {
		if (selectedTracks.length >= maxTracks && (target as HTMLInputElement).checked)
			(target as HTMLInputElement).checked = !(target as HTMLInputElement).checked;
	};
</script>

<form
	class="claim"
	method="POST"
	action="?/download"
	use:enhance={({ submitter }) => {
		dispatch("statusChange", {
			message: submitter?.innerHTML === "Logout" ? Status.LOGGING_OUT : Status.DOWNLOAD_STARTING
		});
	}}
>
	<div class={"track-select " + (tier === "supporter" ? "dropdown" : "checklist")}>
		{#if tier === "supporter"}
			<div class="track-dropdown">
				<label for="track-dropdown">Desired track ({trackFormat}):</label>
				<select id="track-dropdown" name="track-select" required>
					<option disabled selected value="">Select track</option>
					{#each tracks as { id, title }}
						<option value={id}>{title}</option>
					{/each}
				</select>
			</div>
		{:else if tier === "bronze" || tier === "silver"}
			<p>Select tracks to download ({trackFormat}):</p>
			<div class="checklist-wrapper">
				{#each parts as { start, filter }}
					<ol {start}>
						{#each tracks.filter(({ id }) => filter(id)) as { id, title }}
							<li class="track-checkbox">
								<input
									type="checkbox"
									id={`track-${id}`}
									name={`track-${id}`}
									value={id}
									bind:group={selectedTracks}
									on:click={maxCheck}
								/>
								<label for={`track-${id}`}>{title}</label>
							</li>
						{/each}
					</ol>
				{/each}
			</div>
		{/if}
		{#if tier !== "supporter" && tier !== "bronze"}
			<div class="track-dropdown" class:with-margin={tier === "silver"}>
				<label for="track-dropdown">Desired format ({trackFormat}):</label>
				<select id="track-dropdown" name="format-select" required>
					<option disabled selected value="">Select format</option>
					<option value="mp3">MP3 (smaller size, recommended)</option>
					<option value="wav">WAV (higher quality, large file size)</option>
				</select>
			</div>
		{/if}
	</div>
	<div class="link-buttons">
		<input type="hidden" name="email" value={email} />
		<input type="hidden" name="tier" value={tier} />

		<button type="submit">Claim rewards</button>
		<button formaction="?/logout" formnovalidate>Logout</button>
	</div>
</form>

<style lang="scss">
	.track-select {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 1rem 0;
		.checklist-wrapper {
			display: flex;
			width: 100%;
			flex-wrap: wrap;
			justify-content: space-between;
			text-align: center;
			border-bottom: 1px solid rgba(0, 0, 0, 0.25);
			ol {
				@extend %tracklist-contributors-list;
				li {
					justify-content: flex-start !important;
					label {
						margin-left: 0.5rem;
					}
				}
			}
		}
		.track-dropdown {
			display: flex;
			flex-direction: column;
			align-items: center;
			&.with-margin {
				margin-top: 1rem;
			}
			label {
				margin-bottom: 1rem;
			}
			select {
				width: 300px;
				font-family: $font-body;
				font-size: 0.875rem;
				padding: 0.25rem;
			}
		}
	}
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
</style>
