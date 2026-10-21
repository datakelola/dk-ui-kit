<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLOListElement>> = $props();
</script>

<ol
	bind:this={ref}
	data-slot="breadcrumb-list"
	class={cn(
		"text-sm flex flex-wrap items-center gap-1.5 break-words sm:gap-2",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</ol>
