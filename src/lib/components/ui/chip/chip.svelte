<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const chipVariants = tv({
		base: "inline-flex w-fit max-w-full items-center gap-1.5 rounded-sm font-medium whitespace-nowrap transition-colors select-none",
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground",
				info: "bg-info text-info-foreground",
				success: "bg-success text-success-foreground",
				warning: "bg-warning text-warning-900 dark:text-warning-900",
				destructive: "bg-destructive text-destructive-foreground",
				secondary: "bg-secondary text-secondary-foreground",
				outline: "border-border bg-background text-foreground",
			},
			size: {
				sm: "h-6 px-2 text-xs",
				default: "h-6 px-2.5 text-xs",
				lg: "h-8 px-3 text-sm",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type ChipVariant = VariantProps<typeof chipVariants>["variant"];
	export type ChipSize = VariantProps<typeof chipVariants>["size"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		variant = "default",
		size = "default",
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> & {
		variant?: ChipVariant;
		size?: ChipSize;
	} = $props();
</script>

<span
	bind:this={ref}
	data-slot="chip"
	data-variant={variant}
	data-size={size}
	class={cn(chipVariants({ variant, size }), className)}
	{...restProps}
>
	{@render children?.()}
</span>
