<script lang="ts">
	import type { Contributor } from "$lib/ambient";
	import TrackDownload from "./TrackDownload.svelte";

	import { enhance } from "$app/forms";
	import { ContributorTiers as Tiers, ContributorRewards as Rewards } from "$lib/helpers";

	export let status: string;
	export let contributor: Contributor | undefined;
	export let videoUrl: string | undefined;

	$: tier = Tiers.get(contributor as Contributor);
	$: rewards = Rewards.list.filter(({ tiers }) => tiers.includes(tier));
</script>

<header>
	<h1 class="name">{contributor?.name}</h1>
	<div class="info">
		<p class="tier">{tier.charAt(0).toUpperCase() + tier.slice(1)}</p>
		<p class="email">{contributor?.email}</p>
	</div>
</header>
{#if videoUrl}
	<div class="video">
		<video controls>
			<source src={`${videoUrl}`} type="video/mp4" />
			<source src={`${videoUrl}`} type="video/mp4" />
			<track kind="captions" />
		</video>
	</div>
{/if}
<div class="list">
	<h2 class="sr-only">Your rewards</h2>
	{#each rewards as { name, perks }}
		<div class="reward">
			<h3>{name}</h3>
			<ul>
				{#each perks as perk}
					<li>{perk}</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>
<form
	class="claim"
	method="POST"
	action="?/claim"
	use:enhance={({ action }) => {
		status = action.pathname.includes("logout") ? "Ndio kutoka sasa? Haya…" : "Preparing rewards…";
	}}
>
	<TrackDownload {tier} />
	<footer class="link-buttons">
		<input type="hidden" name="email" value={contributor?.email} />
		<input type="hidden" name="tier" value={tier} />

		<button type="submit">Claim rewards</button>
		<button formaction="?/logout">Logout</button>
		<p id="status">{status}</p>
	</footer>
</form>

<style lang="scss">
	header {
		text-align: center;
		h1 {
			font-family: $font-head;
			font-weight: bold;
			font-size: 2rem;
			text-transform: uppercase;
		}
		.info {
			margin: 1rem 0;
			p {
				margin: unset;
			}
			.tier {
				font-family: $font-head;
				font-size: 0.75rem;
				text-transform: uppercase;
				color: $red;
				margin-bottom: 0.25rem;
				opacity: 0.5;
			}
			.email {
				font-size: 0.75rem;
				margin: unset;
				margin-top: 0.5rem;
				opacity: 0.6;
			}
		}
	}

	@media only screen and (max-width: 768px) {
		header {
			h1 {
				font-size: 1.5rem;
			}
		}
	}

	.video {
		display: flex;
		width: 100%;
		justify-content: center;
		video {
			width: 100%;
			max-width: 500px;
			margin-bottom: 1rem;
			border: 1px solid black;
		}
	}

	.list {
		display: flex;
		flex-direction: column;
		align-content: center;
		flex-wrap: wrap;
		margin-top: 1rem;
		padding: 1rem 0;
		border-top: 1px solid rgba(0, 0, 0, 0.5);
		.reward {
			text-align: center;
			margin: 1rem 0;
			h3 {
				font-family: $font-head;
				font-weight: bold;
				text-transform: uppercase;
			}
			ul {
				line-height: 1.5;
				list-style-type: none;
				margin: unset;
				margin-top: 1rem;
				padding: unset;
			}
		}
	}

	.claim {
		margin: auto;
		border-top: 1px solid rgba(0, 0, 0, 0.5);
		.link-buttons {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			button {
				font-size: 1rem;
				width: 300px;
				@extend %link-buttons;
				&:hover,
				&:focus {
					@extend %link-buttons-hover;
				}
				&:active {
					color: $red;
				}
			}
		}
	}
</style>
