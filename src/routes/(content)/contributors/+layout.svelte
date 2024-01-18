<svelte:head>
	<title>Man of Substance - Contributors</title>
</svelte:head>

<main>
	<slot />
</main>

<style lang="scss">
	main {
		margin: auto;
	}

	@media only screen and (min-width: 1200px) {
		main {
			max-width: 1000px;
		}
	}
</style>
