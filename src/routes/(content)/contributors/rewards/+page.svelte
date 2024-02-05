<script lang="ts">
	import type { PageData, ActionData } from "./$types";

	import { onDestroy } from "svelte";
	import { browser } from "$app/environment";

	import { Login, Rewards } from "$lib/components";
	import { Rewards as ContributorRewards, Status } from "$lib/helpers/contributors";

	export let data: PageData;
	export let form: ActionData;

	$: status = form?.message ?? "";
	$: if (browser && form?.message !== Status.DOWNLOAD_STARTING) {
		const timeout = setTimeout(
			() => {
				status = "";
			},
			form?.message === Status.DOWNLOAD_NOTICE ? 5000 : 3000
		);

		onDestroy(() => clearTimeout(timeout));
	}

	const { download, finishClaim } = ContributorRewards;
	const downloadProcess = (e: ProgressEvent<EventTarget>) => {
		if (e.lengthComputable) {
			let downloadedPercentage = Math.floor((e.loaded / e.total) * 100);
			status = `Downloading: ${downloadedPercentage}%…`;
		}

		return undefined;
	};

	$: if (browser && form?.download) {
		const { file, files } = form?.download;

		status = Status.DOWNLOAD_STARTING;
		download(file, files, downloadProcess).then(() => {
			status = Status.CLAIMING_REWARDS;
			finishClaim(data.contributor?.email as string).then(({ error }) => {
				if (!error) {
					const responses = ["Wazi champ", "Fiti mkuu", "Safi kiongos"];
					status = responses[Math.floor(Math.random() * responses.length)];
				} else status = Status.ERROR;
			});
		});
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
</style>
