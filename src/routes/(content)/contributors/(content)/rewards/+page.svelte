<script lang="ts">
	import type { PageData, ActionData } from "./$types";
	import type { Contributor, ContributorRewardDownload } from "$lib/ambient";

	import { onDestroy } from "svelte";
	import { browser } from "$app/environment";
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";

	import { TrackDownload } from "$lib/components";
	import { Tiers, Rewards, Status } from "$lib/helpers/contributors";
	import { Generic } from "$lib/helpers/status";

	export let data: PageData;
	const { contributor, videoUrl } = data;

	$: tier = Tiers.get(contributor as Contributor);
	$: rewards = Rewards.list.filter(({ tiers }) => tiers.includes(tier));

	export let form: ActionData;
	$: status = form?.message ?? "";
	$: if (browser && status !== Status.DOWNLOAD_STARTING) {
		const timeout = setTimeout(
			() => {
				status = "";
			},
			form?.message === Status.DOWNLOAD_NOTICE ? 5000 : 3000
		);

		onDestroy(() => clearTimeout(timeout));
	}

	const { download, finishClaim } = Rewards;
	$: downloadTimedOut = !form?.download;
	$: if (browser && !downloadTimedOut) {
		const { file, files } = form?.download as ContributorRewardDownload;
		if (files) status = "Generating ZIP file. This may take a while…";

		download(file, files, (e) => {
			if (e.lengthComputable) {
				let downloadedPercentage = Math.floor((e.loaded / e.total) * 100);
				status = `Downloading: ${downloadedPercentage}%…`;
			}

			return undefined;
		}).then(() => {
			status = Status.CLAIMING_REWARDS;
			finishClaim(data.contributor?.email as string).then(({ error }) => {
				if (!error) {
					const responses = ["Wazi champ", "Fiti mkuu", "Safi kiongos"];
					status = responses[Math.floor(Math.random() * responses.length)];
				} else status = Generic.ERROR;
			});
		});
	}

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
<form
	class="claim"
	method="POST"
	action="?/download"
	use:enhance={({ submitter }) => {
		if (submitter?.innerHTML === "Logout") downloadTimedOut = true;
		status = submitter?.innerHTML === "Logout" ? Status.LOGGING_OUT : Status.DOWNLOAD_STARTING;
	}}
>
	<TrackDownload {tier} />
	<div class="link-buttons">
		<input type="hidden" name="email" value={contributor?.email} />
		<input type="hidden" name="tier" value={tier} />

		<button type="submit">Claim rewards</button>
		<button formaction="?/logout" formnovalidate>Logout</button>
		<p id="status">{status}</p>
	</div>
</form>

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

	.claim {
		margin: auto;
		border-top: 1px solid rgba(0, 0, 0, 0.5);
		.link-buttons {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			button {
				font-size: 1rem;
				width: 300px;
				@extend %link-buttons;
				&:hover,
				&:focus {
					@extend %link-buttons-hover;
				}
				&:active {
					color: $red;
				}
			}
		}
	}
</style>
