<script lang="ts">
	import type { ComponentEvents } from "svelte";
	import type { PageData, ActionData } from "./$types";
	import type { Contributor, ContributorRewardDownload } from "$lib/types/general";

	import { onDestroy } from "svelte";

	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";

	import { TrackDownload } from "$lib/components";
	import { Tiers, Rewards, Status } from "$lib/helpers/contributors";
	import { Status as Generic } from "$lib/helpers/general";

	export let data: PageData;
	const { contributor, videoUrl } = data;

	$: tier = Tiers.get(contributor as Contributor);
	$: rewards = Rewards.list.filter(({ tiers }) => tiers.includes(tier));

	export let form: ActionData;
	$: status = form?.message ?? "";

	const messagesToFreeze = [Status.DOWNLOAD_STARTING, Status.DOWNLOAD_GETTING_ZIP];
	$: if (browser && !messagesToFreeze.includes(status)) {
		const timeout = setTimeout(
			() => {
				status = "";
			},
			form?.message === Status.DOWNLOAD_NOTICE ? 5000 : 3000
		);

		onDestroy(() => clearTimeout(timeout));
	}

	const completeDownload = async () => {
		const { file, files } = form?.download as ContributorRewardDownload;
		status = files ? Status.DOWNLOAD_GETTING_ZIP : Status.DOWNLOAD_GETTING_FILE;

		await Rewards.download(file, files, (e) => {
			if (e.lengthComputable) {
				let downloadedPercentage = Math.floor((e.loaded / e.total) * 100);
				status = `Downloading: ${downloadedPercentage}%…`;
			}

			return undefined;
		});

		status = Status.CLAIMING_REWARDS;
		const { error } = await Rewards.finishClaim(data.contributor?.email as string);

		if (error) status = Generic.ERROR;
		else {
			const responses = ["Wazi champ", "Fiti mkuu", "Safi kiongos"];
			status = responses[Math.floor(Math.random() * responses.length)];
		}
	};

	const handleStatusChange = ({ detail }: ComponentEvents<TrackDownload>["statusChange"]) => {
		status = detail.message;
	};

	$: if (browser && form?.logout) goto("/contributors/login");
</script>

<header>
	<h1 class="name">{contributor?.name}</h1>
	<div class="info">
		<p class="tier">{tier.charAt(0).toUpperCase() + tier.slice(1)}</p>
		<p class="email">{contributor?.email}</p>
	</div>
</header>
{#if data?.videoUrl}
	<div class="video">
		<video controls>
			<source src={`${videoUrl}`} type="video/mp4" />
			<source src={`${videoUrl}`} type="video/mp4" />
			<track kind="captions" />
		</video>
	</div>
{/if}
<div class="list">
	<h2 class="sr-only">Your rewards</h2>
	{#each rewards as { name, perks }}
		<div class="reward">
			<h3>{name}</h3>
			<ul>
				{#each perks as perk}
					<li>{perk}</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>
<div class="track-download">
	<TrackDownload
		email={contributor?.email}
		{tier}
		downloadObject={form?.download}
		on:download={completeDownload}
		on:statusChange={handleStatusChange}
	/>
	<p id="status">{status}</p>
</div>

<style lang="scss">
	header {
		text-align: center;
		h1 {
			font-family: $font-head;
			font-weight: bold;
			font-size: 2rem;
			text-transform: uppercase;
		}
		.info {
			margin: 1rem 0;
			p {
				margin: unset;
			}
			.tier {
				font-family: $font-head;
				font-size: 0.75rem;
				text-transform: uppercase;
				color: $red;
				margin-bottom: 0.25rem;
				opacity: 0.5;
			}
			.email {
				font-size: 0.75rem;
				margin: unset;
				margin-top: 0.5rem;
				opacity: 0.6;
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

	.video {
		display: flex;
		width: 100%;
		justify-content: center;
		video {
			width: 100%;
			max-width: 500px;
			margin-bottom: 1rem;
			border: 1px solid black;
		}
	}

	.list {
		display: flex;
		flex-direction: column;
		align-content: center;
		flex-wrap: wrap;
		margin-top: 1rem;
		padding: 1rem 0;
		border-top: 1px solid rgba(0, 0, 0, 0.5);
		.reward {
			text-align: center;
			margin: 1rem 0;
			h3 {
				font-family: $font-head;
				font-weight: bold;
				text-transform: uppercase;
			}
			ul {
				line-height: 1.5;
				list-style-type: none;
				margin: unset;
				margin-top: 1rem;
				padding: unset;
			}
		}
	}

	.track-download {
		margin: auto;
		border-top: 1px solid rgba(0, 0, 0, 0.5);
	}
</style>
