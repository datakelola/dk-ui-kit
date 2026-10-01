<script lang="ts">
	import * as Chart from '$lib/components/ui/chart';
	import { Chart as LCChart, Svg, Axis, Grid, Bars } from 'layerchart';

	let {
		data,
		config
	}: {
		data: { label: string; value: number }[];
		config: Record<string, { label: string }>;
	} = $props();
</script>

<Chart.Container config={config} class="aspect-auto h-72">
	<LCChart {data} x="label" y="value" padding={{ left: 8, right: 8 }}>
		<Svg
			><Grid vertical={false} /><Axis placement="bottom" /><Axis placement="left" grid rule domain={[0, 5]} /><Bars
				radius={6}
			 /></Svg
		>
	</LCChart>
</Chart.Container>
