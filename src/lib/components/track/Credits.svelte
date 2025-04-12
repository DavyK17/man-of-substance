<script lang="ts">
	import type { Track } from "$lib/types/general";
	import { Page } from "$lib/helpers/tracks";

	export let current: Track;
	$: credits = Object.entries(current.credits).filter(([key]) => key !== "writers");
</script>

<div class="track-credits">
	{#each credits as [key, credit]}
		<section class="credit">
			<h2>{Page.renderCreditTitle(key, credit)}</h2>
			{#each credit as data, i}
				{#if key === "featuring"}
					{#if Array.isArray(credit[i + 1])}
						<p class="group-name">{data}</p>
					{:else if Array.isArray(data)}
						{#each data as member}
							<p class="group-member">{member}</p>
						{/each}
					{:else}
						<p>{data}</p>
					{/if}
				{:else if key === "recorded"}
					<p class="location">
						<span class="studio">{data.studio}</span>
						<span class="city">{data.city}</span>
					</p>
				{:else if key === "samples" || key === "interpolates"}
					<p class="location">
						<span class="studio">{data.title}</span>
						<span class="city">{data.info}</span>
					</p>
				{:else}
					<p>{data}</p>
				{/if}
			{/each}
		</section>
	{/each}
</div>

<style lang="scss">
	.track-credits {
		text-align: center;
		margin: 1rem auto auto auto;

		.credit {
			margin: 1rem 0;
			h2,
			p {
				margin: unset;
			}
			h2 {
				font-family: $font-head;
				font-weight: bold;
				text-transform: uppercase;
				margin-bottom: 0.5rem;
			}
			.group-name {
				margin-bottom: 0.25rem;
			}
			.group-member {
				font-size: 0.875rem;
				opacity: 0.5;
				&:first {
					margin-top: 0.5rem;
				}
			}
			.location {
				margin-bottom: 0.5rem;
				.studio,
				.city {
					display: block;
				}
				.city {
					font-size: 0.75rem;
					opacity: 0.6;
				}
			}
		}
	}

	@media only screen and (min-width: 1200px) {
		.track-credits {
			width: 1000px;
		}
	}
</style>
