<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const stepperVariants = tv({
		base: "flex w-full items-center",
		variants: {
			orientation: {
				horizontal: "flex-row",
				vertical: "flex-col items-start",
			},
			gap: {
				sm: "gap-2",
				default: "gap-3",
				lg: "gap-4",
			},
		},
		defaultVariants: {
			orientation: "horizontal",
			gap: "default",
		},
	});

	export type StepperVariant = NonNullable<VariantProps<typeof stepperVariants>>;
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		orientation = "horizontal",
		gap = "default",
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLOListElement>> & StepperVariant = $props();
</script>

<ol
	bind:this={ref}
	data-slot="stepper"
	data-orientation={orientation}
	class={cn("group/stepper", stepperVariants({ orientation, gap }), className)}
	{...restProps}
>
	{@render children?.()}
</ol>
