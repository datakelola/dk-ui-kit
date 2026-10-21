<script lang="ts">
	import ChannelIcon from "./channel-icon.svelte";
	import type { Customer, Thread } from "./mock";
	import { cn } from "$lib/utils.js";

	type Props = {
		thread: Thread;
		customer: Customer;
		active?: boolean;
		onclick?: () => void;
	};

	let { thread, customer, active = false, onclick }: Props = $props();

	let unread = $derived(thread.unread > 0);
</script>

<button
	type="button"
	data-active={active}
	aria-pressed={active}
	onclick={onclick}
		class={cn(
			"group border-border/60 hover:bg-accent flex min-h-16 w-full items-start gap-3 border-b px-3 py-3 text-left transition-colors last:border-b-0",
		"data-active:bg-primary-muted data-active:hover:bg-primary-muted",
		"focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
	)}
>
	<div class="relative shrink-0">
		<span
			class="bg-muted text-muted-foreground inline-flex size-9 items-center justify-center rounded-full text-meta font-semibold"
		>
			{customer.initials}
		</span>
		<span class="absolute -right-0.5 -bottom-0.5">
			<ChannelIcon channel={thread.channel} class="size-5 ring-background ring-2" />
		</span>
	</div>

	<div class="min-w-0 flex-1">
		<div class="flex items-baseline justify-between gap-2">
			<span class={cn("truncate text-sm", unread ? "font-semibold" : "font-medium")}>
				{customer.name}
			</span>
			<span class="text-muted-foreground shrink-0 text-meta tabular-nums">{thread.time}</span>
		</div>

		<div class="mt-0.5 flex items-center gap-2">
			<p class={cn("text-muted-foreground line-clamp-1 flex-1 text-meta", unread && "text-foreground")}>
				{thread.preview}
			</p>
			{#if unread}
				<span
					class="bg-destructive text-destructive-foreground inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1 text-meta leading-tight font-semibold tabular-nums"
				>
					{thread.unread}
				</span>
			{/if}
		</div>

		{#if thread.ticketId}
			<span
				class="bg-primary-muted text-primary-muted-foreground mt-1.5 inline-flex items-center rounded-full px-1.5 py-0.5 text-meta font-medium tracking-tight tabular-nums"
			>
				{thread.ticketId}
			</span>
		{/if}
	</div>
</button>
