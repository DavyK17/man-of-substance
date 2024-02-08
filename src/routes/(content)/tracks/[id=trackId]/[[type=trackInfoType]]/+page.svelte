<script lang="ts">
	import "$lib/styles/track-lyrics.scss";
	import { PUBLIC_CHALLENGE_LYRIC } from "$env/static/public";

	import type { ActionData } from "./$types";
	import type { Track, TrackInfoVersion } from "$lib/ambient";

	import { onDestroy } from "svelte";
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";

	import { Credits, ChallengeStart, ChallengeEnd } from "$lib/components";
	import { tracklist } from "$lib/stores";
	import { Page } from "$lib/helpers/tracks";

	export let form: ActionData;
	const { displayWriters, displayRuntime } = Page;

	$: id = Number($page.params.id);
	$: type = $page.params.type as TrackInfoVersion;

	$: current = $tracklist.find((track) => track.id === id) as Track;
	$: previous = $tracklist.find((track) => track.id === id - 1);
	$: next = $tracklist.find((track) => track.id === id + 1);
	$: content = current[type];

	const handleTrackKeyDown = ({
		code,
		altKey,
		ctrlKey,
		metaKey,
		shiftKey
	}: KeyboardEvent): Promise<void> | null => {
		if ($page.url.pathname !== "/tracks" && $page.url.pathname.includes("/tracks")) {
			if (altKey || ctrlKey || metaKey || shiftKey) return null;

			if (id === $tracklist.length || id - 1 >= 1)
				if (code === "ArrowLeft") return goto(`/tracks/${id - 1}/${type}`);
			if (id === 1 || id + 1 <= $tracklist.length)
				if (code === "ArrowRight") return goto(`/tracks/${id + 1}/${type}`);

			if (code === "KeyC") return goto(`/tracks/${id}/credits`);
			if (code === "KeyL") return goto(`/tracks/${id}/lyrics`);
			if (code === "KeyS") return goto(`/tracks/${id}/synopsis`);
			if (code === "Home") return goto("/tracks");
		}

		return null;
	};

	const handleTrackNumberSubmit = (e: SubmitEvent) => {
		const target = e.target as EventTarget & HTMLFormElement;
		return goto(`/tracks/${(target[0] as HTMLInputElement).value}/${type}`);
	};

	$: challengeFound = false;
	$: if (challengeFound && form?.success) {
		let timeout = setTimeout(() => (challengeFound = false), 3000);
		onDestroy(() => clearTimeout(timeout));
	}

	const setChallenge = () => {
		if (!browser || challengeFound) return null;

		let easterEgg: HTMLParagraphElement[] = [];
		(document.querySelectorAll(".track-lyrics p") as NodeListOf<HTMLParagraphElement>).forEach(
			(line) => easterEgg.push(line)
		);
		easterEgg = easterEgg.filter((line) => line.innerHTML.includes(PUBLIC_CHALLENGE_LYRIC));

		if (easterEgg.length === 1) {
			let timeout: NodeJS.Timeout;

			easterEgg[0].onmouseover = () => {
				timeout = setTimeout(() => {
					easterEgg[0].style.cursor = "pointer";
					easterEgg[0].setAttribute("id", "challenge-link");
					easterEgg[0].onclick = () => (challengeFound = true);
				}, 4000);
			};

			easterEgg[0].onmouseout = () => {
				clearTimeout(timeout);
				easterEgg[0].removeAttribute("style");
				easterEgg[0].removeAttribute("id");
				easterEgg[0].onclick = null;
			};
		}
	};
</script>

<svelte:head>
	<title>Man of Substance - Tracks: "{current.title}"</title>
</svelte:head>

<svelte:document on:keydown={handleTrackKeyDown} />
<svelte:body on:mouseenter={setChallenge} />

{#if challengeFound}
	{#if form?.started}
		<ChallengeEnd data={form?.data} message={form?.message} />
	{:else}
		<ChallengeStart message={form?.message} />
	{/if}
{:else}
	<header>
		<h1 class="title">{current.title}</h1>
		<p class="writers">Written by {displayWriters(current)}</p>
		<div class="info">
			<p class="style">{current.style.join(" / ")}</p>
			<p><strong>Runtime:</strong><span id="break"></span>{displayRuntime(current)}</p>
		</div>
		<div class="links">
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
	</header>
	{#if type === "credits"}
		<Credits {current} />
	{:else}
		<div class={`track-${type}`}>{@html content}</div>
	{/if}
	<footer>
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
{/if}

<style lang="scss">
	header {
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
		header {
			.info {
				#break::before {
					content: "\A";
					white-space: pre-wrap;
				}
			}
		}
	}

	@media only screen and (max-width: 768px) {
		header {
			h1 {
				font-size: 1.5rem;
			}
		}
	}

	.links {
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
		.links {
			.link-buttons {
				width: inherit;
				a {
					width: inherit;
				}
			}
		}
	}

	@media only screen and (max-width: 700px) {
		.links {
			width: 100%;
			.link-buttons {
				flex-direction: column;
				align-items: center;
			}
		}
	}

	@media only screen and (min-width: 701px) {
		.links {
			width: 700px;
		}
	}

	footer {
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
			width: fit-content;
			margin: 0.375rem auto;
			input {
				font-family: $font-head;
			}
		}
	}

	.track-synopsis,
	.track-lyrics {
		text-align: center;
		margin: 1rem auto auto auto;
	}

	@media only screen and (min-width: 1200px) {
		.track-synopsis,
		.track-lyrics {
			width: 1000px;
		}
	}

	@media only screen and (max-width: 767px) {
		footer {
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
		footer {
			& > div {
				flex: 1 1 300px;
			}
		}
	}
</style>
