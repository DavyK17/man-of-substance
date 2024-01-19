<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="contributors-lead">
	<p>
		The making of this album included a crowdfunding campaign that yielded a portion of the funds
		used to create it. All contributors can claim their respective rewards by
		<a href="/contributors/rewards">clicking here</a>.
	</p>
	{#await data.load}
		<span></span>
	{:then contributors}
		{#if contributors}
			<p>
				A big thank you to everyone at the Supporter tier, as well as the following for their
				financial support:
			</p>
		{/if}
	{:catch}
		<span></span>
	{/await}
</div>
<div class="contributors-list">
	{#await data.load}
		<p id="status">Tulia kiambatasi&hellip;</p>
	{:then contributors}
		{#if contributors}
			{#each Object.keys(contributors) as tier}
				<div>
					<h2>{tier.charAt(0).toUpperCase() + tier.slice(1)}</h2>
					<ul>
						{#each contributors[tier] as { name }}
							<li>{name}</li>
						{/each}
					</ul>
				</div>
			{/each}
		{:else}
			<p id="status">
				An error occurred loading the list of contributors. Kindly refresh the page and try again.
			</p>
		{/if}
	{:catch}
		<p id="status">
			An error occurred loading the list of contributors. Kindly refresh the page and try again.
		</p>
	{/await}
</div>

<style lang="scss">
	.contributors-lead {
		text-align: center;
		margin: auto auto 2rem auto;
	}

	.contributors-list {
		@extend %tracklist-contributors;
		ul {
			@extend %tracklist-contributors-list;
		}
	}
</style>
