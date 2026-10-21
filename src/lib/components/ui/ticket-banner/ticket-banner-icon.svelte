<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import TicketIcon from "@lucide/svelte/icons/ticket";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	data-slot="ticket-banner-icon"
	class={cn("inline-flex size-4 shrink-0 items-center justify-center", className)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		<TicketIcon class="size-4" />
	{/if}
</span>
