<script lang="ts">
	import { onDestroy } from "svelte";

	import { browser } from "$app/environment";
    import { enhance } from "$app/forms";

	const notice = `NOTICE: By clicking "Enter", you are consenting to the collection and use of your IP address by Ginton Entertainment to keep track of your challenge attempts. If you do not agree to this condition, please do not click "Enter".`;

	export let message: string | undefined;
	if (browser && message !== notice) {
		const timeout = setTimeout(() => {
			(document.getElementById("status") as HTMLParagraphElement).innerHTML = notice;
		}, 3000);

		onDestroy(() => {
			clearTimeout(timeout);
		});
	}
</script>

<form class="challenge" method="POST" action="?/start" autocomplete="off" use:enhance>
	<h1>Secret Challenge</h1>
	<p>How many lines on the album (in total) explicitly reference a fighting game?</p>
	<div class="input">
		<label class="sr-only" for="challenge-answer">Answer</label>
		<input type="number" id="challenge-answer" name="answer" min="1" required />
		<button type="submit" id="challenge-submit">Enter</button>
	</div>
	<p id="status">
		{message ?? notice}
	</p>
</form>

<style lang="scss">
	.challenge {
		text-align: center;
		margin: auto;
		h1 {
			font-family: $font-head;
			font-size: 1.5rem;
			font-weight: bold;
			text-transform: uppercase;
			margin-bottom: 0.75rem;
		}
		.input {
			display: flex;
			width: 220px;
			justify-content: space-between;
			align-items: center;
			margin: auto;
			input {
				height: 2.5rem;
				font-family: $font-head;
				&[type="number"] {
					width: 100px;
					font-size: 1.25rem;
					padding: 0 0.5rem;
				}
			}
			button {
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

	@media only screen and (min-width: 992px) {
		.challenge input button {
			margin: unset;
		}
	}

	@media only screen and (min-width: 1200px) {
		.challenge {
			width: 1000px;
		}
	}
</style>
