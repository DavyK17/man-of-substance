<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<svelte:head>
	<title>Man of Substance - Listening party</title>
</svelte:head>

<main class="listening-party">
	<form autoComplete="off" method="POST" action="?/unlock" use:enhance>
		<h1>Listening party</h1>
		<p>Enter the passcode to unlock all content:</p>
		<div class="input">
			<input
				type="text"
				id="passcode"
				name="passcode"
				pattern="^(\d|\s)+$"
				placeholder="Numbers only"
			/>
			<input type="submit" value="Enter" />
		</div>
	</form>

	<div class="link-buttons">
		<form method="POST" action="?/skip" use:enhance>
			<button type="submit">Skip</button>
		</form>
		<p id="status"></p>
	</div>
</main>

<style lang="scss">
	.listening-party {
		form {
			text-align: center;
			h1 {
				font-family: $font-head;
				font-size: 1.5rem;
				font-weight: bold;
				text-transform: uppercase;
				margin-bottom: 0.75rem;
			}
			.input {
				display: flex;
				margin: auto;
				justify-content: space-between;
				align-items: center;
				width: 500px;
			}
			input {
				height: 2.5rem;
				&[type="text"] {
					width: 350px;
					font-family: $font-body;
					font-size: 1rem;
					padding: 0 0.5rem;
				}
				&[type="submit"] {
					width: 100px;
					font-size: 1rem;
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

		.link-buttons {
			display: flex;
			margin-top: 1rem;
			flex-direction: column;
			align-items: center;
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

	@media only screen and (max-width: 991px) {
		.listening-party form {
			.input {
				flex-direction: column;
				width: 100%;
			}
			input {
				&[type="text"] {
					width: 100%;
				}
			}
		}
	}
</style>
