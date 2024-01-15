<script lang="ts">
	import Layout from "$lib/components/Layout.svelte";
	import type { LayoutData } from "./$types";

	export let data: LayoutData;
</script>

<Layout {data}>
	<slot />
</Layout>
