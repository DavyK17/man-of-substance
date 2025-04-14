<svelte:head>
	<title>Man of Substance - Contributors</title>
	<meta name="description" content="Check out the list of crowdfunding contributors for DVK's debut studio album." />
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
