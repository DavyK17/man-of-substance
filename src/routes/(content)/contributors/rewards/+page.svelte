<script lang="ts">
	import type { PageData } from "./$types";
	import { Login, Rewards } from "$lib";

	export let data: PageData;
</script>

{#if data.loggedIn}
	<Rewards />
{:else}
	<Login />
{/if}
