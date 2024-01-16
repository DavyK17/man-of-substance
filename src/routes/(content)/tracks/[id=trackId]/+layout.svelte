<script lang="ts">
	import "$lib/styles/track-lyrics.scss";

	import { page } from "$app/stores";
	import { goto } from "$app/navigation";

	import { TrackCredits } from "$lib";
	import { tracklist } from "$lib/stores/tracks";
	import { displayWriters, displayRuntime } from "$lib/helpers";

	import type { Track, TrackInfoVersion } from "$lib/ambient";

	$: id = Number($page.params.id);
	$: current = $tracklist.find((track) => track.id === id) as Track;
	$: previous = $tracklist.find((track) => track.id === id - 1);
	$: next = $tracklist.find((track) => track.id === id + 1);

	$: type = $page.params.type as TrackInfoVersion;
	$: content = current[type];

	const handleTrackNumberSubmit = (e: SubmitEvent) => {
		const target = e.target as EventTarget & HTMLFormElement;
		return goto(`/tracks/${target[0].value}/${type}`);
	};
</script>

<svelte:head>
	<title>Man of Substance - Tracks: "{current.title}"</title>
</svelte:head>

<!-- <svelte:document on:keydown={handleTrackChange} /> -->

<main>
	<header class="track-head">
		<h1 class="title">{current.title}</h1>
		<p class="writers">Written by {displayWriters(current)}</p>
		<div class="info">
			<p class="style">{current.style.join(" / ")}</p>
			<p><strong>Runtime:</strong><span id="break"></span>{displayRuntime(current.runtime)}</p>
		</div>
	</header>
	<div class="track-links">
		<div class="link-buttons">
			<a
				role="button"
				class:active={$page.url.pathname.includes("synopsis")}
				href={`/tracks/${id}/synopsis`}
			>
				Synopsis
			</a>
			<a
				role="button"
				class:active={$page.url.pathname.includes("lyrics")}
				href={`/tracks/${id}/lyrics`}
			>
				Lyrics
			</a>
			<a
				role="button"
				class:active={$page.url.pathname.includes("credits")}
				href={`/tracks/${id}/credits`}
			>
				Credits
			</a>
		</div>
	</div>
	{#if type === "credits"}
		<TrackCredits {current} />
	{:else}
		<div class={`track-${type}`}>{@html content}</div>
	{/if}
	<footer class="track-footer">
		<div class="previous">
			{#if previous}
				<h2>Previous</h2>
				<p>
					<a href={`/tracks/${previous.id}/${type}`}>{previous.title}</a>
				</p>
			{/if}
		</div>
		<div class="top-link">
			<form class="track-spinnerbox" on:submit|preventDefault={handleTrackNumberSubmit}>
				<label class="sr-only" for="track-number">Track number</label>
				<input type="number" id="track-number" min="1" max={$tracklist.length} value={id} />
			</form>
			<a href="#top">Back to Top</a>
		</div>
		<div class="next">
			{#if next}
				<h2>Next</h2>
				<p>
					<a href={`/tracks/${next.id}/${type}`}>{next.title}</a>
				</p>
			{/if}
		</div>
	</footer>
</main>

<style lang="scss">
	.track-head {
		text-align: center;
		h1 {
			font-family: $font-head;
			font-weight: bold;
			font-size: 2rem;
			text-transform: uppercase;
		}
		.writers {
			font-size: 0.75rem;
			margin: unset;
			margin-top: 0.5rem;
			opacity: 0.6;
		}
		.info {
			margin: 1rem 0;
			p {
				margin: unset;
			}
			.style {
				font-family: $font-head;
				font-size: 0.75rem;
				text-transform: uppercase;
				color: $red;
				margin-bottom: 0.25rem;
				opacity: 0.5;
			}
			#break::before {
				content: " ";
			}
		}
	}

	@media only screen and (max-width: 575px) {
		.track-head {
			.info {
				#break::before {
					content: "\A";
					white-space: pre-wrap;
				}
			}
		}
	}

	@media only screen and (max-width: 768px) {
		.track-head {
			h1 {
				font-size: 1.5rem;
			}
		}
	}
	.track-links {
		text-align: center;
		margin: auto;
		.link-buttons {
			display: flex;
			justify-content: space-evenly;
			a {
				width: 200px;
				@extend %link-buttons;
				&:hover,
				&:focus {
					@extend %link-buttons-hover;
				}
				&.active,
				&:active {
					color: $red;
				}
			}
		}
	}

	@media only screen and (max-width: 340px) {
		.track-links {
			.link-buttons {
				width: inherit;
				a {
					width: inherit;
				}
			}
		}
	}

	@media only screen and (max-width: 700px) {
		.track-links {
			width: 100%;
			.link-buttons {
				flex-direction: column;
				align-items: center;
			}
		}
	}

	@media only screen and (min-width: 701px) {
		.track-links {
			width: 700px;
		}
	}

	.track-synopsis,
	.track-lyrics {
		text-align: center;
	}

	@media only screen and (min-width: 1200px) {
		.track-synopsis,
		.track-lyrics {
			width: 1000px;
			margin: auto;
		}
	}

	.track-footer {
		display: flex;
		font-size: 0.875rem;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		margin-top: 2rem;
		padding-top: 1rem;
		justify-content: space-evenly;
		align-items: center;
		.top-link {
			text-align: center;
		}
		.previous {
			h2,
			p {
				margin: unset;
			}
			h2 {
				margin-bottom: 0.25rem;
				opacity: 0.5;
			}
		}
		.next {
			text-align: right;
			h2,
			p {
				margin: unset;
			}
			h2 {
				margin-bottom: 0.25rem;
				opacity: 0.5;
			}
		}
		.track-spinnerbox {
			margin-bottom: 0.25rem;
			input {
				font-family: $font-head;
			}
		}
	}

	@media only screen and (max-width: 767px) {
		.track-footer {
			flex-direction: column;
			justify-content: space-evenly;
			align-items: center;
			& > div {
				margin-bottom: 1rem;
			}
			.previous,
			.next {
				text-align: center;
			}
			.previous {
				order: 1;
			}
			.next {
				order: 2;
			}
		}
	}

	@media only screen and (min-width: 768px) {
		.track-footer {
			& > div {
				flex: 1 1 300px;
			}
		}
	}
</style>
