<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	data-slot="stepper-separator"
	aria-hidden="true"
	class={cn(
		"mx-1 hidden h-0.5 min-w-6 flex-1 rounded-full bg-border transition-colors md:block",
		"group-data-[state=complete]/stepper-item:bg-success",
		"group-data-[orientation=vertical]/stepper:mx-0 group-data-[orientation=vertical]/stepper:my-1 group-data-[orientation=vertical]/stepper:ml-3 group-data-[orientation=vertical]/stepper:h-8 group-data-[orientation=vertical]/stepper:w-0.5 group-data-[orientation=vertical]/stepper:min-w-0",
		className
	)}
	{...restProps}
></span>
