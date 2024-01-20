<script lang="ts">
	import { onDestroy } from "svelte";
	import { browser } from "$app/environment";
	import { enhance } from "$app/forms";

	export let data: { answer?: string; name?: string; phone?: string } | undefined;
	export let message: string | undefined;

	$: status = message ?? "";
	$: if (
		browser &&
		message !== "" &&
		message !== "Congratulations! You will receive your prize money shortly." &&
		message !== "The challenge has already been completed." &&
		message !== "An error occurred. Kindly try again."
	) {
		const timeout = setTimeout(() => {
			status = "";
		}, 3000);

		onDestroy(() => clearTimeout(timeout));
	}
</script>

<form
	class="challenge"
	method="POST"
	action="?/attempt"
	autocomplete="off"
	use:enhance
	on:submit|preventDefault={() => (status = "Drum roll please…")}
>
	<h1>Secret Challenge</h1>
	<p>Enter your details below:</p>
	<div class="input">
		<input type="hidden" name="answer" value={data?.answer} required />
		<label class="sr-only" for="challenger-name">Name</label>
		<input
			type="text"
			id="challenger-name"
			name="name"
			placeholder="Name"
			value={data?.name ?? null}
			required
		/>
		<label class="sr-only" for="challenger-phone">M-Pesa number</label>
		<input
			type="tel"
			id="challenger-phone"
			name="phone"
			placeholder="M-Pesa number (i.e. 254…)"
			value={data?.phone ?? null}
			required
		/>
	</div>
	<button type="submit" id="challenger-submit">Enter</button>
	<p id="status">{status}</p>
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
			width: 500px;
			justify-content: space-between;
			align-items: center;
			margin: 0.5rem auto;
			input {
				height: 2.5rem;
				font-family: $font-body;
				margin: 0.5rem;
				&[type="text"],
				&[type="tel"] {
					width: 350px;
					font-size: 1rem;
					padding: 0 0.5rem;
				}
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

	@media only screen and (max-width: 991px) {
		.challenge {
			flex-direction: column;
			.input {
				flex-direction: column;
				width: 100%;
				input {
					&[type="text"],
					&[type="tel"] {
						width: 100%;
					}
				}
			}
		}
	}

	@media only screen and (min-width: 992px) {
		.challenge button {
			margin: unset;
		}
	}

	@media only screen and (min-width: 1200px) {
		.challenge {
			width: 1000px;
		}
	}
</style>
