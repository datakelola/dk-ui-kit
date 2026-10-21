<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Avatar, AvatarFallback } from "$lib/components/ui/avatar";
	import * as Tabs from "$lib/components/ui/tabs";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as TicketBanner from "$lib/components/ui/ticket-banner";
	import * as SystemMessage from "$lib/components/ui/system-message";
	import * as Stepper from "$lib/components/ui/stepper";
	import Composer from "./composer.svelte";
	import ChannelIcon from "./channel-icon.svelte";
	import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
	import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
	import PaperclipIcon from "@lucide/svelte/icons/paperclip";
	import { AGENTS, JOURNEY, MESSAGES, type ChatMessage, type Customer, type Thread } from "./mock";

	type Props = {
		thread: Thread;
		customer: Customer;
		labels: Record<string, string>;
		showBack?: boolean;
		onBack?: () => void;
		assigneeId?: string | null;
	};

	let { thread, customer, labels, showBack = false, onBack, assigneeId }: Props = $props();

	let messages = $state<ChatMessage[]>([]);
	let loadedFor = $state<string | null>(null);
	let activeTab = $state("ticket");
	let actionMessage = $state("");
	let threadClosed = $state(false);

	$effect(() => {
		if (thread.id !== loadedFor) {
			loadedFor = thread.id;
			messages = [...(MESSAGES[thread.id] ?? [])];
		}
	});

	const agentOf = (id: string) => AGENTS.find((a) => a.id === id)!;

	function onSend(value: string, attachment?: { name: string; size: string }) {
		messages = [
			...messages,
			{
				id: `local-${Date.now()}`,
				kind: "agent",
				text: value,
				time: new Date().toLocaleTimeString("id-ID", {
					hour: "2-digit",
					minute: "2-digit"
				}),
				attachment
			}
		];
	}

	async function copyText(value: string, message: string) {
		try {
			await navigator.clipboard.writeText(value);
			actionMessage = message;
		} catch {
			actionMessage = labels.clipboardUnavailable;
		}
	}

	function closeThread() {
		threadClosed = true;
		actionMessage = labels.closeChat;
	}
</script>

