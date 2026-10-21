<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		state = "upcoming",
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLLIElement>> & {
		state?: "complete" | "current" | "upcoming";
	} = $props();
</script>

<li
	bind:this={ref}
	data-slot="stepper-item"
	data-state={state}
	class={cn(
		"group/stepper-item flex shrink-0 items-center gap-2",
		"group-data-[orientation=horizontal]/stepper:flex-1",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</li>
