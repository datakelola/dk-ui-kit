<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const ticketBannerVariants = tv({
		base: "inline-flex w-fit max-w-full items-center gap-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
		variants: {
			variant: {
				default: "bg-primary-muted text-primary-muted-foreground",
				solid: "bg-primary text-primary-foreground",
				outline:
					"border-primary-border text-primary-muted-foreground bg-transparent",
				warning:
					"bg-warning-50 text-warning-900 dark:bg-warning-900/50 dark:text-warning-100",
				destructive:
					"bg-danger-50 text-danger-800 dark:bg-danger-900/50 dark:text-danger-100",
			},
			size: {
				sm: "h-6 px-2.5 text-xs",
				default: "h-8 px-3",
				lg: "h-10 px-4 text-base",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type TicketBannerVariant = VariantProps<typeof ticketBannerVariants>["variant"];
	export type TicketBannerSize = VariantProps<typeof ticketBannerVariants>["size"];
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
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: TicketBannerVariant;
		size?: TicketBannerSize;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="ticket-banner"
	data-variant={variant}
	data-size={size}
	class={cn(ticketBannerVariants({ variant, size }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
