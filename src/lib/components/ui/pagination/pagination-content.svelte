<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLUListElement>> = $props();
</script>

<ul
	bind:this={ref}
	data-slot="pagination-content"
	class={cn("gap-1.5 flex flex-wrap items-center", className)}
	{...restProps}
>
	{@render children?.()}
</ul>
