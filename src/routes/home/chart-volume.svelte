<script lang="ts">
	import * as Chart from '$lib/components/ui/chart';

	const chartConfig = { volume: { label: 'Volume', color: 'var(--primary)' } };
	const bars = [42, 68, 55, 80, 62, 90, 74];
</script>

<Chart.Container config={chartConfig} class="min-h-40">
	<div class="flex h-36 w-full items-end gap-2">
		{#each bars as b}<div class="flex-1 rounded bg-primary/80" style="height:{b}%"></div>{/each}
	</div>
</Chart.Container>
