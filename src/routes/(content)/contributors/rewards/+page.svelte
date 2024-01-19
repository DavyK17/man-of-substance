<script lang="ts">
	import type { PageData, ActionData } from "./$types";
	import { Login, Rewards } from "$lib";

	export let data: PageData;
	export let form: ActionData;
</script>

{#if data.loggedIn || form?.loggedIn}
	<Rewards contributor={data.contributor || form?.contributor} message={form?.message} />
{:else}
	<Login message={form?.message} />
{/if}

<footer>
	<a href="/contributors" data-sveltekit-preload-code>Back to Intro</a>
</footer>

<style lang="scss">
	footer {
		margin: auto;
		text-align: center;
	}
</style>
