<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	data-slot="stepper-title"
	class={cn(
		"text-sm font-medium transition-colors",
		"group-data-[state=upcoming]/stepper-item:text-muted-foreground",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
