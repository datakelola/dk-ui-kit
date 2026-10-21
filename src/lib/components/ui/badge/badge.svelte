<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	export const badgeVariants = tv({
		base: "h-6 gap-1.5 rounded-sm border border-transparent px-2.5 py-0.5 text-xs font-medium transition-colors has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none",
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground [a]:hover:bg-primary-hover",
				info: "bg-info text-info-foreground [a]:hover:bg-info/85",
				secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
				destructive: "bg-destructive text-destructive-foreground [a]:hover:bg-danger-700",
				success: "bg-success text-success-foreground [a]:hover:bg-success-600",
				warning: "bg-warning text-warning-foreground [a]:hover:bg-warning-600",
				outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
				ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
				link: "text-primary-text underline-offset-4 hover:underline",
			},
			size: {
				default: "h-6 text-xs",
				sm: "h-5 gap-0.5 px-1.5 text-xs [&>svg]:size-2.5!",
				lg: "h-8 gap-2 px-3 text-sm [&>svg]:size-4!",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
	export type BadgeSize = VariantProps<typeof badgeVariants>["size"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAnchorAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		href,
		class: className,
		variant = "default",
		size = "default",
		children,
		...restProps
	}: WithElementRef<HTMLAnchorAttributes> & {
		variant?: BadgeVariant;
		size?: BadgeSize;
	} = $props();
</script>

<svelte:element
	this={href ? "a" : "span"}
	bind:this={ref}
	data-slot="badge"
	{href}
	class={cn(badgeVariants({ variant, size }), className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
