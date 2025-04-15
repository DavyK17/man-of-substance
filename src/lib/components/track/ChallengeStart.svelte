<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<form method="POST" action="?/start" autocomplete="off" use:enhance>
	<h1>Secret Challenge</h1>
	<p>How many lines on the album (in total) explicitly reference a fighting game?</p>
	<div class="input">
		<label class="sr-only" for="challenge-answer">Answer</label>
		<input type="number" id="challenge-answer" name="answer" min="0" required />
		<button type="submit" id="challenge-submit">Enter</button>
	</div>
</form>

<style lang="scss">
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

	@media only screen and (min-width: 992px) {
		.input button {
			margin: unset;
		}
	}
</style>
