<script lang="ts">
	import type { PageData } from "./$types";
	import type { ContributorTier } from "$lib/ambient";

	export let data: PageData;
	let tiers: ContributorTier[] = [];

	$: if (data?.response)
		for (let tier in data.response)
			if (tier !== "supporter" && data.response[tier].length > 0)
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
		{#if data?.success}
			<p>
				A big thank you to everyone at the Supporter tier, as well as the following for their
				financial support:
			</p>
		{/if}
	</div>
	<div class="contributors-list">
		{#if data?.error}
			<p id="error">{data?.message}</p>
		{:else if data?.success}
			{#each tiers as tier}
				<div>
					<h2>{tier.charAt(0).toUpperCase() + tier.slice(1)}</h2>
					<ul>
						{#each data?.response[tier] as contributor}
							<li>{contributor.name}</li>
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
