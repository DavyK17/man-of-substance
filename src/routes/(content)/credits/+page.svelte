<script lang="ts">
	import type { PageData } from "./$types";
	import { Utility } from "$lib/helpers/general";

	export let data: PageData;
</script>

<svelte:head>
	<title>Man of Substance - Credits</title>
	<meta name="description" content="Get to know the people behind DVK's debut studio album." />
</svelte:head>

<main>
	{#if data.unlocked}
		<header>
			<h1>Album credits</h1>
		</header>
		<div class="album-credits">
			{#each data.credits as { key, name }}
				<div class="credit">
					<h2>{Utility.renderCreditTitle(key)}</h2>
					<p>{name}</p>
				</div>
			{/each}
		</div>
		<p role="note" class="copyright">&copy; &#8471; 2022 Ginton Entertainment</p>
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
