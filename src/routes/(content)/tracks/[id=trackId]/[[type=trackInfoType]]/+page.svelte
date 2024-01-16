<script lang="ts">
	import "$lib/styles/track-lyrics.scss";
	import { page } from "$app/stores";

	import { TrackCredits } from "$lib";
	import { tracklist } from "$lib/stores/tracks";

	import type { Track } from "$lib/ambient";

	$: id = Number($page.params.id);
	$: current = $tracklist.find((track) => track.id === id) as Track;

	$: type = $page.params.type;
	$: content = current[type];
</script>

{#if type === "credits"}
	<TrackCredits {current} />
{:else}
	<div class={`track-${type}`}>{@html content}</div>
{/if}

<style lang="scss">
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
</style>
