<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import MoreHorizontalIcon from "@lucide/svelte/icons/more-horizontal";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	data-slot="breadcrumb-ellipsis"
	class={cn("hover:text-foreground flex size-9 items-center justify-center", className)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		<MoreHorizontalIcon class="size-4" />
		<span class="sr-only">More</span>
	{/if}
</span>
