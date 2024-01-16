<script lang="ts">
	import { page } from "$app/stores";
	import { tracklist } from "$lib/stores/tracks";
	import type { Track } from "$lib/ambient";

	const { id } = $page.params;
	$: current = $tracklist.find((track) => track.id === parseInt(id)) as Track;

	const displayWriters = (): string => {
		if (current.credits.writers.length === 1) return current.credits.writers.join("");
		if (current.credits.writers.length === 2) return current.credits.writers.join(" and ");

		const arr = current.credits.writers.slice();
		const last = arr.pop();
		return arr.join(", ") + " and " + last;
	};

	const displayRuntime = (time: number): string => {
		const min = Math.floor(time / 60);
		const sec = time % 60;
		const and = min === 0 || sec === 0 ? "" : " and ";

		const display = (unit: "min" | "sec", time: number) => {
			if (time === 0) return "";

			const pluraliser = () => {
				let label;
				switch (unit) {
					case "min":
						label = time > 1 ? "minutes" : "minute";
						break;
					case "sec":
						label = time > 1 ? "seconds" : "second";
						break;
					default:
						label = undefined;
				}

				return label;
			};

			return `${time} ${pluraliser()}`;
		};

		return `${display("min", min)}${and}${display("sec", sec)}`;
	};
</script>

<svelte:head>
	<title>Man of Substance - Tracks: "{current.title}"</title>
</svelte:head>

<!-- <svelte:document on:keydown={handleTrackChange} /> -->

<main>
	<header class="track-head">
		<h1 class="title">{current.title}</h1>
		<p class="writers">Written by {displayWriters()}</p>
		<div class="info">
			<p class="style">{current.style.join(" / ")}</p>
			<p><strong>Runtime:</strong><span id="break"></span>{displayRuntime(current.runtime)}</p>
		</div>
	</header>
	<slot />
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
</style>
