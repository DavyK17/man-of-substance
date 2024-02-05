<script lang="ts">
	import type { LayoutData } from "../../routes/$types";

	import { fly } from "svelte/transition";
	import { page } from "$app/stores";

	export let data: LayoutData;
	const menuItems = [
		{ title: "Contributors", path: "/contributors" },
		{ title: "Tracklist", path: "/tracks" },
		{ title: "Credits", path: "/credits" }
	];

	let outerWidth: number;
	$: menuVisible = outerWidth > 575;
	$: menuToggle = (visible?: boolean) => {
		if (outerWidth > 575) return;
		if (visible === true) menuVisible = true;
		if (visible === false) menuVisible = false;
		menuVisible = !menuVisible;
	};
</script>

<svelte:window bind:outerWidth />

<nav>
	<button on:click={() => menuToggle()}>
		<svg class:active={menuVisible}>
			{#if menuVisible}
				<path
					d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
				/>
			{:else}
				<path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z" />
			{/if}
		</svg>
	</button>
	{#if menuVisible}
		<div class="menu" transition:fly={{ x: "-100%" }}>
			<ul>
				<li>
					<a href="/" class:active={$page.url.pathname == "/"} on:click={() => menuToggle(false)}>
						Home
					</a>
				</li>
				{#each menuItems as { title, path }}
					<li>
						<a
							href={path}
							class:active={$page.url.pathname.includes(path)}
							on:click={() => menuToggle(false)}
							data-sveltekit-preload-code={path === "/contributors" ? "hover" : "off"}
						>
							{title}
						</a>
					</li>
				{/each}
				{#if data.released}
					<li>
						<a href="https://ditto.fm/man-of-substance-dvk" target="_blank" rel="noreferrer"
							>Stream</a
						>
					</li>
				{/if}
			</ul>
		</div>
	{/if}
</nav>

<slot />

<style lang="scss">
	nav {
		background-color: black;
		border-bottom: 1px solid $red;
		font-family: $font-head;
		text-transform: uppercase;
		.menu {
			padding: 0 2rem;
			ul {
				text-align: center;
				margin: unset;
				padding: 0.5rem;
				list-style-type: none;
				li {
					display: inline;
					margin: 0.25rem;
					a {
						color: white;
						text-decoration: none;
						transition: color 0.1s ease-in-out;
						&:hover,
						&:focus {
							color: $silver;
							transition: color 0.1s ease-in-out;
						}
						&.active {
							color: $red;
						}
					}
				}
			}
		}
		button {
			display: none;
			background: unset;
			border: unset;
			:global(svg) {
				position: relative;
				width: 24px;
				height: 24px;
				fill: white;
				transition: fill 0.2s ease-in-out;
				z-index: 500;
				&.active {
					fill: $red;
					transition: fill 0.2s ease-in-out;
				}
			}
		}
	}

	@media only screen and (max-width: 575px) {
		nav {
			.menu {
				position: fixed;
				min-width: 100%;
				top: 0;
				bottom: 0;
				background-color: rgba(0, 0, 0, 0.95);
				padding: 2rem;
				z-index: 100;
				ul {
					margin-top: 5rem;
					padding: unset;
					li {
						display: block;
						font-size: 1.5rem;
						margin: 1rem 0;
					}
				}
			}
			button {
				display: block;
				padding: 0.75rem;
			}
		}
	}
</style>
