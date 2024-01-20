<script lang="ts">
	import type { PageData, ActionData } from "./$types";
	import { Home, Countdown, ListeningParty } from "$lib";

	export let data: PageData;
	export let form: ActionData;
</script>

{#if data.componentType === "countdown"}
	<Countdown />
{:else if data.componentType === "listeningParty"}
	{#if form?.success}
		<Home cover={data.cover} released={data.released} />
	{:else}
		<ListeningParty />
	{/if}
{:else}
	<Home cover={data.cover} released={data.released} />
{/if}
