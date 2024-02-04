<script lang="ts">
	import type { PageData } from "./$types";

	import { page } from "$app/stores";
	import { Layout } from "$lib";

	export let data: PageData;
</script>

<Layout {data}>
	<main>
		<div class="not-found">
			{#if $page.status === 404}
				<div class="head">
					<h1>Not found</h1>
					<p class="link">{$page.url.pathname}</p>
				</div>
				<p>You came for this link, nikasema, "No".</p>
				<p>
					Ukaamua <a href={"#"} on:click={() => window.history.back()}>ku-click</a> ndio urudi nyuma,
					yo.
				</p>
			{:else}
				<div class="head">
					<h1>{$page.status} Error</h1>
				</div>
				<p id="status">{$page.error?.message}</p>
			{/if}
		</div>
	</main>
</Layout>

<style lang="scss">
	.not-found {
		text-align: center;
		.head {
			margin-bottom: 1rem;
		}
		h1,
		p {
			margin: unset;
		}
		h1 {
			font-family: $font-head;
			font-size: 1.75rem;
			font-weight: bold;
			text-transform: uppercase;
		}
		.link {
			font-size: 0.875rem;
			opacity: 0.5;
		}
	}
</style>
