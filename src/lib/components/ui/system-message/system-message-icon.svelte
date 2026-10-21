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
	data-slot="system-message-icon"
	class={cn("inline-flex size-4 shrink-0 items-center justify-center align-[-3px]", className)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		<svg viewBox="0 0 24 24" fill="none" class="size-3.5" aria-hidden="true">
			<path
				d="M20 6 9 17l-5-5"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{/if}
</span>
