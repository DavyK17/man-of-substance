<script lang="ts">
	import type { PageData, ActionData } from "./$types";

	import { browser } from "$app/environment";
	import { Login, Rewards } from "$lib";

	export let data: PageData;
	export let form: ActionData;
	$: if (browser && form?.download) {
		const url = URL.createObjectURL(form?.download);
		const link = document.createElement("a");

		link.download = "mos-rewards.zip";
		link.href = url;
		link.click();

		URL.revokeObjectURL(url);
	}
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
