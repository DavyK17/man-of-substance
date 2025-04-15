<script lang="ts">
	import type { PageData } from "./$types";

	import { Status } from "$lib/helpers/contributors";
	import { Status as Generic } from "$lib/helpers/general";

	export let data: PageData;
</script>

<div class="content">
	<p>
		The making of this album included a crowdfunding campaign that yielded a portion of the funds used to create it. All
		contributors can claim their respective rewards by
		<a href="/contributors/rewards">clicking here</a>.
	</p>
	{#await data.contributors}
		<p id="status">{Generic.LOADING}</p>
	{:then contributors}
		{#if contributors}
			<p>A big thank you to everyone at the Supporter tier, as well as the following for their financial support:</p>
			<div class="list">
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
			</div>
		{:else}
			<p id="status">{Status.HOME_LOADING_ERROR}</p>
		{/if}
	{:catch}
		<p id="status">{Status.HOME_LOADING_ERROR}</p>
	{/await}
</div>

<style lang="scss">
	.content {
		text-align: center;
		margin: auto auto 2rem auto;
		.list {
			@extend %tracklist-contributors;
			margin-top: 2rem;
			ul {
				@extend %tracklist-contributors-list;
			}
		}
	}

	#status {
		margin-top: 2rem;
	}
</style>
