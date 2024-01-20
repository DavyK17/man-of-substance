<script lang="ts">
	import { onMount } from "svelte";

	onMount(() => {
		const interval = setInterval(() => {
			let timeLeft = 1666904400000 - new Date().valueOf();

			const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24)).toLocaleString("en-KE", {
				minimumIntegerDigits: 2
			});

			const hours = Math.floor(
				(timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			).toLocaleString("en-KE", { minimumIntegerDigits: 2 });

			const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)).toLocaleString(
				"en-KE",
				{ minimumIntegerDigits: 2 }
			);

			const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000).toLocaleString("en-KE", {
				minimumIntegerDigits: 2
			});

			let text = document.getElementById("timer");
			if (text) text.innerHTML = `${days}:${hours}:${minutes}:${seconds}`;

			if (timeLeft < 0) clearInterval(interval);
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<svelte:head>
	<title>Man of Substance - Coming soon</title>
</svelte:head>

<main class="countdown">
	<header class="track-head">
		<h1 class="title sr-only">Man of Substance</h1>
	</header>
	<p id="timer"></p>
</main>

<style lang="scss">
	#timer {
		display: flex;
		position: absolute;
		width: 100%;
		font-family: $font-head;
		font-size: 3rem;
		color: $red;
		justify-content: center;
		align-items: center;
		left: 0;
		top: 0;
		bottom: 0;
		margin: unset;
	}
</style>
