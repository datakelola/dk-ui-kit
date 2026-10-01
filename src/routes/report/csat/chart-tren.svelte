<script lang="ts">
	import * as Chart from '$lib/components/ui/chart';
	import { Chart as LCChart, Svg, Axis, Grid, Area } from 'layerchart';

	let {
		data,
		config
	}: {
		data: { day: string; total: number; filled: number }[];
		config: Record<string, { label: string }>;
	} = $props();
</script>

<Chart.Container config={config} class="aspect-auto h-64">
	<LCChart {data} x="day" y="total" yNice padding={{ left: 8, right: 8 }}>
		<Svg
			><Grid vertical={false} /><Axis placement="bottom" /><Axis placement="left" grid rule /><Area
				y1="total"
				fill="var(--color-primary)"
				fillOpacity={0.15}
				stroke="var(--color-primary)"
			 /><Area
				y1="filled"
				fill="var(--color-success, #16a34a)"
				fillOpacity={0.2}
				stroke="var(--color-success, #16a34a)"
			 /></Svg
		>
	</LCChart>
</Chart.Container>
