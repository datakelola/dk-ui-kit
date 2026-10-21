<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as ScrollArea from '$lib/components/ui/scroll-area';
	import * as Resizable from '$lib/components/ui/resizable';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Message from '$lib/components/ui/message';
	import * as Bubble from '$lib/components/ui/bubble';
	import { Separator } from '$lib/components/ui/separator';
	import * as Empty from '$lib/components/ui/empty';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import { cn } from '$lib/utils';
	import { Search, MoreVertical, Ticket } from 'lucide-svelte';
	import { locale } from '$lib/i18n';

	const STR = {
		id: {
			title: 'Ticketing — DK UI Kit',
			tabOpen: 'Open',
			tabPending: 'Pending',
			tabResolved: 'Resolved',
			searchPh: 'Cari tiket…',
			statusH: 'Status',
			assign: 'Assign',
			assignTip: 'Assign ke agen',
			timeline: 'Timeline',
			timelineTitle: 'Timeline Tiket',
			timelineSteps: 'Dibuat • Diproses • Escalated • Selesai',
			timelineDesc: 'Meniru status-card & timeline blade ticketing.',
			closeTicket: 'Close Ticket',
			closeTitle: 'Tutup tiket',
			closeBtn: 'Tutup',
			replyPh: 'Balas tiket…',
			send: 'Kirim',
			toastClosed: 'Tiket ditutup',
			toastReplied: 'Balasan terkirim',
			msgFollowup: 'mohon bantuan follow-up.',
			msgProcPrefix: 'Baik kak, tiket',
			msgProcSuffix: 'sedang kami proses.',
			agentNow: 'Agent • now',
			stOpen: 'open',
			stPending: 'pending',
			stResolved: 'resolved'
		},
		en: {
			title: 'Ticketing — DK UI Kit',
			tabOpen: 'Open',
			tabPending: 'Pending',
			tabResolved: 'Resolved',
			searchPh: 'Search tickets…',
			statusH: 'Status',
			assign: 'Assign',
			assignTip: 'Assign to an agent',
			timeline: 'Timeline',
			timelineTitle: 'Ticket Timeline',
			timelineSteps: 'Created • In progress • Escalated • Done',
			timelineDesc: 'Mimics the ticketing blade status-card & timeline.',
			closeTicket: 'Close Ticket',
			closeTitle: 'Close ticket',
			closeBtn: 'Close',
			replyPh: 'Reply to ticket…',
			send: 'Send',
			toastClosed: 'Ticket closed',
			toastReplied: 'Reply sent',
			msgFollowup: 'please help to follow up.',
			msgProcPrefix: 'Hi, ticket',
			msgProcSuffix: 'is being processed.',
			agentNow: 'Agent • now',
			stOpen: 'open',
			stPending: 'pending',
			stResolved: 'resolved'
		},
		th: {
			title: 'Ticketing — DK UI Kit',
			tabOpen: 'เปิด',
			tabPending: 'รอดำเนินการ',
			tabResolved: 'แก้ไขแล้ว',
			searchPh: 'ค้นหาตั๋ว…',
			statusH: 'สถานะ',
			assign: 'มอบหมาย',
			assignTip: 'มอบหมายให้เจ้าหน้าที่',
			timeline: 'ไทม์ไลน์',
			timelineTitle: 'ไทม์ไลน์ตั๋ว',
			timelineSteps: 'สร้างแล้ว • กำลังดำเนินการ • ส่งต่อ • เสร็จสิ้น',
			timelineDesc: 'เลียนแบบ status-card และไทม์ไลน์ของ ticketing blade',
			closeTicket: 'ปิดตั๋ว',
			closeTitle: 'ปิดตั๋ว',
			closeBtn: 'ปิด',
			replyPh: 'ตอบกลับตั๋ว…',
			send: 'ส่ง',
			toastClosed: 'ปิดตั๋วแล้ว',
			toastReplied: 'ส่งคำตอบแล้ว',
			msgFollowup: 'โปรดช่วยติดตามงาน',
			msgProcPrefix: 'สวัสดี ตั๋ว',
			msgProcSuffix: 'กำลังดำเนินการ',
			agentNow: 'เจ้าหน้าที่ • ขณะนี้',
			stOpen: 'เปิด',
			stPending: 'รอดำเนินการ',
			stResolved: 'แก้ไขแล้ว'
		},
		tl: {
			title: 'Ticketing — DK UI Kit',
			tabOpen: 'Bukas',
			tabPending: 'Nakabinbin',
			tabResolved: 'Nalutas',
			searchPh: 'Maghanap ng ticket…',
			statusH: 'Katayuan',
			assign: 'I-assign',
			assignTip: 'I-assign sa agent',
			timeline: 'Timeline',
			timelineTitle: 'Timeline ng Ticket',
			timelineSteps: 'Ginawa • Pinoproseso • Escalated • Tapos',
			timelineDesc: 'Ginagaya ang status-card at timeline ng ticketing blade.',
			closeTicket: 'Isara ang Ticket',
			closeTitle: 'Isara ang ticket',
			closeBtn: 'Isara',
			replyPh: 'Sumagot sa ticket…',
			send: 'Ipadala',
			toastClosed: 'Isinara ang ticket',
			toastReplied: 'Naipadala ang sagot',
			msgFollowup: 'pakisuyo ng follow-up.',
			msgProcPrefix: 'Hello, ang ticket',
			msgProcSuffix: 'ay pinoproseso.',
			agentNow: 'Agent • ngayon',
			stOpen: 'bukas',
			stPending: 'nakabinbin',
			stResolved: 'nalutas'
		}
	} as const;
	let s = $derived(STR[$locale]);

	type TRow = { id: string; number: string; customer: string; subject: string; channel: string; status: string; time: string };
	let tickets = $state<TRow[]>([]);
	let sel = $state<TRow | null>(null);
	let loading = $state(false);
	let reply = $state('');
	let replies = $state<{ id: string; body: string; author_type: string; created_at: string }[]>([]);
	let loadError = $state('');

	async function loadTickets(status?: string) {
		loading = true;
		try {
			const [rows, contactList] = await Promise.all([
				api.tickets(status),
				api.contacts().catch(() => [] as any[])
			]);
			const names = new Map((contactList as any[]).map((c: any) => [c.id, c.full_name]));
			tickets = (rows as any[]).map((t: any) => ({
				id: t.id,
				number: t.number,
				customer: (t.contact_id && names.get(t.contact_id)) || '—',
				subject: t.subject,
				channel: t.source === 'public_form' ? 'Form' : t.source === 'agent' ? 'Agent' : t.source,
				status: t.status,
				time: String(t.created_at ?? '').slice(0, 16).replace('T', ' ')
			}));
			if (!sel || !tickets.some((t) => t.id === sel!.id)) sel = tickets[0] ?? null;
			if (sel) await loadReplies(sel.id);
		} catch (e) {
			loadError = (e as Error).message;
		} finally {
			loading = false;
		}
	}

	async function loadReplies(id: string) {
		try {
			const r = await api.ticketDetail(id);
			replies = r.replies;
		} catch {
			replies = [];
		}
	}

	async function pick(t: TRow) {
		sel = t;
		loading = true;
		await loadReplies(t.id);
		loading = false;
	}

	async function sendReply() {
		if (!sel || !reply.trim()) return;
		const body = reply;
		reply = '';
		try {
			await api.replyTicket(sel.id, body);
			toast.success(s.toastReplied);
			await loadReplies(sel.id);
		} catch (e) {
			toast.error((e as Error).message);
		}
	}

	async function closeTicket() {
		if (!sel) return;
		try {
			await api.updateTicket(sel.id, { status: 'resolved' });
			toast.success(s.toastClosed);
			await loadTickets();
		} catch (e) {
			toast.error((e as Error).message);
		}
	}

	onMount(() => loadTickets());
	const initials = (n: string) => n.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
	const statusLabel = (st: string) => st === 'open' ? s.stOpen : st === 'pending' ? s.stPending : s.stResolved;
	let ticketQuery = $state('');
	let tab = $state('open');
	let visibleTickets = $derived(tickets.filter((t) => !ticketQuery || `${t.id} ${t.number} ${t.subject} ${t.customer}`.toLowerCase().includes(ticketQuery.toLowerCase())));
	function switchTab(v: string) { tab = v; loadTickets(v); }
