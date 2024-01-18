<script lang="ts">
	import type { PageData, ActionData } from "./$types";
	import { Login, Rewards } from "$lib";

	export let data: PageData;
	export let form: ActionData;
</script>

{#if data.loggedIn || form?.loggedIn}
	<Rewards />
{:else}
	<Login message={form?.message} />
{/if}

<footer>
	<a href="/contributors" data-sveltekit-preload-code>Back to Intro</a>
</footer>

<style lang="scss">
	footer {
		margin: 1.5rem auto;
		text-align: center;
	}
</style>
