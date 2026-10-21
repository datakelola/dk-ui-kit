<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="sidebar-group"
	data-sidebar="group"
	class={cn(
		"p-2 relative flex w-full min-w-0 flex-col transition-[padding,margin] duration-200 ease-linear group-data-[collapsible=icon]:my-1 group-data-[collapsible=icon]:py-0 motion-reduce:transition-none",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
