<script lang="ts">
	import type { Track } from "$lib/ambient";

	export let current: Track;
	$: credits = current.credits;

	const titles = {
		featuring: "Featuring",
		producers: "Producer",
		arrangement: "Arrangement",
		guitar: "Guitar",
		additionalProducers: "Additional producer",
		additionalVocals: "Additional vocals",
		mixMaster: "Mixing and mastering",
		recorded: "Recorded at",
		interpolates: "Interpolates",
		samples: "Samples"
	};
</script>

<div class="track-credits">
	{#each Object.entries(titles) as [credit, title]}
		{#if typeof credits[credit] !== "undefined"}
			<section class="credit">
				<h2>
					{#if credit === "producers" || credit === "additionalProducers"}
						{credits[credit].length > 1 ? `${title}s` : title}
					{:else}
						{title}
					{/if}
				</h2>
				{#each credits[credit] as name, i}
					{#if credit === "featuring"}
						{#if Array.isArray(credits[credit][i + 1])}
							<p class="group-name">{name}</p>
						{:else if Array.isArray(credits[credit][i])}
							{#each name as member}
								<p class="group-member">{member}</p>
							{/each}
						{:else}
							<p>{name}</p>
						{/if}
					{:else if credit === "recorded"}
						<p class="location">
							<span class="studio">{name.studio}</span>
							<span class="city">{name.city}</span>
						</p>
					{:else if credit === "samples" || credit === "interpolates"}
						<p class="location">
							<span class="studio">{name.title}</span>
							<span class="city">{name.info}</span>
						</p>
					{:else}
						<p>{name}</p>
					{/if}
				{/each}
			</section>
		{/if}
	{/each}
</div>

<style lang="scss">
	.track-credits {
		text-align: center;
		margin: 2rem auto auto auto;

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
