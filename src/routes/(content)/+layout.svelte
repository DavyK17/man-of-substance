<script lang="ts">
	import type { LayoutData } from "./$types";
	import { Layout } from "$lib/components";

	export let data: LayoutData;
</script>

<Layout {data}>
	<slot />
</Layout>
