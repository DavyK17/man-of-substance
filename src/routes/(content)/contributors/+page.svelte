<script lang="ts">
	import type { ContributorTier, Contributors } from "$lib/ambient";

	import { onMount } from "svelte";
	import { serverUrl } from "$lib/helpers";

	let loading: boolean;
	let error: boolean;

	let tiers: ContributorTier[] = [];
	let contributors: Contributors;
	const getContributors = async () => {
		loading = true;

		try {
			const response: Contributors = await (await fetch(`${serverUrl}/contributors`)).json();
			contributors = response;
		} catch (err) {
			console.error(err);
			error = true;
		}

		loading = false;
	};

	onMount(async () => await getContributors());
	$: if (contributors)
		for (let tier in contributors)
			if (tier !== "supporter" && contributors[tier as ContributorTier].length > 0)
				tiers.push(tier as ContributorTier);
</script>

<main class="contributors">
	<div class="contributors-lead">
		<p>
			The making of this album included a crowdfunding campaign that yielded a portion of the funds
			used to create it. All contributors can claim their respective rewards by <a
				href="/contributors/rewards">clicking here</a
			>.
		</p>
		{#if !loading && contributors}
			<p>
				A big thank you to everyone at the Supporter tier, as well as the following for their
				financial support:
			</p>
		{/if}
	</div>
	<div class="contributors-list">
		{#if loading}
			<p id="error">Tulia kiambatasi&hellip;</p>
		{:else if error}
			<p id="error">
				An error occurred loading the list of contributors. Kindly refresh the page and try again.
			</p>
		{:else if contributors}
			{#each tiers as tier}
				<div>
					<h2>{tier.charAt(0).toUpperCase() + tier.slice(1)}</h2>
					<ul>
						{#each contributors[tier] as { name }}
							<li>{name}</li>
						{/each}
					</ul>
				</div>
			{/each}
		{/if}
	</div>
</main>

<style lang="scss">
	.contributors {
		.contributors-lead {
			text-align: center;
			margin: auto auto 2rem auto;
		}
		.contributors-list {
			@extend %tracklist-contributors;
			ul {
				@extend %tracklist-contributors-list;
			}
			#error {
				font-size: 0.875rem;
				color: adjust-color($red, $alpha: -0.4);
			}
		}
	}

	@media only screen and (min-width: 1200px) {
		.contributors .contributors-lead {
			width: 1000px;
		}
	}
</style>
