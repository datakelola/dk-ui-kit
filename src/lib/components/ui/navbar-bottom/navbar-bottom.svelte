<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> = $props();
</script>

<nav
	bind:this={ref}
	data-slot="navbar-bottom"
	class={cn(
		"bg-background border-border flex items-stretch justify-around border-t px-1 pb-[env(safe-area-inset-bottom)]",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</nav>
