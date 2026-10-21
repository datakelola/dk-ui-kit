<script lang="ts">
	import { Avatar, AvatarFallback } from "$lib/components/ui/avatar";
	import { Button } from "$lib/components/ui/button";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import * as Stepper from "$lib/components/ui/stepper";
	import * as TicketBanner from "$lib/components/ui/ticket-banner";
	import * as ContextMenu from "$lib/components/ui/context-menu";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import AgentOffIcon from "@lucide/svelte/icons/user-round";
	import ClockIcon from "@lucide/svelte/icons/clock";
	import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
	import MailIcon from "@lucide/svelte/icons/mail";
	import MapPinIcon from "@lucide/svelte/icons/map-pin";
	import PhoneIcon from "@lucide/svelte/icons/phone";
	import TicketIcon from "@lucide/svelte/icons/ticket";
	import UserRoundIcon from "@lucide/svelte/icons/user-round";
	import { AGENTS, JOURNEY, type Customer, type Thread } from "./mock";
	import { locale } from "$lib/i18n";

	type Props = {
		thread: Thread;
		customer: Customer;
		labels: Record<string, string>;
		onAssigneeChange?: (id: string) => void;
	};

	let { thread, customer, labels, onAssigneeChange }: Props = $props();

	let escalated = $state(false);
	let assigneeId = $state<string | null>(null);
	let loadedThreadId = $state<string | null>(null);
	let actionMessage = $state("");

	$effect(() => {
		if (thread.id !== loadedThreadId) {
			loadedThreadId = thread.id;
			assigneeId = thread.assigneeId;
		}
	});

	const agentOf = (id: string) => AGENTS.find((a) => a.id === id)!;

	const FIELD_STR: Record<string, Record<string, string>> = {
		id: { phone: "Telepon", email: "Email", location: "Lokasi", segment: "Segmen", joined: "Bergabung", total: "Total chat" },
		en: { phone: "Phone", email: "Email", location: "Location", segment: "Segment", joined: "Joined", total: "Total chats" },
		th: { phone: "โทรศัพท์", email: "อีเมล", location: "สถานที่", segment: "กลุ่ม", joined: "เข้าร่วม", total: "แชททั้งหมด" },
		tl: { phone: "Telepono", email: "Email", location: "Lokasyon", segment: "Segmento", joined: "Sumali", total: "Kabuuang chat" }
	};

	let f = $derived(FIELD_STR[$locale] ?? FIELD_STR.id);

	const ROWS = [
		{ key: "phone", icon: PhoneIcon },
		{ key: "email", icon: MailIcon },
		{ key: "location", icon: MapPinIcon },
		{ key: "segment", icon: UserRoundIcon },
		{ key: "joined", icon: ClockIcon },
		{ key: "total", icon: TicketIcon }
	];

	function value(key: string) {
		if (key === "total") return String(customer.totalChats);
		return customer[key as keyof Customer] as string;
	}

	function assignAgent(id: string) {
		assigneeId = id;
		onAssigneeChange?.(id);
		actionMessage = `${labels.assigned}: ${agentOf(id).name}`;
	}

	async function copyText(value: string, message: string) {
		try {
			await navigator.clipboard.writeText(value);
			actionMessage = message;
		} catch {
			actionMessage = labels.clipboardUnavailable;
		}
	}
</script>

<aside class="bg-background hidden h-full w-full flex-col overflow-y-auto border-l xl:flex">
	<div class="border-border flex items-center justify-between border-b px-4 py-3">
		<h2 class="text-sm font-semibold">{labels.customerInfo}</h2>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="ghost" size="icon" class="min-h-10 min-w-10" aria-label={labels.more} {...props}>
						<EllipsisIcon class="size-4" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Item onclick={() => copyText(customer.phone, labels.copyPhone)}>{labels.copyPhone}</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => copyText(customer.email, labels.copyEmail)}>{labels.copyEmail}</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<div class="flex flex-col items-center gap-2 px-4 py-5 text-center">
		<Avatar class="size-14">
			<AvatarFallback class="text-base font-semibold">{customer.initials}</AvatarFallback>
		</Avatar>
		<div>
			<p class="text-sm font-semibold">{customer.name}</p>
			<p class="text-muted-foreground text-meta">{customer.id.toUpperCase()}</p>
		</div>
	</div>

	{#if thread.ticketId}
		<div class="px-4 pb-4">
			<TicketBanner.Root size="default" class="w-full justify-between">
				<TicketBanner.Icon />
				<TicketBanner.Label>{labels.ticket}</TicketBanner.Label>
				<TicketBanner.Id>{thread.ticketId}</TicketBanner.Id>
			</TicketBanner.Root>
		</div>
	{/if}

	<dl class="border-border space-y-2.5 border-t px-4 py-4 text-meta">
		{#each ROWS as row (row.key)}
			{@const Icon = row.icon}
			<div class="flex items-start gap-2">
				<Icon class="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
				<dt class="text-muted-foreground w-20 shrink-0">{f[row.key]}</dt>
				<dd class="min-w-0 flex-1 truncate font-medium">{value(row.key)}</dd>
			</div>
		{/each}
	</dl>

	<div class="border-border border-t px-4 py-4">
		<h3 class="mb-3 text-meta font-semibold tracking-wide uppercase">{labels.journey}</h3>
		<Stepper.Root orientation="vertical" gap="sm">
			{#each JOURNEY as step (step.key)}
				<Stepper.Item state={step.state}>
					<Stepper.Indicator />
					<div class="min-w-0">
						<Stepper.Title>{step.title}</Stepper.Title>
						<Stepper.Description>{step.time}</Stepper.Description>
					</div>
				</Stepper.Item>
			{/each}
		</Stepper.Root>
	</div>

	<div class="border-border border-t px-4 py-4">
		<h3 class="mb-3 text-meta font-semibold tracking-wide uppercase">{labels.quickAction}</h3>
		<div class="flex flex-wrap gap-1.5">
			{#each AGENTS as agent (agent.id)}
				<ContextMenu.Root>
						<ContextMenu.Trigger>
							<Button variant={agent.id === assigneeId ? "default" : "secondary"} size="sm" class="min-h-9">
							<AgentOffIcon class="size-3.5" />
							{agent.name}
						</Button>
					</ContextMenu.Trigger>
					<ContextMenu.Content class="w-44">
						<ContextMenu.Group>
							<ContextMenu.GroupHeading>{labels.assign}</ContextMenu.GroupHeading>
							{#each AGENTS as a (a.id)}
								<ContextMenu.Item onclick={() => assignAgent(a.id)}>
									{a.name}
									<ContextMenu.Shortcut>{a.status}</ContextMenu.Shortcut>
								</ContextMenu.Item>
							{/each}
						</ContextMenu.Group>
					</ContextMenu.Content>
				</ContextMenu.Root>
			{/each}
		</div>
	</div>

	<div class="border-border mt-auto border-t px-4 py-4">
		<div class="flex items-start gap-2.5">
			<Checkbox id="escalate" bind:checked={escalated} class="mt-0.5" />
			<div class="min-w-0">
				<label for="escalate" class="text-sm font-medium">{labels.escalate}</label>
				<p class="text-muted-foreground mt-0.5 text-meta leading-relaxed">{labels.escalateDesc}</p>
			</div>
		</div>
	</div>

	{#if actionMessage}
		<p class="bg-success-50 text-success-900 border-success-200 border-b px-4 py-1.5 text-meta" role="status">
			{actionMessage}
		</p>
	{/if}
</aside>
