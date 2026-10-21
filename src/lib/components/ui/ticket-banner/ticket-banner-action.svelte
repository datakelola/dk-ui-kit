<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLButtonAttributes } from "svelte/elements";

	let {
		class: className,
		children,
		...restProps
	}: HTMLButtonAttributes = $props();
</script>

<button
	type="button"
	data-slot="ticket-banner-action"
	class={cn(
		"hover:bg-foreground/10 focus-visible:ring-ring -mr-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-[3px] focus-visible:outline-none",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</button>
