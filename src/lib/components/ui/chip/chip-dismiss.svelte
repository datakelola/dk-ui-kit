<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLButtonAttributes } from "svelte/elements";
	import XIcon from "@lucide/svelte/icons/x";

	let {
		class: className,
		children,
		...restProps
	}: HTMLButtonAttributes = $props();
</script>

<button
	type="button"
	data-slot="chip-dismiss"
	class={cn(
		"hover:bg-foreground/10 focus-visible:ring-ring -mr-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-[3px] focus-visible:outline-none",
		className
	)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		<XIcon class="size-3" />
	{/if}
</button>
