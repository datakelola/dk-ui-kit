<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const avatarStatusVariants = tv({
		variants: {
			status: {
				online: "bg-success",
				away: "bg-warning",
				busy: "bg-destructive",
				offline: "bg-neutral-400",
			},
		},
		defaultVariants: { status: "online" },
	});

	export type AvatarStatus = "online" | "away" | "busy" | "offline";
</script>

<script lang="ts">
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import type { Snippet } from "svelte";

	let {
		ref = $bindable(null),
		loadingStatus = $bindable("loading"),
		size = "default",
		status,
		class: className,
		children,
		...restProps
	}: AvatarPrimitive.RootProps & {
		size?: "default" | "sm" | "lg";
		status?: AvatarStatus;
		children?: Snippet;
	} = $props();
</script>

<AvatarPrimitive.Root
	bind:ref
	bind:loadingStatus
	data-slot="avatar"
	data-size={size}
	class={cn(
		"size-8 rounded-full after:rounded-full data-[size=lg]:size-10 data-[size=sm]:size-6 group/avatar relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:border-border after:mix-blend-darken dark:after:mix-blend-lighten",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	{#if status}
		<span
			data-slot="avatar-status"
			class={cn(
				"absolute right-0 bottom-0 size-2.5 rounded-full ring-2 ring-background dark:ring-card data-[size=sm]:size-2",
				avatarStatusVariants({ status })
			)}
		></span>
	{/if}
</AvatarPrimitive.Root>