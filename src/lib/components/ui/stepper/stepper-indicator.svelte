<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import CheckIcon from "@lucide/svelte/icons/check";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	data-slot="stepper-indicator"
	class={cn(
		"ring-background inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ring-2 transition-colors",
		"group-data-[state=upcoming]/stepper-item:bg-background group-data-[state=upcoming]/stepper-item:text-muted-foreground group-data-[state=upcoming]/stepper-item:border group-data-[state=upcoming]/stepper-item:border-border",
		"group-data-[state=current]/stepper-item:bg-primary group-data-[state=current]/stepper-item:text-primary-foreground",
		"group-data-[state=complete]/stepper-item:bg-success group-data-[state=complete]/stepper-item:text-success-foreground",
		className
	)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		<CheckIcon
			class="size-3.5 group-data-[state=complete]/stepper-item:block hidden"
		/>
	{/if}
</span>
