<script lang="ts">
	import { page } from "$app/stores";
	import type { PageData } from "../../routes/$types";

	const menuToggle = (dir = 0) => {
		const body = document.querySelector("body") as HTMLElement;
		const menu = document.querySelector(".menu") as HTMLElement;
		const isOpen = menu.classList.contains("open") && body.classList.contains("menu-open");

		const open = () => {
			menu.classList.add("open");
			body.classList.add("menu-open");
		};

		const close = () => {
			menu.classList.remove("open");
			body.classList.remove("menu-open");
		};

		if (dir === 1 && !isOpen) return open();
		if (dir === -1 && isOpen) return close();
		return isOpen ? close() : open();
	};

	export let data: PageData;
</script>

<nav>
	<button id="mobile-menu-open" on:click={() => menuToggle()}>
		<svg>
			<path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z" />
		</svg>
	</button>
	<div class="menu">
		<button id="mobile-menu-close" on:click={() => menuToggle()}>
			<svg>
				<path
					d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
				/>
			</svg>
		</button>
		<ul>
			<li>
				<a href="/" class:active={$page.url.pathname == "/"} on:click={() => menuToggle(-1)}>
					Home
				</a>
			</li>
			<li>
				<a
					href="/contributors"
					class:active={$page.url.pathname.includes("/contributors")}
					on:click={() => menuToggle(-1)}
				>
					Contributors
				</a>
			</li>
			<li>
				<a
					href="/tracks"
					class:active={$page.url.pathname.includes("/tracks")}
					on:click={() => menuToggle(-1)}
				>
					Tracklist
				</a>
			</li>
			<li>
				<a
					href="/credits"
					class:active={$page.url.pathname == "/credits"}
					on:click={() => menuToggle(-1)}
				>
					Credits
				</a>
			</li>
			{#if data.released}
				<li>
					<a href="https://ditto.fm/man-of-substance-dvk" target="_blank" rel="noreferrer">Stream</a>
				</li>
			{/if}
		</ul>
	</div>
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
		#mobile-menu-open,
		#mobile-menu-close {
			display: none;
			svg {
				width: 24px;
				height: 24px;
				fill: white;
			}
			&:hover svg,
			&:focus svg,
			&:active svg {
				fill: $red;
			}
		}
	}

	@media only screen and (max-width: 575px) {
		nav {
			.menu {
				display: flex;
				position: fixed;
				width: 100%;
				top: 0;
				bottom: 0;
				left: -100%;
				background-color: rgba(0, 0, 0, 0.9);
				z-index: 100;
				padding: unset;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				transition: left 0.2s;
				&.open {
					left: 0;
					transition: left 0.2s;
				}
				ul {
					li {
						display: block;
						margin: 1rem 0;
					}
				}
			}
			#mobile-menu-open,
			#mobile-menu-close {
				display: block;
				padding: 0.75rem;
			}
			#mobile-menu-close {
				position: absolute;
				top: 0;
				left: 0;
				text-align: right;
			}
		}
	}
</style>
