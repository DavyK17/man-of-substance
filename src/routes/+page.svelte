<script lang="ts">
	import type { PageData, ActionData } from "./$types";

	import Countdown from "./Countdown.svelte";
	import ListeningParty from "./ListeningParty.svelte";
	import Home from "./Home.svelte";

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
