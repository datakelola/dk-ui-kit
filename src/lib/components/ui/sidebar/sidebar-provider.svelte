<script lang="ts">
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import {
		SIDEBAR_COOKIE_MAX_AGE,
		SIDEBAR_COOKIE_NAME,
		SIDEBAR_WIDTH,
		SIDEBAR_WIDTH_ICON,
	} from "./constants.js";
	import { setSidebar } from "./context.svelte.js";
	import { SidebarHover } from "./sidebar-hover.svelte.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		open = $bindable(true),
		onOpenChange = () => {},
		hoverCollapseDelay,
		hoverExpandDelay,
		class: className,
		style,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		/** Grace period before a hover peek collapses. Defaults to 150ms. */
		hoverCollapseDelay?: number;
		hoverExpandDelay?: number;
	} = $props();

	const hover = new SidebarHover(
		() => hoverCollapseDelay ?? 150,
		() => hoverExpandDelay ?? 80
	);

	const sidebar = setSidebar(
		{
			open: () => open,
			setOpen: (value: boolean) => {
				open = value;
				onOpenChange(value);

				// This sets the cookie to keep the sidebar state.
				document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
			},
		},
		hover
	);

	// Peeking is a mouse affordance. Coarse pointers get the normal Sheet sidebar.
	$effect(() => {
		const query = window.matchMedia("(pointer: fine)");
		hover.syncPointer(query);
		const onChange = () => hover.syncPointer(query);
		query.addEventListener("change", onChange);
		return () => {
			query.removeEventListener("change", onChange);
			hover.destroy();
		};
	});

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== "Escape" || !sidebar.peeking) return;
		event.preventDefault();
		hover.close();
	}
</script>

<svelte:window onkeydown={(e) => {
	sidebar.handleShortcutKeydown(e);
	handleKeydown(e);
}} />

<Tooltip.Provider delayDuration={0}>
	<div
		data-slot="sidebar-wrapper"
		style="--sidebar-width: {SIDEBAR_WIDTH}; --sidebar-width-icon: {SIDEBAR_WIDTH_ICON}; {style}"
		class={cn(
			"group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
			className
		)}
		bind:this={ref}
		{...restProps}
	>
		{@render children?.()}
	</div>
</Tooltip.Provider>
