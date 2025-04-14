<script lang="ts">
	import type { PageData } from "./$types";
	import type { Track } from "$lib/types/general";

	import { List } from "$lib/helpers/tracks";
	import { version } from "$lib/stores";

	export let data: PageData;
	const fullTracklist: Track[] = data.tracks.map((track) => {
		const { synopsis, lyrics, credits } = List.data.find(({ id }) => id === track.id)!;
		return {
			id: track.id,
			title: track.title,
			filename: track.filename,
			runtime: track.runtime,
			style: track.style,
			synopsis,
			lyrics,
			credits,
			missingFrom: track.missingFrom ?? undefined
		};
	});

	let selectedVer = $version;
	$: version.set(selectedVer);

	let tracklist: Track[];
	$: if (data.tracks) tracklist = List.build(fullTracklist, $version);

	const { getPart } = List;
	$: partOne = getPart(tracklist, selectedVer, 1);
	$: partTwo = getPart(tracklist, selectedVer, 2);
	$: bonus = getPart(tracklist, selectedVer, 3);
</script>

<svelte:head>
	<title>Man of Substance - Tracks</title>
	<meta name="description" content="Check out all the tracks from DVK's debut studio album." />
</svelte:head>

<main>
	{#if data.unlocked}
		<div class="lead">
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
	.lead {
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
</style>