</script>

<svelte:head><title>{s.title}</title></svelte:head>

<div class="flex flex-col gap-4">
	<Tabs.Root bind:value={tab}>
		<Tabs.List class="max-w-full overflow-x-auto [&>*]:whitespace-nowrap">
			<Tabs.Trigger value="open" onclick={() => switchTab('open')}>{s.tabOpen}</Tabs.Trigger>
			<Tabs.Trigger value="pending" onclick={() => switchTab('pending')}>{s.tabPending}</Tabs.Trigger>
			<Tabs.Trigger value="resolved" onclick={() => switchTab('resolved')}>{s.tabResolved}</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>
	{#if loadError}<p class="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-600">{loadError}</p>{/if}

	<Resizable.PaneGroup direction="horizontal" class="min-h-[70vh] gap-3 max-lg:h-auto max-lg:flex-col">
		<Resizable.Pane defaultSize={32} class="max-lg:min-h-[340px] max-lg:w-full">
			<Card.Root class="flex h-full min-h-0 flex-col">
				<Card.Header class="flex flex-row flex-wrap items-center gap-2">
					<InputGroup.Root class="min-w-0 flex-1"><InputGroup.Addon><Search class="size-4" /></InputGroup.Addon><InputGroup.Input bind:value={ticketQuery} placeholder={s.searchPh} class="min-w-0" /></InputGroup.Root>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}<Button size="icon" variant="outline" {...props}><MoreVertical class="size-4" /></Button>{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Group><DropdownMenu.GroupHeading>{s.statusH}</DropdownMenu.GroupHeading><DropdownMenu.Item onclick={() => switchTab('open')}>{s.tabOpen}</DropdownMenu.Item><DropdownMenu.Item onclick={() => switchTab('pending')}>{s.tabPending}</DropdownMenu.Item><DropdownMenu.Item onclick={() => switchTab('resolved')}>{s.tabResolved}</DropdownMenu.Item></DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Card.Header>
				<Separator />
				<ScrollArea.Root class="h-[55vh]">
					<div class="flex flex-col gap-2 p-3">
						{#each visibleTickets as t (t.id)}
							<button onclick={() => pick(t)} class={cn('flex min-w-0 items-center gap-3 rounded-lg p-3 text-left hover:bg-muted/50', sel?.id === t.id && 'bg-muted')}>
								<Avatar.Root class="shrink-0"><Avatar.Fallback>{initials(t.customer)}</Avatar.Fallback></Avatar.Root>
								<span class="min-w-0 flex-1"><span class="flex flex-wrap items-center gap-2"><Ticket class="size-3 shrink-0" /><strong class="min-w-0 flex-1 truncate text-sm">{t.id}</strong><Badge variant="outline" class="shrink-0">{t.channel}</Badge></span>
								<span class="block truncate text-xs text-muted-foreground">{t.subject}</span></span>
								<Badge variant={t.status === 'open' ? 'default' : t.status === 'pending' ? 'secondary' : 'outline'} class="shrink-0">{statusLabel(t.status)}</Badge>
							</button>
						{/each}
					</div>
				</ScrollArea.Root>
			</Card.Root>
		</Resizable.Pane>
		<Resizable.Handle class="max-lg:hidden" />
		<Resizable.Pane defaultSize={68} class="max-lg:min-h-[480px] max-lg:w-full">
			{#if sel}
			<Card.Root class="flex h-full min-h-0 flex-col">
				<Card.Header class="flex flex-row flex-wrap items-center gap-3">
					<div class="flex min-w-0 flex-1 flex-col gap-0.5"><strong class="truncate text-sm">{sel.number} — {sel.subject}</strong><span class="truncate text-xs text-muted-foreground">{sel.customer} • {sel.channel}</span></div>
					<Tooltip.Provider><Tooltip.Root><Tooltip.Trigger>{#snippet child({ props })}<Button size="sm" variant="outline" {...props} onclick={() => toast.success(`${s.assign}: ${sel.number}`)}>{s.assign}</Button>{/snippet}</Tooltip.Trigger><Tooltip.Content>{s.assignTip}</Tooltip.Content></Tooltip.Root></Tooltip.Provider>
					<Sheet.Root>
						<Sheet.Trigger>{#snippet child({ props })}<Button size="sm" variant="outline" {...props}>{s.timeline}</Button>{/snippet}</Sheet.Trigger>
						<Sheet.Content><Sheet.Header><Sheet.Title>{s.timelineTitle} {sel.id}</Sheet.Title></Sheet.Header><div class="flex flex-col gap-2 p-4 text-sm"><p>{s.timelineSteps}</p><Separator /><p class="text-muted-foreground">{s.timelineDesc}</p></div></Sheet.Content>
					</Sheet.Root>
					<Dialog.Root>
						<Dialog.Trigger>{#snippet child({ props })}<Button size="sm" {...props}>{s.closeTicket}</Button>{/snippet}</Dialog.Trigger>
						<Dialog.Content class="max-w-[calc(100vw-2rem)]"><Dialog.Header><Dialog.Title class="truncate">{s.closeTitle} {sel.number}?</Dialog.Title></Dialog.Header><Dialog.Footer class="flex-wrap"><Button onclick={closeTicket}>{s.closeBtn}</Button></Dialog.Footer></Dialog.Content>
					</Dialog.Root>
				</Card.Header>
				<Separator />
				<ScrollArea.Root class="h-[45vh] p-4">
					{#if loading}<div class="flex flex-col gap-2"><Skeleton class="h-12 w-full" /><Skeleton class="h-12 w-5/6" /></div>
					{:else if !replies.length}<p class="p-4 text-center text-sm text-muted-foreground">Belum ada balasan.</p>
					{:else}
						<Message.Group>
							{#each replies as rp}
								<Message.Root class={rp.author_type === 'agent' ? 'justify-end' : ''}>
									{#if rp.author_type !== 'agent'}<Message.Avatar><Avatar.Root><Avatar.Fallback>{initials(sel.customer)}</Avatar.Fallback></Avatar.Root></Message.Avatar>{/if}
									<div class="flex flex-col gap-1"><Message.Header>{rp.author_type === 'agent' ? s.agentNow : sel.customer}</Message.Header><Bubble.Root variant={rp.author_type === 'agent' ? 'sent' : 'received'}><Bubble.Content>{rp.body}</Bubble.Content></Bubble.Root><Message.Footer>{String(rp.created_at ?? '').slice(0, 16).replace('T', ' ')}</Message.Footer></div>
								</Message.Root>
							{/each}
						</Message.Group>
					{/if}
				</ScrollArea.Root>
				<Card.Footer class="max-w-full">
					<InputGroup.Root class="max-w-full"><InputGroup.Input bind:value={reply} placeholder={s.replyPh} class="min-w-0" /><InputGroup.Button onclick={sendReply}>{s.send}</InputGroup.Button></InputGroup.Root>
				</Card.Footer>
			</Card.Root>
			{:else}
				<div class="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">Pilih tiket untuk melihat detail.</div>
			{/if}
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
