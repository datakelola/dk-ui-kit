<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLAnchorAttributes } from "svelte/elements";

	let {
		class: className,
		children,
		...restProps
	}: HTMLAnchorAttributes = $props();
</script>

<a
	data-slot="breadcrumb-link"
	class={cn(
		"hover:text-foreground focus-visible:ring-ring rounded-sm transition-colors focus-visible:ring-[3px] focus-visible:outline-none",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</a>
