<script lang="ts">
	import type { PageData } from "./$types";
	import type { Credits } from "$lib/ambient";

	const titles = {
		execProducers: "Executive producer",
		photography: "Photography",
		styling: "Styling",
		artwork: "Artwork",
		trailer: "Trailer",
		visualiser: "Visualiser",
		website: "Website"
	};

	export let data: PageData & Credits;
</script>

<svelte:head>
	<title>Man of Substance - Credits</title>
</svelte:head>

<main>
	{#if data.unlocked}
		<header>
			<h1>Album credits</h1>
		</header>
		<div class="album-credits">
			{#each Object.entries(titles) as [credit, title]}
				<div class="credit">
					<h2>
						{#if credit === "execProducers"}
							{data[credit].length > 1 ? `${title}s` : title}
						{:else}
							{title}
						{/if}
					</h2>
					{#each data[credit] as name}
						<p>{name}</p>
					{/each}
				</div>
			{/each}
		</div>
		<p role="note" class="copyright">&copy; &#8471; {data.copyright}</p>
	{:else}
		<p class="locked">This content will be available on release day.</p>
	{/if}
</main>

<style lang="scss">
	header {
		text-align: center;
		h1 {
			font-family: $font-head;
			font-weight: bold;
			font-size: 2rem;
			text-transform: uppercase;
		}
	}

	@media only screen and (max-width: 768px) {
		header h1 {
			font-size: 1.5rem;
		}
	}

	.album-credits {
		text-align: center;
		margin-top: 2rem !important;
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
		}
	}

	@media only screen and (min-width: 1200px) {
		.album-credits {
			width: 1000px;
			margin: auto;
		}
	}
</style>