<section class="bg-background flex h-full min-w-0 flex-col">
	<!-- header -->
	<header class="border-border flex items-center gap-3 border-b px-4 py-3">
		{#if showBack}
			<Button variant="ghost" size="icon" class="min-h-10 min-w-10 lg:hidden" aria-label={labels.back} onclick={onBack}>
				<ChevronLeftIcon class="size-4" />
			</Button>
		{/if}

		<Avatar class="size-9">
			<AvatarFallback class="text-meta font-semibold">{customer.initials}</AvatarFallback>
		</Avatar>

		<div class="min-w-0 flex-1">
			<div class="flex items-center gap-1.5">
				<h2 class="truncate text-sm font-semibold">{customer.name}</h2>
				<ChannelIcon channel={thread.channel} class="size-5" />
			</div>
			<p class="text-muted-foreground truncate text-meta">
				{customer.phone} · {labels.assigned}: {agentOf(assigneeId ?? thread.assigneeId).name}
			</p>
		</div>

		{#if thread.ticketId}
			<TicketBanner.Root size="sm" class="hidden sm:inline-flex">
				<TicketBanner.Id>{thread.ticketId}</TicketBanner.Id>
			</TicketBanner.Root>
		{/if}

		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="ghost" size="icon" class="min-h-10 min-w-10" aria-label={labels.more} {...props}>
						<EllipsisIcon class="size-4" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				{#if thread.ticketId}
					<DropdownMenu.Item onclick={() => copyText(thread.ticketId!, labels.copyTicket)}>{labels.copyTicket}</DropdownMenu.Item>
				{/if}
				<DropdownMenu.Item onclick={() => (actionMessage = labels.markUnread)}>{labels.markUnread}</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item variant="destructive" onclick={closeThread}>{labels.closeChat}</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</header>

	<!-- journey stepper -->
	<div class="border-border bg-muted/30 border-b px-4 py-3">
		<Stepper.Root class="w-full">
			{#each JOURNEY as step, i (step.key)}
				<Stepper.Item state={step.state}>
					<div class="flex items-center gap-2">
						<Stepper.Indicator />
						<div class="min-w-0">
				<Stepper.Title class="max-md:sr-only">{step.title}</Stepper.Title>
							<Stepper.Description>{step.time}</Stepper.Description>
						</div>
					</div>
					{#if i < JOURNEY.length - 1}
						<Stepper.Separator />
					{/if}
				</Stepper.Item>
			{/each}
		</Stepper.Root>
	</div>

	<!-- tabs -->
	<div class="border-border border-b px-4 py-2">
		<Tabs.Root bind:value={activeTab}>
			<Tabs.List variant="pill" class="w-full justify-start gap-1">
				<Tabs.Trigger value="overview" class="flex-1">{labels.overview}</Tabs.Trigger>
				<Tabs.Trigger value="ticket" class="flex-1">{labels.endTicket}</Tabs.Trigger>
				<Tabs.Trigger value="history" class="flex-1">{labels.history}</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	</div>

	{#if actionMessage}
		<p class="bg-success-50 text-success-900 border-success-200 border-b px-4 py-1.5 text-meta" role="status">
			{actionMessage}
		</p>
	{/if}
	{#if activeTab === "overview"}
		<div class="border-border bg-muted/20 border-b px-4 py-3 text-meta">
			<p class="font-medium">{customer.name}</p>
			<p class="text-muted-foreground mt-1">{labels.assigned}: {agentOf(assigneeId ?? thread.assigneeId).name}</p>
		</div>
	{:else if activeTab === "history"}
		<div class="border-border bg-muted/20 border-b px-4 py-3 text-meta">
			<p class="font-medium">{labels.history}</p>
			<p class="text-muted-foreground mt-1">{labels.historyCount}: {messages.length}</p>
		</div>
	{/if}

	<!-- messages -->
	<div class="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
		{#each messages as message (message.id)}
			{#if message.kind === "system"}
				<SystemMessage.Root shape="pill">
					<SystemMessage.Icon />
					<SystemMessage.Content>{message.text}</SystemMessage.Content>
					<SystemMessage.Time>{message.time}</SystemMessage.Time>
				</SystemMessage.Root>
			{:else}
				<div class={message.kind === "agent" ? "flex justify-end" : "flex justify-start"}>
					<div
						class="max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed sm:max-w-[70%] {message
							.kind === 'agent'
							? 'bg-bubble-sent text-bubble-sent-foreground rounded-br-md'
							: 'bg-bubble-received text-bubble-received-foreground rounded-bl-md'}"
					>
						<p>{message.text}</p>

						{#if message.attachment}
							<div
								class={message.kind === "agent"
									? "bg-primary-active/25 mt-2 flex items-center gap-2 rounded-lg px-2.5 py-2"
									: "bg-background/60 mt-2 flex items-center gap-2 rounded-lg px-2.5 py-2"}
							>
								<PaperclipIcon class="size-3.5 shrink-0" />
								<span class="truncate text-meta font-medium">{message.attachment.name}</span>
								<span class="ml-auto shrink-0 text-meta opacity-70 tabular-nums">
									{message.attachment.size}
								</span>
							</div>
						{/if}

						<div class="mt-1 text-meta opacity-70 tabular-nums">{message.time}</div>
					</div>
				</div>
			{/if}
		{/each}
	</div>

	<Composer
		placeholder={labels.message}
		attachLabel={labels.attach}
		sendLabel={labels.send}
		removeAttachmentLabel={labels.removeAttachment}
		attachmentErrorLabel={labels.attachmentError}
			onSend={onSend}
		disabled={threadClosed}
	/>
</section>
