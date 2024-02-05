<script lang="ts">
	import type { ActionData } from "./$types";

	import { onDestroy } from "svelte";
	import { browser } from "$app/environment";
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";

	import { Status } from "$lib/helpers/contributors";

	export let form: ActionData;
	$: if (browser && form?.success) goto("/contributors/rewards");

	$: status = form?.message ?? "";
	$: if (browser && status !== Status.LOADING) {
		const timeout = setTimeout(() => {
			status = "";
		}, 3000);

		onDestroy(() => clearTimeout(timeout));
	}
</script>

<form
	class="login"
	method="POST"
	autocomplete="off"
	use:enhance={() => {
		status = Status.LOADING;
	}}
>
	<h1>Contributor Rewards</h1>
	<p>Enter the email address you provided after making your contribution:</p>
	<div class="input">
		<input type="email" id="email" name="email" />
		<button id="challenge-submit" type="submit">Enter</button>
	</div>
	<p id="status">{status}</p>
</form>

<style lang="scss">
	.login {
		text-align: center;
		margin-bottom: 1.5rem;
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
			margin: auto;
			input {
				width: 350px;
				height: 2.5rem;
				font-size: 1rem;
				font-family: $font-body;
				padding: 0 0.5rem;
			}
			button {
				width: 100px;
				height: 2.5rem;
				font-size: 1rem;
				@extend %link-buttons;
				margin: unset;
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
		.login .input {
			flex-direction: column;
			width: 100%;
			button {
				margin: 1rem;
			}
		}
	}

	@media only screen and (min-width: 992px) {
		.login input button {
			margin: unset;
		}
	}
</style>
