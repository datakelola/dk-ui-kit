<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";

	let {
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLLIElement> = $props();
</script>

<li
	data-slot="breadcrumb-separator"
	class={cn("text-muted-foreground [&>svg]:size-3.5", className)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		<ChevronRightIcon />
	{/if}
</li>
