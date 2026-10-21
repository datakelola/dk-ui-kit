<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	export const alertVariants = tv({
		base: "grid gap-0.5 rounded-control border px-3 py-2.5 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4 group/alert relative w-full transition-colors",
		variants: {
			variant: {
				default: "bg-primary-muted text-primary-muted-foreground border-primary-border",
				info: "bg-primary-muted text-primary-muted-foreground border-primary-border *:data-[slot=alert-description]:text-primary-muted-foreground/80",
				destructive: "bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-900/40 dark:text-danger-300 dark:border-danger-800 *:data-[slot=alert-description]:text-danger-700/80 dark:*:data-[slot=alert-description]:text-danger-300/80",
				success: "bg-success-50 text-success-700 border-success-200 dark:bg-success-900/40 dark:text-success-300 dark:border-success-800 *:data-[slot=alert-description]:text-success-700/80 dark:*:data-[slot=alert-description]:text-success-300/80",
				warning: "bg-warning-50 text-warning-700 border-warning-200 dark:bg-warning-900/40 dark:text-warning-300 dark:border-warning-800 *:data-[slot=alert-description]:text-warning-700/80 dark:*:data-[slot=alert-description]:text-warning-300/80",
			},
			mode: {
				subtle: "",
				filled: "",
			},
		},
		compoundVariants: [
			{ variant: "destructive", mode: "filled", class: "bg-destructive border-destructive text-destructive-foreground *:data-[slot=alert-description]:text-destructive-foreground/80" },
			{ variant: "success", mode: "filled", class: "bg-success border-success text-success-foreground *:data-[slot=alert-description]:text-success-foreground/80" },
			{ variant: "warning", mode: "filled", class: "bg-warning border-warning text-warning-foreground *:data-[slot=alert-description]:text-warning-foreground/80" },
			{ variant: "info", mode: "filled", class: "bg-info border-info text-info-foreground *:data-[slot=alert-description]:text-info-foreground/80" },
			{ variant: "default", mode: "filled", class: "bg-primary border-primary-text text-primary-foreground *:data-[slot=alert-description]:text-primary-foreground" },
		],
		defaultVariants: {
			variant: "default",
			mode: "subtle",
		},
	});

	export type AlertVariant = VariantProps<typeof alertVariants>["variant"];
	export type AlertMode = VariantProps<typeof alertVariants>["mode"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		variant = "default",
		mode = "subtle",
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: AlertVariant;
		mode?: AlertMode;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="alert"
	role="alert"
	class={cn(alertVariants({ variant, mode }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
