<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Pagination from '$lib/components/ui/pagination';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Empty from '$lib/components/ui/empty';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		Search,
		Users,
		ChevronDown,
		ChevronUp,
		ChevronsUpDown,
		MoreHorizontal,
		CircleCheck,
		CircleAlert,
		CircleDashed,
		ChevronLeft,
		ChevronRight,
		X
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { locale } from '$lib/i18n';

	type MockUser = {
		id: string;
		name: string;
		email: string;
		role: string;
		status: string;
		team: string;
		createdAt: string;
	};
	type Meta = {
		page: number;
		pageSize: number;
		total: number;
		totalPages: number;
		sort: string;
		order: 'asc' | 'desc';
	};
	type SortKey = 'name' | 'email' | 'role' | 'status' | 'team' | 'createdAt';

	const STR = {
		id: {
			docTitle: 'User Management — DK UI Kit',
			pageT: 'User Management', pageD: 'Kelola user, peran, dan status akses tim.',
			search: 'Cari user', searchPh: 'Cari nama, email, atau tim…',
			allRoles: 'Semua peran', allStatus: 'Semua status',
			colName: 'Nama', colEmail: 'Email', colRole: 'Peran', colTeam: 'Tim', colStatus: 'Status', colCreated: 'Dibuat',
			rows: 'pengguna', of: 'dari',
			prev: 'Sebelumnya', next: 'Berikutnya',
			roleAdmin: 'Admin', roleSupervisor: 'Supervisor', roleAgent: 'Agent',
			statusActive: 'Aktif', statusInvited: 'Diundang', statusSuspended: 'Ditangguhkan',
			emptyT: 'Tidak ada user', emptyD: 'Tidak ada user yang cocok dengan filter saat ini.',
			reset: 'Reset filter', loadErr: 'Gagal memuat data user.', retry: 'Coba lagi',
			viewD: 'Lihat detail', suspend: 'Tangguhkan', activate: 'Aktifkan', copied: 'ID disalin'
		},
		en: {
			docTitle: 'User Management — DK UI Kit',
			pageT: 'User Management', pageD: 'Manage users, roles, and team access status.',
			search: 'Search users', searchPh: 'Search name, email, or team…',
			allRoles: 'All roles', allStatus: 'All statuses',
			colName: 'Name', colEmail: 'Email', colRole: 'Role', colTeam: 'Team', colStatus: 'Status', colCreated: 'Created',
			rows: 'users', of: 'of',
			prev: 'Previous', next: 'Next',
			roleAdmin: 'Admin', roleSupervisor: 'Supervisor', roleAgent: 'Agent',
			statusActive: 'Active', statusInvited: 'Invited', statusSuspended: 'Suspended',
			emptyT: 'No users found', emptyD: 'No users match the current filters.',
			reset: 'Reset filters', loadErr: 'Failed to load users.', retry: 'Retry',
			viewD: 'View detail', suspend: 'Suspend', activate: 'Activate', copied: 'ID copied'
		},
		th: {
			docTitle: 'จัดการผู้ใช้ — DK UI Kit',
			pageT: 'จัดการผู้ใช้', pageD: 'จัดการผู้ใช้ บทบาท และสถานะการเข้าถึงของทีม',
			search: 'ค้นหาผู้ใช้', searchPh: 'ค้นหาชื่อ อีเมล หรือทีม…',
			allRoles: 'ทุกบทบาท', allStatus: 'ทุกสถานะ',
			colName: 'ชื่อ', colEmail: 'อีเมล', colRole: 'บทบาท', colTeam: 'ทีม', colStatus: 'สถานะ', colCreated: 'สร้างเมื่อ',
			rows: 'ผู้ใช้', of: 'จาก',
			prev: 'ก่อนหน้า', next: 'ถัดไป',
			roleAdmin: 'ผู้ดูแล', roleSupervisor: 'หัวหน้า', roleAgent: 'เอเจนต์',
			statusActive: 'ใช้งาน', statusInvited: 'เชิญแล้ว', statusSuspended: 'ระงับ',
			emptyT: 'ไม่พบผู้ใช้', emptyD: 'ไม่มีผู้ใช้ที่ตรงกับตัวกรองปัจจุบัน',
			reset: 'ล้างตัวกรอง', loadErr: 'โหลดข้อมูลผู้ใช้ไม่สำเร็จ', retry: 'ลองอีกครั้ง',
			viewD: 'ดูรายละเอียด', suspend: 'ระงับ', activate: 'เปิดใช้งาน', copied: 'คัดลอก ID แล้ว'
		},
		tl: {
			docTitle: 'Pamamahala ng User — DK UI Kit',
			pageT: 'Pamamahala ng User', pageD: 'Pamahalaan ang user, tungkulin, at status ng access ng tim.',
			search: 'Maghanap ng user', searchPh: 'Maghanap ng pangalan, email, o tim…',
			allRoles: 'Lahat ng tungkulin', allStatus: 'Lahat ng status',
			colName: 'Pangalan', colEmail: 'Email', colRole: 'Tungkulin', colTeam: 'Tim', colStatus: 'Status', colCreated: 'Nilikha',
			rows: 'user', of: 'sa',
			prev: 'Nakaraan', next: 'Susunod',
			roleAdmin: 'Admin', roleSupervisor: 'Supervisor', roleAgent: 'Agent',
			statusActive: 'Aktibo', statusInvited: 'Naimbitahan', statusSuspended: 'Nakabitin',
			emptyT: 'Walang nahanap na user', emptyD: 'Walang user na tumutugma sa kasalukuyang filter.',
			reset: 'I-reset ang filter', loadErr: 'Nabigo ang pag-load ng mga user.', retry: 'Subukan muli',
			viewD: 'Tingnan ang detalye', suspend: 'Bitinin', activate: 'I-activate', copied: 'Nakopya ang ID'
		}
	} as const;
	let s = $derived(STR[$locale]);

	const ROLES = ['admin', 'supervisor', 'agent'] as const;
	const STATUSES = ['active', 'invited', 'suspended'] as const;
	const SORTABLE: SortKey[] = ['name', 'email', 'role', 'status', 'team', 'createdAt'];

	let users = $state<MockUser[]>([]);
	let meta = $state<Meta>({ page: 1, pageSize: 10, total: 0, totalPages: 1, sort: 'name', order: 'asc' });
	let loading = $state(true);
	let failed = $state(false);

	let search = $state('');
	let searchDebounced = $state('');
	let role = $state<string | null>(null);
	let status = $state<string | null>(null);

	let urlSearch = $derived(page.url.searchParams.get('q') ?? '');
	let urlRole = $derived(page.url.searchParams.get('role'));
	let urlStatus = $derived(page.url.searchParams.get('status'));
	let urlSort = $derived(page.url.searchParams.get('sort') ?? 'name');
	let urlOrder = $derived(page.url.searchParams.get('order') === 'desc' ? 'desc' : 'asc');
	let urlPage = $derived(Number(page.url.searchParams.get('page')) || 1);

	$effect(() => {
		search = urlSearch;
		searchDebounced = urlSearch;
		role = urlRole;
		status = urlStatus;
	});

	$effect(() => {
		const q = searchDebounced.trim();
		const t = setTimeout(() => {
			if (q !== urlSearch) pushQuery({ q, page: 1 });
		}, 350);
		return () => clearTimeout(t);
	});

	function pushQuery(patch: Record<string, string | number | null>) {
		const url = new URL(page.url);
		for (const [k, v] of Object.entries(patch)) {
			if (v === null || v === '' || (k === 'page' && v === 1)) url.searchParams.delete(k);
			else url.searchParams.set(k, String(v));
		}
		goto(`${url.pathname}${url.search}`, { keepFocus: true, noScroll: true });
	}

	async function load() {
		loading = true;
		failed = false;
		try {
			const p = new URLSearchParams();
			if (urlSearch.trim()) p.set('search', urlSearch.trim());
			if (urlRole) p.set('role', urlRole);
			if (urlStatus) p.set('status', urlStatus);
			if (SORTABLE.includes(urlSort as SortKey)) p.set('sort', urlSort);
			p.set('order', urlOrder);
			p.set('page', String(urlPage));
			p.set('pageSize', '10');
			const res = await fetch(`/api/mock/users?${p.toString()}`);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const body = await res.json();
			users = body.data;
			meta = body.meta;
		} catch {
			failed = true;
			users = [];
		} finally {
			loading = false;
		}
	}
	$effect(() => {
		void urlSearch;
		void urlRole;
		void urlStatus;
		void urlSort;
		void urlOrder;
		void urlPage;
		load();
	});

	function toggleSort(key: SortKey) {
		const nextOrder = urlSort === key && urlOrder === 'asc' ? 'desc' : 'asc';
		pushQuery({ sort: key, order: nextOrder, page: 1 });
	}

	const roleLabel = $derived({ admin: s.roleAdmin, supervisor: s.roleSupervisor, agent: s.roleAgent });
	const statusLabel = $derived({ active: s.statusActive, invited: s.statusInvited, suspended: s.statusSuspended });
	const roleVariant: Record<string, 'default' | 'secondary' | 'outline'> = { admin: 'default', supervisor: 'secondary', agent: 'outline' };
	const statusVariant: Record<string, 'success' | 'warning' | 'destructive'> = { active: 'success', invited: 'warning', suspended: 'destructive' };

	function initials(name: string) {
		return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
	}
	function fmtDate(d: string) {
		return new Date(d).toLocaleDateString($locale === 'th' ? 'th-TH' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
	}
	const hasFilters = $derived(!!urlSearch.trim() || !!urlRole || !!urlStatus);

	const statusIcon = { active: CircleCheck, invited: CircleAlert, suspended: CircleDashed } as const;
</script>

<svelte:head><title>{s.docTitle}</title></svelte:head>

<div class="flex flex-col gap-4">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<div class="min-w-0">
			<h2 class="text-lg font-semibold tracking-tight">{s.pageT}</h2>
			<p class="text-sm text-muted-foreground">{s.pageD}</p>
		</div>
		<span class="text-meta text-muted-foreground">{meta.total} {s.rows}</span>
	</div>

	<div class="flex flex-wrap items-center gap-2">
		<div class="relative min-w-0 flex-1 sm:max-w-xs">
			<Search size={15} class="absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground" />
			<Input bind:value={search} placeholder={s.searchPh} class="pl-8" />
		</div>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" class="justify-between" {...props}>
						{urlRole ? roleLabel[urlRole as keyof typeof roleLabel] : s.allRoles}
						<ChevronDown data-icon="inline-end" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="start">
				<DropdownMenu.Item onclick={() => pushQuery({ role: null, page: 1 })}>{s.allRoles}</DropdownMenu.Item>
				{#each ROLES as r (r)}
					<DropdownMenu.Item onclick={() => pushQuery({ role: r, page: 1 })}>{roleLabel[r]}</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" class="justify-between" {...props}>
						{urlStatus ? statusLabel[urlStatus as keyof typeof statusLabel] : s.allStatus}
						<ChevronDown data-icon="inline-end" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="start">
				<DropdownMenu.Item onclick={() => pushQuery({ status: null, page: 1 })}>{s.allStatus}</DropdownMenu.Item>
				{#each STATUSES as st (st)}
					<DropdownMenu.Item onclick={() => pushQuery({ status: st, page: 1 })}>{statusLabel[st]}</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		{#if hasFilters}
			<Button variant="ghost" size="icon-sm" onclick={() => pushQuery({ q: null, role: null, status: null, page: 1 })} aria-label={s.reset}>
				<X />
			</Button>
		{/if}
	</div>

	{#if loading}
		<div class="space-y-2 rounded-lg border">
			{#each Array(6) as _, i (i)}
				<div class="flex items-center gap-3 p-3.5">
					<Skeleton class="size-9 rounded-full" />
					<Skeleton class="h-4 w-[35%]" />
					<Skeleton class="h-4 w-[15%]" />
					<Skeleton class="h-5 w-16" />
				</div>
			{/each}
		</div>
	{:else if failed}
		<Empty.Root class="border border-dashed">
			<Empty.Header>
				<Empty.Media><Users size={20} /></Empty.Media>
				<Empty.Title>{s.loadErr}</Empty.Title>
				<Empty.Description><Button variant="outline" size="sm" onclick={load}>{s.retry}</Button></Empty.Description>
			</Empty.Header>
		</Empty.Root>
	{:else if users.length === 0}
		<Empty.Root class="border border-dashed">
			<Empty.Header>
				<Empty.Media><Search size={20} /></Empty.Media>
				<Empty.Title>{s.emptyT}</Empty.Title>
				<Empty.Description>{s.emptyD}</Empty.Description>
			</Empty.Header>
			{#if hasFilters}
				<Empty.Content><Button variant="outline" size="sm" onclick={() => pushQuery({ q: null, role: null, status: null, page: 1 })}>{s.reset}</Button></Empty.Content>
			{/if}
		</Empty.Root>
	{:else}
		<div class="rounded-lg border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>
							<button type="button" class="flex items-center gap-1 hover:text-foreground" onclick={() => toggleSort('name')}>
								{s.colName}
								{#if urlSort === 'name'}
									{#if urlOrder === 'asc'}<ChevronUp size={14} />{:else}<ChevronDown size={14} />{/if}
								{:else}
									<ChevronsUpDown size={14} class="opacity-40" />
								{/if}
							</button>
						</Table.Head>
						<Table.Head>
							<button type="button" class="flex items-center gap-1 hover:text-foreground" onclick={() => toggleSort('email')}>
								{s.colEmail}
								{#if urlSort === 'email'}
									{#if urlOrder === 'asc'}<ChevronUp size={14} />{:else}<ChevronDown size={14} />{/if}
								{:else}
									<ChevronsUpDown size={14} class="opacity-40" />
								{/if}
							</button>
						</Table.Head>
						<Table.Head>
							<button type="button" class="flex items-center gap-1 hover:text-foreground" onclick={() => toggleSort('role')}>
								{s.colRole}
								{#if urlSort === 'role'}
									{#if urlOrder === 'asc'}<ChevronUp size={14} />{:else}<ChevronDown size={14} />{/if}
								{:else}
									<ChevronsUpDown size={14} class="opacity-40" />
								{/if}
							</button>
						</Table.Head>
						<Table.Head>{s.colTeam}</Table.Head>
						<Table.Head>
							<button type="button" class="flex items-center gap-1 hover:text-foreground" onclick={() => toggleSort('status')}>
								{s.colStatus}
								{#if urlSort === 'status'}
									{#if urlOrder === 'asc'}<ChevronUp size={14} />{:else}<ChevronDown size={14} />{/if}
								{:else}
									<ChevronsUpDown size={14} class="opacity-40" />
								{/if}
							</button>
						</Table.Head>
						<Table.Head>
							<button type="button" class="flex items-center gap-1 hover:text-foreground" onclick={() => toggleSort('createdAt')}>
								{s.colCreated}
								{#if urlSort === 'createdAt'}
									{#if urlOrder === 'asc'}<ChevronUp size={14} />{:else}<ChevronDown size={14} />{/if}
								{:else}
									<ChevronsUpDown size={14} class="opacity-40" />
								{/if}
							</button>
						</Table.Head>
						<Table.Head class="w-10"><span class="sr-only">actions</span></Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each users as u (u.id)}
						<Table.Row>
							<Table.Cell>
								<div class="flex items-center gap-2.5">
									<Avatar.Root class="size-8"><Avatar.Fallback class="text-meta">{initials(u.name)}</Avatar.Fallback></Avatar.Root>
									<span class="font-medium">{u.name}</span>
								</div>
							</Table.Cell>
							<Table.Cell class="text-muted-foreground">{u.email}</Table.Cell>
							<Table.Cell><Badge variant={roleVariant[u.role] ?? 'outline'}>{roleLabel[u.role as keyof typeof roleLabel] ?? u.role}</Badge></Table.Cell>
							<Table.Cell class="text-muted-foreground">{u.team}</Table.Cell>
							<Table.Cell>
								{@const SIcon = statusIcon[u.status as keyof typeof statusIcon] ?? CircleDashed}
								<Badge variant={statusVariant[u.status] ?? 'outline'}><SIcon />{statusLabel[u.status as keyof typeof statusLabel] ?? u.status}</Badge>
							</Table.Cell>
							<Table.Cell class="text-muted-foreground whitespace-nowrap">{fmtDate(u.createdAt)}</Table.Cell>
							<Table.Cell>
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										{#snippet child({ props })}
											<Button variant="ghost" size="icon-sm" {...props} aria-label={u.name}>
												<MoreHorizontal />
											</Button>
										{/snippet}
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="end">
										<DropdownMenu.Item onclick={() => navigator.clipboard?.writeText(u.id).then(() => toast.success(s.copied))}>{u.id}</DropdownMenu.Item>
										<DropdownMenu.Item disabled={u.status !== 'active'} onclick={() => toast.success(`${s.suspend}: ${u.name}`)}>{s.suspend}</DropdownMenu.Item>
										<DropdownMenu.Item disabled={u.status === 'active'} onclick={() => toast.success(`${s.activate}: ${u.name}`)}>{s.activate}</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>

		<div class="mt-1 flex flex-wrap items-center justify-between gap-3">
			<p class="order-2 w-full text-meta text-muted-foreground sm:order-1 sm:w-auto">
				{(meta.page - 1) * meta.pageSize + 1}–{Math.min(meta.page * meta.pageSize, meta.total)} {s.of} {meta.total} {s.rows}
			</p>
			<div class="order-1 ml-auto sm:order-2">
				<Pagination.Root
					page={urlPage}
					count={meta.total}
					perPage={meta.pageSize}
					siblingCount={1}
					onPageChange={(p) => pushQuery({ page: p })}
				>
					{#snippet children({ pages })}
						<Pagination.Content class="flex-nowrap gap-1">
							<Pagination.Item>
								<Pagination.Previous class="h-11 gap-1.5 rounded-lg px-3">
									<ChevronLeft data-icon="inline-start" class="cn-rtl-flip" />
									{s.prev}
								</Pagination.Previous>
							</Pagination.Item>
							{#each pages as p (p.key)}
								{#if p.type === 'ellipsis'}
									<Pagination.Item><Pagination.Ellipsis class="size-11 rounded-lg" /></Pagination.Item>
								{:else}
									<Pagination.Item><Pagination.Link page={p} size="default" class="rounded-lg" isActive={meta.page === p.value}>{p.value}</Pagination.Link></Pagination.Item>
								{/if}
							{/each}
							<Pagination.Item>
								<Pagination.Next class="h-11 gap-1.5 rounded-lg px-3">
									{s.next}
									<ChevronRight data-icon="inline-end" class="cn-rtl-flip" />
								</Pagination.Next>
							</Pagination.Item>
						</Pagination.Content>
					{/snippet}
				</Pagination.Root>
			</div>
		</div>
	{/if}
</div>
