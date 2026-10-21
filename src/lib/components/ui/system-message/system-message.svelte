<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const systemMessageVariants = tv({
		base: "w-full py-1.5 text-center text-xs leading-relaxed",
		variants: {
			variant: {
				default:
					"bg-bubble-system text-bubble-system-foreground dark:bg-success-900/60 dark:text-success-100",
				info: "bg-info/10 text-info dark:bg-brand-900/50 dark:text-brand-100",
				warning:
					"bg-warning-50 text-warning-900 dark:bg-warning-900/50 dark:text-warning-100",
				destructive:
					"bg-danger-50 text-danger-800 dark:bg-danger-900/50 dark:text-danger-100",
				muted: "bg-muted text-muted-foreground",
			},
			shape: {
				pill: "rounded-full px-4 py-1.5",
				banner: "rounded-control border border-transparent px-4 py-2.5",
				plain: "",
			},
		},
		defaultVariants: {
			variant: "default",
			shape: "pill",
		},
	});

	export type SystemMessageVariant = VariantProps<typeof systemMessageVariants>["variant"];
	export type SystemMessageShape = VariantProps<typeof systemMessageVariants>["shape"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		variant = "default",
		shape = "pill",
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: SystemMessageVariant;
		shape?: SystemMessageShape;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="system-message"
	data-variant={variant}
	data-shape={shape}
	class={cn(systemMessageVariants({ variant, shape }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
