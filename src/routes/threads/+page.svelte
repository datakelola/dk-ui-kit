<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as ScrollArea from '$lib/components/ui/scroll-area';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Message from '$lib/components/ui/message';
	import * as Bubble from '$lib/components/ui/bubble';
	import { Separator } from '$lib/components/ui/separator';
	import * as Empty from '$lib/components/ui/empty';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import DateRangePicker from '$lib/components/ui/date-range-picker.svelte';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import Search from '@lucide/svelte/icons/search';
import Filter from '@lucide/svelte/icons/filter';
	import type { DateRange } from 'bits-ui';
	import { locale } from '$lib/i18n';

	const STR = {
		id: {
			title: 'Threads — DK UI Kit',
			filters: 'Filters',
			searchPh: 'Search Phone, User or Agent…',
			rangeLabel: 'Pilih rentang tanggal thread',
			clear: 'Clear',
			search: 'Search',
			filter: 'Filter',
			channelH: 'Kanal',
			all: 'Semua',
			tabList: 'Thread List',
			tabTimeline: 'Timeline',
			emptyTitle: 'Tidak ada thread',
			emptyDesc: 'Coba ubah filter pencarian.',
			messages: 'pesan',
			open: 'Buka',
			openTip: 'Lihat timeline thread',
			detail: 'Detail',
			threadPrefix: 'Thread #',
			timelineDesc: 'Timeline vertikal meniru threads.',
			found: 'Ditemukan',
			threadUnit: 'thread',
			filterPrefix: 'Filter',
			toastOpened: 'Thread dibuka'
		},
		en: {
			title: 'Threads — DK UI Kit',
			filters: 'Filters',
			searchPh: 'Search Phone, User or Agent…',
			rangeLabel: 'Select thread date range',
			clear: 'Clear',
			search: 'Search',
			filter: 'Filter',
			channelH: 'Channel',
			all: 'All',
			tabList: 'Thread List',
			tabTimeline: 'Timeline',
			emptyTitle: 'No threads',
			emptyDesc: 'Try changing the search filter.',
			messages: 'messages',
			open: 'Open',
			openTip: 'View thread timeline',
			detail: 'Details',
			threadPrefix: 'Thread #',
			timelineDesc: 'Vertical timeline mimicking threads.',
			found: 'Found',
			threadUnit: 'threads',
			filterPrefix: 'Filter',
			toastOpened: 'Thread opened'
		},
		th: {
			title: 'Threads — DK UI Kit',
			filters: 'ตัวกรอง',
			searchPh: 'ค้นหาโทรศัพท์ ผู้ใช้ หรือเจ้าหน้าที่…',
			rangeLabel: 'เลือกช่วงวันที่ของเธรด',
			clear: 'ล้าง',
			search: 'ค้นหา',
			filter: 'กรอง',
			channelH: 'ช่องทาง',
			all: 'ทั้งหมด',
			tabList: 'รายการเธรด',
			tabTimeline: 'ไทม์ไลน์',
			emptyTitle: 'ไม่มีเธรด',
			emptyDesc: 'ลองเปลี่ยนตัวกรองการค้นหา',
			messages: 'ข้อความ',
			open: 'เปิด',
			openTip: 'ดูไทม์ไลน์เธรด',
			detail: 'รายละเอียด',
			threadPrefix: 'เธรด #',
			timelineDesc: 'ไทม์ไลน์แนวตั้งตามแบบ threads',
			found: 'พบ',
			threadUnit: 'เธรด',
			filterPrefix: 'ตัวกรอง',
			toastOpened: 'เปิดเธรดแล้ว'
		},
		tl: {
			title: 'Threads — DK UI Kit',
			filters: 'Mga Filter',
			searchPh: 'Maghanap ng Phone, User o Agent…',
			rangeLabel: 'Piliin ang saklaw ng petsa ng thread',
			clear: 'I-clear',
			search: 'Maghanap',
			filter: 'I-filter',
			channelH: 'Channel',
			all: 'Lahat',
			tabList: 'Listahan ng Thread',
			tabTimeline: 'Timeline',
			emptyTitle: 'Walang thread',
			emptyDesc: 'Subukang baguhin ang filter ng paghahanap.',
			messages: 'mensahe',
			open: 'Buksan',
			openTip: 'Tingnan ang timeline ng thread',
			detail: 'Detalye',
			threadPrefix: 'Thread #',
			timelineDesc: 'Vertical timeline gaya ng threads.',
			found: 'Nakakita ng',
			threadUnit: 'thread',
			filterPrefix: 'Filter',
			toastOpened: 'Binuksan ang thread'
		}
	} as const;
	let s = $derived(STR[$locale]);

	let rows = $state<{ id: string; user: string; agent: string; channel: string; preview: string; date: string; count: number }[]>([
		{ id: 'th-001', user: 'Rina Wijaya', agent: 'Budi', channel: 'WhatsApp', preview: 'Halo, paket saya belum sampai', date: '2026-09-30', count: 4 },
		{ id: 'th-002', user: 'Andi Pratama', agent: 'Sari', channel: 'Email', preview: 'Minta invoice bulan September', date: '2026-09-29', count: 2 },
		{ id: 'th-003', user: 'Dewi Lestari', agent: 'Budi', channel: 'WhatsApp', preview: 'Cara reset password akun?', date: '2026-09-28', count: 6 }
	]);
	async function loadRows() {
		try {
			const [convs, contactList] = await Promise.all([
				api.conversations(undefined, 50),
				api.contacts().catch(() => [] as any[])
			]);
			if ((convs as any[]).length) {
				const names = new Map((contactList as any[]).map((c: any) => [c.id, c.full_name]));
				rows = (convs as any[]).map((c: any, i: number) => ({
					id: c.id,
					user: (c.contact_id && names.get(c.contact_id)) || 'Tanpa kontak',
					agent: '—',
					channel: 'WhatsApp',
					preview: `status ${c.status}`,
					date: (c.last_message_at ?? c.created_at ?? '').slice(0, 10),
					count: 0,
					_num: i + 1
				}));
			}
		} catch {
			/* backend mati — tampilkan data bawaan agar UI bisa dicek */
		}
	}
	onMount(loadRows);
	let q = $state('');
	let loading = $state(false);
	let range = $state<DateRange | undefined>(undefined);
	let channelFilter = $state('all');
	function inRange(dateStr: string) {
		if (!range?.start || !range?.end || !dateStr) return true;
		try {
			const d = dateStr.slice(0, 10);
			const s = range.start.toString().slice(0, 10);
			const e = range.end.toString().slice(0, 10);
			return d >= s && d <= e;
		} catch { return true; }
	}
	let filtered = $derived(rows.filter((r) => (!q || r.user.toLowerCase().includes(q.toLowerCase()) || r.id.toLowerCase().includes(q.toLowerCase())) && (channelFilter === 'all' || r.channel.toLowerCase() === channelFilter) && inRange(r.date)));
	const initials = (n: string) => n.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
	function search() { loading = true; setTimeout(() => { loading = false; toast.success(`${s.found} ${filtered.length} ${s.threadUnit}`); }, 300); }
