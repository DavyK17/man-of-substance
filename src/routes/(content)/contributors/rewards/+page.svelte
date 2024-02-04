<script lang="ts">
	import type { PageData, ActionData } from "./$types";

	import { onDestroy } from "svelte";
	import { browser } from "$app/environment";

	import { Login, Rewards } from "$lib";
	import { downloadRewards } from "$lib/helpers";

	export let data: PageData;
	export let form: ActionData;

	$: status = form?.message ?? "";
	$: if (browser && form?.message) {
		const timeout = setTimeout(
			() => {
				status = "";
			},
			form?.message === "Your download will begin shortly. Please wait." ? 5000 : 3000
		);

		onDestroy(() => clearTimeout(timeout));
	}

	$: if (browser && form?.download) {
		const { file, files } = form?.download;
		downloadRewards(file, files);
	}
</script>

{#if data.loggedIn || form?.loggedIn}
	<Rewards {status} contributor={data.contributor || form?.contributor} videoUrl={data?.videoUrl} />
{:else}
	<Login {status} />
{/if}

<footer>
	<a href="/contributors" data-sveltekit-preload-code>Back to Intro</a>
</footer>

<style lang="scss">
	footer {
		margin: auto;
		text-align: center;
	}

	@media only screen and (min-width: 1200px) {
		footer {
			width: 1000px;
		}
	}
</style>
