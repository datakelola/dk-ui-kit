<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const navbarBottomItemVariants = tv({
		base: "relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition-colors",
		variants: {
			active: {
				true: "text-primary-text",
				false: "text-muted-foreground hover:text-foreground",
			},
			size: {
				sm: "py-1.5 text-xs",
				default: "py-2.5 text-xs",
			},
		},
		defaultVariants: {
			active: false,
			size: "default",
		},
	});

	export type NavbarBottomItemVariant = VariantProps<typeof navbarBottomItemVariants>;
</script>

<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLAnchorAttributes } from "svelte/elements";

	let {
		class: className,
		active = false,
		size = "default",
		children,
		...restProps
	}: HTMLAnchorAttributes & NavbarBottomItemVariant = $props();
</script>

<a
	data-slot="navbar-bottom-item"
	data-active={active}
	aria-current={active ? "page" : undefined}
	class={cn(navbarBottomItemVariants({ active, size }), className)}
	{...restProps}
>
	{@render children?.()}
</a>
