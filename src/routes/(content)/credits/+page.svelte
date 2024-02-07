<script lang="ts">
	import type { PageData } from "./$types";

	import { credits as fullCredits } from "$lib";
	import { Page } from "$lib/helpers/credits";

	export let data: PageData;
	const credits = Object.entries(fullCredits).filter(([key]) => key !== "copyright") as [
		string,
		string[]
	][];
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
			{#each credits as [key, credit]}
				<div class="credit">
					<h2>{Page.renderCreditTitle(key, credit)}</h2>
					{#each credit as name}
						<p>{name}</p>
					{/each}
				</div>
			{/each}
		</div>
		<p role="note" class="copyright">&copy; &#8471; {fullCredits.copyright}</p>
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
