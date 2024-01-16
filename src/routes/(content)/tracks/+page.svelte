<script lang="ts">
	import type { PageData } from "./$types";
	import type { Track, TracklistVersion } from "$lib/ambient";

	import { version, tracklist } from "$lib/stores/tracks";

	export let data: PageData;

	let selectedVer = $version;
	$: version.set(selectedVer);

	const part = (n: 1 | 2 | 3, ver: TracklistVersion) => {
		let first = -1;
		let last = -1;

		if (n === 1) {
			if (ver === "full" || ver === "expanded") last = 7;
			if (ver === "mixtape" || ver === "base") last = 5;
			return $tracklist.filter((track: Track) => track.id <= last);
		}

		if (n === 2) {
			if (ver === "full" || ver === "expanded") {
				first = 8;
				last = 14;
			}
			if (ver === "mixtape" || ver === "base") {
				first = 6;
				last = 10;
			}
			return $tracklist.filter((track: Track) => track.id >= first && track.id <= last);
		}

		if (n === 3) {
			if (ver === "expanded" || ver === "base") return [];
			if (ver === "full") first = 15;
			if (ver === "mixtape") first = 11;
			return $tracklist.filter((track: Track) => track.id >= first);
		}

		return [];
	};

	$: partOne = part(1, selectedVer);
	$: partTwo = part(2, selectedVer);
	$: bonus = part(3, selectedVer);
</script>

<svelte:head>
	<title>Man of Substance - Tracks</title>
</svelte:head>

<main>
	{#if data.unlocked}
		<div class="tracklist-lead">
			<p class="head">Select a track to view details.</p>
			<p>Use the dropdown below to follow the evolution of the tracklist.</p>
			<div class="version-select">
				<label for="version" class="sr-only">Version</label>
				<select id="version" name="version" bind:value={selectedVer}>
					{#each ["base", "mixtape", "expanded", "full"] as ver}
						<option value={ver} selected={ver === selectedVer}>
							{ver.charAt(0).toUpperCase() + ver.slice(1)}
						</option>
					{/each}
				</select>
			</div>
		</div>
		<div class="tracklist">
			<div>
				<h2>Substance</h2>
				<ol>
					{#each partOne as track}
						<li>
							<a href={`/tracks/${track.id}`}>{track.title}</a>
						</li>
					{/each}
				</ol>
			</div>
			<div>
				<h2>Sippin' and Trippin'</h2>
				<ol start={partTwo[0].id}>
					{#each partTwo as track}
						<li>
							<a href={`/tracks/${track.id}`}>{track.title}</a>
						</li>
					{/each}
				</ol>
			</div>
			{#if $version === "full" || $version === "mixtape"}
				<div>
					<h2>Bonus</h2>
					<ol start={bonus[0].id}>
						{#each bonus as track}
							<li>
								<a href={`/tracks/${track.id}`}>{track.title}</a>
							</li>
						{/each}
					</ol>
				</div>
			{/if}
		</div>
	{:else}
		<p class="locked">This content will be available on the eve of release day.</p>
	{/if}
</main>

<style lang="scss">
	.tracklist {
		@extend %tracklist-contributors;
		ol {
			@extend %tracklist-contributors-list;
		}
		a {
			text-decoration: none;
			transition: color 0.1s ease-in-out;
			&:hover,
			&:focus {
				color: $red;
				transition: color 0.1s ease-in-out;
			}
		}
	}

	.tracklist-lead {
		margin-bottom: 2rem;
		p {
			margin: unset;
			text-align: center;
			&.head {
				font-size: 1.25rem;
				font-weight: 500;
				margin-bottom: 0.25rem;
			}
			&:not(.head) {
				font-size: 0.8rem;
				opacity: 0.5;
			}
		}
		.version-select {
			display: flex;
			justify-content: center;
			label {
				display: none;
				color: white;
			}
			select {
				width: 175px;
				font-family: $font-head;
				font-size: 0.875rem;
				text-align: center;
				text-transform: uppercase;
				margin-top: 0.75rem;
			}
		}
	}
</style>
