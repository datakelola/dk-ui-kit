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
	data-slot="navbar-bottom-badge"
	class={cn(
		"bg-destructive text-destructive-foreground ring-background absolute top-0.5 right-1/2 z-10 inline-flex min-w-5 translate-x-1/2 items-center justify-center rounded-full px-1 text-xs leading-4 font-semibold tabular-nums ring-2",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
