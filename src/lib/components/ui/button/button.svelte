<script lang="ts" module>
	// @ts-nocheck
	import { type VariantProps, tv } from "tailwind-variants";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";

	export const buttonVariants = tv({
		base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-control border border-transparent bg-clip-padding text-sm font-medium transition-colors focus-visible:ring-3 aria-invalid:ring-3 [&_svg:not([class*='size-'])]:size-4 group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap outline-none select-none disabled:pointer-events-none disabled:bg-neutral-200 disabled:text-neutral-500 disabled:border-neutral-200 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-600 dark:disabled:border-neutral-800 [&_svg]:pointer-events-none [&_svg]:shrink-0",
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
				outline: "border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground disabled:bg-transparent disabled:text-neutral-400 dark:disabled:bg-transparent dark:disabled:text-neutral-600",
				secondary: "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground disabled:bg-transparent disabled:text-neutral-400 dark:disabled:bg-transparent dark:disabled:text-neutral-600",
				ghost: "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground disabled:bg-transparent disabled:text-neutral-400 dark:disabled:bg-transparent dark:disabled:text-neutral-600",
				destructive: "bg-destructive hover:bg-danger-700 active:bg-danger-800 text-destructive-foreground focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
				link: "text-primary-text underline-offset-4 hover:underline disabled:bg-transparent disabled:text-neutral-400 dark:disabled:bg-transparent dark:disabled:text-neutral-600",
			},
			size: {
				default: "h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
				xs: "h-7 gap-1 rounded-[4px] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
				sm: "h-8 gap-1.5 rounded-[4px] px-3 text-sm in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4",
				lg: "h-12 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
				xl: "h-14 gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
				icon: "size-10",
				"icon-xs": "size-7 rounded-[4px] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
				"icon-sm": "size-8 rounded-[4px] in-data-[slot=button-group]:rounded-lg",
				"icon-lg": "size-12",
				"icon-xl": "size-14",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
	export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	let {
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		href = undefined,
		type = "button",
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();

	const elementProps = restProps as any;
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? "link" : undefined}
		tabindex={disabled ? -1 : undefined}
		{...(restProps as any)}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...(restProps as any)}
	>
		{@render children?.()}
	</button>
{/if}
