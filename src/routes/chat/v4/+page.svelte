<script lang="ts">
	import { goto } from "$app/navigation";
	import { locale } from "$lib/i18n";
	import AgentPanel from "$lib/components/omnichat/agent-panel.svelte";
	import InboxPanel from "$lib/components/omnichat/inbox-panel.svelte";
	import ThreadPanel from "$lib/components/omnichat/thread-panel.svelte";
	import { CHAT_STR, CUSTOMERS, THREADS } from "$lib/components/omnichat/mock";

	let s = $derived(CHAT_STR[$locale]);

	let activeId = $state(THREADS[0]?.id ?? null);
	let assigneeId = $state<string | null>(null);

	let thread = $derived(THREADS.find((t) => t.id === activeId) ?? null);
	let customer = $derived(thread ? CUSTOMERS.find((c) => c.id === thread!.customerId)! : null);

	$effect(() => {
		if (thread) assigneeId = thread.assigneeId;
	});
</script>

<svelte:head>
	<title>Omnichat v4 — DK CRM</title>
</svelte:head>

<!-- h-[calc(100svh-4rem)] mirrors the shell topbar (h-16). An `h-full` here would
     resolve against a `flex-1` parent that only has a `min-h-svh` height, and the
     circular percentage would let the thread panel grow the document by ~12px. -->
<div class="bg-background text-foreground flex h-[calc(100svh-4rem)] w-full overflow-hidden">
	<!-- mobile: inbox only -->
	<div class="flex min-w-0 flex-1 flex-col lg:hidden">
		<InboxPanel {activeId} onSelect={(id) => goto(`/chat/v4/${id}`)} labels={s} />
	</div>

	<!-- desktop: full 4-column shell -->
	{#if thread && customer}
		<div class="hidden min-w-0 flex-1 lg:flex">
			<div class="w-80 shrink-0">
				<InboxPanel {activeId} onSelect={(id) => (activeId = id)} labels={s} />
			</div>
			<div class="min-w-0 flex-1">
				<ThreadPanel {thread} {customer} {assigneeId} labels={s} />
			</div>
			<div class="w-80 shrink-0">
				<AgentPanel {thread} {customer} labels={s} onAssigneeChange={(id) => (assigneeId = id)} />
			</div>
		</div>
	{/if}
</div>
