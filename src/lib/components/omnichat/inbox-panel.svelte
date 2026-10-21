<script lang="ts">
	import ChatListItem from "./chat-list-item.svelte";
	import { CUSTOMERS, THREADS, type ThreadStatus } from "./mock";
	import SearchIcon from "@lucide/svelte/icons/search";
	import { cn } from "$lib/utils.js";

	type Filter = "all" | "unread" | ThreadStatus;

	type Props = {
		activeId?: string | null;
		onSelect?: (id: string) => void;
		labels: Record<string, string>;
	};

	let { activeId = null, onSelect, labels }: Props = $props();

	let query = $state("");
	let filter = $state<Filter>("all");

	const FILTERS: Filter[] = ["all", "unread", "pending", "closed"];

	const customerOf = (id: string) => CUSTOMERS.find((c) => c.id === id)!;

	let list = $derived(
		THREADS.filter((t) => {
			const name = customerOf(t.customerId).name.toLowerCase();
			const hit =
				query.trim() === "" ||
				name.includes(query.trim().toLowerCase()) ||
				t.preview.toLowerCase().includes(query.trim().toLowerCase()) ||
				(t.ticketId ?? "").toLowerCase().includes(query.trim().toLowerCase());
			if (!hit) return false;
			if (filter === "all") return true;
			if (filter === "unread") return t.unread > 0;
			return t.status === filter;
		})
	);
	let emptyLabel = $derived(query.trim() ? labels.emptySearch : filter !== "all" ? labels.emptyFilter : labels.empty);

	function resetFilters() {
		query = "";
		filter = "all";
	}
</script>

<aside class="bg-background flex h-full w-full flex-col border-r">
	<div class="border-border flex items-center justify-between gap-2 border-b px-4 py-3">
		<h2 class="text-sm font-semibold">{labels.inbox}</h2>
		<div class="flex items-center gap-2">
			<span class="text-muted-foreground text-xs">{labels.demoData}</span>
			<span class="text-muted-foreground text-xs tabular-nums">{list.length}</span>
		</div>
	</div>

	<div class="space-y-2 px-3 py-3">
		<div class="relative">
			<SearchIcon
				class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
			/>
			<input
				type="search"
				bind:value={query}
				placeholder={labels.search}
				aria-label={labels.search}
				class="border-border bg-background placeholder:text-muted-foreground focus-visible:border-primary-text focus-visible:ring-ring/40 h-10 w-full rounded-control border pr-3.5 pl-10 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
			/>
		</div>

		<div class="flex flex-wrap gap-1.5">
			{#each FILTERS as f (f)}
				<button
					type="button"
					aria-pressed={filter === f}
					onclick={() => (filter = f)}
					class={cn(
						"min-h-9 rounded-sm px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
						filter === f
							? "bg-primary text-primary-foreground"
							: "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
					)}
				>
					{labels[f]}
				</button>
			{/each}
		</div>
	</div>

	<div class="min-h-0 flex-1 overflow-y-auto">
		{#if list.length === 0}
			<div class="flex flex-col items-center gap-3 px-4 py-10 text-center">
				<p class="text-muted-foreground text-sm">{emptyLabel}</p>
				{#if query.trim() || filter !== "all"}
					<button type="button" class="text-primary-text min-h-9 text-sm font-medium underline underline-offset-4" onclick={resetFilters}>
						{labels.resetFilters}
					</button>
				{/if}
			</div>
		{:else}
			{#each list as thread (thread.id)}
				<ChatListItem
					{thread}
					customer={customerOf(thread.customerId)}
					active={thread.id === activeId}
					onclick={() => onSelect?.(thread.id)}
				/>
			{/each}
		{/if}
	</div>
</aside>