</script>

<svelte:head><title>{s.title}</title></svelte:head>

<div class="flex flex-col gap-3">
	<Card.Root>
		<Card.Header class="flex flex-row flex-wrap items-center gap-2">
			<strong class="shrink-0 text-sm">{s.filters}</strong>
			<div class="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center md:flex-row">
				<InputGroup.Root class="w-full min-w-0 max-w-full sm:max-w-md"><InputGroup.Addon><Search class="size-4" /></InputGroup.Addon><InputGroup.Input bind:value={q} placeholder={s.searchPh} class="min-w-0" /></InputGroup.Root>
				<DateRangePicker bind:value={range} label={s.rangeLabel} class="w-full min-w-0 max-w-full sm:max-w-xs" />
			</div>
			<Button variant="outline" size="sm" onclick={() => { q = ''; range = undefined; channelFilter = 'all'; }}>{s.clear}</Button>
			<Button size="sm" onclick={search}>{s.search}</Button>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>{#snippet child({ props })}<Button size="sm" variant="outline" {...props}><Filter class="size-4" /> {s.filter}</Button>{/snippet}</DropdownMenu.Trigger>
				<DropdownMenu.Content><DropdownMenu.Group><DropdownMenu.GroupHeading>{s.channelH}</DropdownMenu.GroupHeading><DropdownMenu.Item onclick={() => (channelFilter = 'all')}>{s.all}</DropdownMenu.Item><DropdownMenu.Item onclick={() => (channelFilter = 'whatsapp')}>Chat</DropdownMenu.Item><DropdownMenu.Item onclick={() => (channelFilter = 'email')}>Email</DropdownMenu.Item><DropdownMenu.Item onclick={() => (channelFilter = 'inbound')}>Inbound</DropdownMenu.Item></DropdownMenu.Group></DropdownMenu.Content>
			</DropdownMenu.Root>
		</Card.Header>
	</Card.Root>

	<Tabs.Root value="list" class="min-w-0">
		<Tabs.List class="max-w-full overflow-x-auto [&>*]:whitespace-nowrap"><Tabs.Trigger value="list">{s.tabList}</Tabs.Trigger><Tabs.Trigger value="timeline">{s.tabTimeline}</Tabs.Trigger></Tabs.List>
		<Tabs.Content value="list">
			<Card.Root>
				<ScrollArea.Root class="h-[55vh]">
					{#if loading}<div class="flex flex-col gap-2 p-4"><Skeleton class="h-14 w-full" /><Skeleton class="h-14 w-full" /></div>
					{:else if filtered.length === 0}<Empty.Root><Empty.Header><Empty.Title>{s.emptyTitle}</Empty.Title><Empty.Description>{s.emptyDesc}</Empty.Description></Empty.Header></Empty.Root>
					{:else}
						<div class="flex flex-col gap-2 p-3">
							{#each filtered as r (r.id)}
								<div class="flex min-w-0 flex-wrap items-center gap-3 rounded-lg border p-3">
									<Avatar.Root class="shrink-0"><Avatar.Fallback>{initials(r.user)}</Avatar.Fallback></Avatar.Root>
									<span class="min-w-0 flex-1 basis-40"><span class="flex flex-wrap items-center gap-2"><strong class="min-w-0 truncate text-sm">{r.user}</strong><Badge variant="outline" class="shrink-0 text-[10px]">{r.channel}</Badge><Badge variant="secondary" class="shrink-0">{r.count} {s.messages}</Badge></span>
									<span class="block truncate text-xs text-muted-foreground">{r.preview} • {r.agent} • {r.date}</span></span>
									<Tooltip.Provider><Tooltip.Root><Tooltip.Trigger>{#snippet child({ props })}<Button size="sm" variant="outline" {...props} onclick={() => goto(`/chat/v3?thread=${r.id}`)}>{s.open}</Button>{/snippet}</Tooltip.Trigger><Tooltip.Content>{s.openTip}</Tooltip.Content></Tooltip.Root></Tooltip.Provider>
									<Dialog.Root>
										<Dialog.Trigger>{#snippet child({ props })}<Button size="sm" {...props}>{s.detail}</Button>{/snippet}</Dialog.Trigger>
										<Dialog.Content class="max-w-[calc(100vw-2rem)]"><Dialog.Header><Dialog.Title class="truncate">{s.threadPrefix}{r.id} — {r.user}</Dialog.Title></Dialog.Header>
											<Message.Group>
												<Message.Root><div class="flex flex-col gap-1"><Message.Header>{r.user}</Message.Header><Bubble.Root variant="received"><Bubble.Content>{r.preview}</Bubble.Content></Bubble.Root><Message.Footer>{r.date}</Message.Footer></div></Message.Root>
											</Message.Group>
											<Separator class="my-2" />
											<p class="text-xs text-muted-foreground">{s.timelineDesc}</p>
										</Dialog.Content>
									</Dialog.Root>
								</div>
							{/each}
						</div>
					{/if}
				</ScrollArea.Root>
			</Card.Root>
		</Tabs.Content>
		<Tabs.Content value="timeline">
			<Card.Root><Card.Content class="flex min-w-0 flex-col gap-2 p-4">
				{#each filtered as r (r.id)}<div class="flex min-w-0 flex-wrap items-center gap-3"><span class="h-8 w-1 shrink-0 rounded bg-primary"></span><Avatar.Root class="shrink-0"><Avatar.Fallback>{initials(r.user)}</Avatar.Fallback></Avatar.Root><span class="min-w-0 flex-1 truncate text-sm">{r.user} — {r.preview}</span><Badge variant="outline" class="shrink-0">{r.date}</Badge></div><Separator />{/each}
			</Card.Content></Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>
