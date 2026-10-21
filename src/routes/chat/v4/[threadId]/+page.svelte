<script lang="ts">
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { locale } from "$lib/i18n";
	import AgentPanel from "$lib/components/omnichat/agent-panel.svelte";
	import ThreadPanel from "$lib/components/omnichat/thread-panel.svelte";
	import { CHAT_STR, CUSTOMERS, THREADS } from "$lib/components/omnichat/mock";

	let s = $derived(CHAT_STR[$locale]);

	let thread = $derived(THREADS.find((t) => t.id === page.params.threadId) ?? null);
	let customer = $derived(thread ? CUSTOMERS.find((c) => c.id === thread!.customerId)! : null);
	let assigneeId = $state<string | null>(null);

	$effect(() => {
		if (thread) assigneeId = thread.assigneeId;
	});
</script>

<svelte:head>
	<title>{customer ? `${customer.name} — Omnichat v4` : "Omnichat v4"} — DK CRM</title>
</svelte:head>

<!-- h-[calc(100svh-4rem)] mirrors the shell topbar (h-16); see the note in /chat/v4/+page.svelte -->
<div class="bg-background text-foreground flex h-[calc(100svh-4rem)] w-full overflow-hidden">
	{#if thread && customer}
		<div class="flex min-w-0 flex-1">
			<div class="flex min-w-0 flex-1 flex-col">
				<ThreadPanel
					{thread}
					{customer}
					{assigneeId}
					labels={s}
					showBack
					onBack={() => goto("/chat/v4")}
				/>
			</div>

			<div class="hidden w-80 shrink-0 xl:block">
				<AgentPanel {thread} {customer} labels={s} onAssigneeChange={(id) => (assigneeId = id)} />
			</div>
		</div>
	{:else}
		<div class="flex min-w-0 flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
			<p class="text-sm font-medium">{s.threadNotFound}</p>
			<button
				type="button"
				onclick={() => goto("/chat/v4")}
				class="text-primary-text text-sm font-medium underline underline-offset-4"
			>
				{s.inbox}
			</button>
		</div>
	{/if}
</div>
