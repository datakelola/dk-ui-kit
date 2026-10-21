<script lang="ts">
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import { darkMode, toggleTheme, initTheme } from "$lib/theme";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import * as Collapsible from "$lib/components/ui/collapsible";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Popover from "$lib/components/ui/popover";
	import * as Avatar from "$lib/components/ui/avatar";
	import * as InputGroup from "$lib/components/ui/input-group";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import { Separator } from "$lib/components/ui/separator";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import { Switch } from "$lib/components/ui/switch";
	import { Toaster } from "$lib/components/ui/sonner";
	import { toast } from "svelte-sonner";
	import { locale, initLocale, setLocale, locales, type Locale } from "$lib/i18n";
	import { get } from "svelte/store";
	import House from '@lucide/svelte/icons/house';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import MessagesSquare from '@lucide/svelte/icons/messages-square';
	import ThreadsIcon from '@lucide/svelte/icons/messages-square';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import MessageSquareMore from '@lucide/svelte/icons/message-square-more';
	import Boxes from '@lucide/svelte/icons/boxes';
	import Users from '@lucide/svelte/icons/users';
	import Component from '@lucide/svelte/icons/component';
	import Ticket from '@lucide/svelte/icons/ticket';
	import TicketCheck from '@lucide/svelte/icons/ticket-check';
	import Star from '@lucide/svelte/icons/star';
	import Mail from '@lucide/svelte/icons/mail';
	import PenSquare from '@lucide/svelte/icons/pen-square';
	import Inbox from '@lucide/svelte/icons/inbox';
	import Send from '@lucide/svelte/icons/send';
	import FileEdit from '@lucide/svelte/icons/file-edit';
	import LayoutTemplate from '@lucide/svelte/icons/layout-template';
	import History from '@lucide/svelte/icons/history';
	import MonitorDot from '@lucide/svelte/icons/monitor-dot';
	import Radio from '@lucide/svelte/icons/radio';
	import PhoneCall from '@lucide/svelte/icons/phone-call';
	import Archive from '@lucide/svelte/icons/archive';
	import Radar from '@lucide/svelte/icons/radar';
	import ChartColumn from '@lucide/svelte/icons/chart-column';
	import Settings from '@lucide/svelte/icons/settings';
	import CalendarClock from '@lucide/svelte/icons/calendar-clock';
	import CalendarDays from '@lucide/svelte/icons/calendar-days';
	import CalendarRange from '@lucide/svelte/icons/calendar-range';
	import Clock from '@lucide/svelte/icons/clock';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import Search from '@lucide/svelte/icons/search';
	import Bell from '@lucide/svelte/icons/bell';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Gauge from '@lucide/svelte/icons/gauge';
	import Trophy from '@lucide/svelte/icons/trophy';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import Tv from '@lucide/svelte/icons/tv';
	import Globe from '@lucide/svelte/icons/globe';
	import "../app.css";

	type Sub = { key: string; to: string; icon: typeof Mail; badge?: number };
	type Parent = { key: string; icon: typeof Mail; subs: Sub[] };
	type Single = { key: string; to: string; icon: typeof Mail; badge?: number };
	type Section = { key: string; labelKey: string; parents: Parent[] };

	const parents: Parent[] = [
		{
			key: "home", icon: House,
			subs: [
				{ key: "overview", to: "/home", icon: LayoutGrid },
				{ key: "agentPerf", to: "/agent/performance", icon: Trophy },
				{ key: "agentProd", to: "/agent-productivity-dashboard", icon: Gauge }
			]
		},
		{
			key: "dashboard", icon: LayoutDashboard,
			subs: [
				{ key: "ticket", to: "/chat/v3/ticket/result", icon: TicketCheck },
				{ key: "threads", to: "/threads", icon: MessagesSquare, badge: 5 },
				{ key: "csat", to: "/report/csat", icon: Star },
				{ key: "wallboard", to: "/wallboard", icon: Tv }
			]
		},
		{
			key: "workspace", icon: Boxes,
			subs: [
				{ key: "omnichat", to: "/chat/v3", icon: MessageSquare, badge: 12 },
				{ key: "omnichatV4", to: "/chat/v4", icon: MessageSquareMore },
				{ key: "ticketing", to: "/ticketing", icon: Ticket, badge: 3 }
			]
		},
		{
			key: "email", icon: Mail,
			subs: [
				{ key: "compose", to: "/email/compose", icon: PenSquare },
				{ key: "inbox", to: "/email", icon: Inbox },
				{ key: "sent", to: "/email/send", icon: Send },
				{ key: "templates", to: "/email/templates", icon: LayoutTemplate },
				{ key: "history", to: "/email/history", icon: History }
			]
		},
		{
			key: "monitoring", icon: MonitorDot,
			subs: [
				{ key: "channel", to: "/spv", icon: Radio },
				{ key: "recording", to: "/recordings", icon: PhoneCall },
				{ key: "archive", to: "/recording-archive", icon: Archive },
				{ key: "kirana", to: "/chat/v3/ticket/kirana-monitoring", icon: Radar }
			]
		},
		{
			key: "scheduling", icon: CalendarClock,
			subs: [
				{ key: "schedule", to: "/agent-schedule", icon: CalendarDays },
				{ key: "workCal", to: "/work-calendar", icon: CalendarRange },
				{ key: "opHours", to: "/operational-hours", icon: Clock }
			]
		}
	];

	const sections: Section[] = [
		{ key: "main", labelKey: "secMain", parents: [parents[0], parents[1]] },
		{ key: "workspace", labelKey: "secWorkspace", parents: [parents[2], parents[3]] },
		{ key: "ops", labelKey: "secOps", parents: [parents[4], parents[5]] }
	];

	const MENU_STR: Record<string, Record<Locale, string>> = {
		home: { id: "Home", en: "Home", th: "หน้าแรก", tl: "Home" },
		overview: { id: "Overview", en: "Overview", th: "ภาพรวม", tl: "Pangkalahatan" },
		agentPerf: { id: "Agent Performance", en: "Agent Performance", th: "ประสิทธิภาพเอเจนต์", tl: "Performance ng Agent" },
		agentProd: { id: "Agent Productivity", en: "Agent Productivity", th: "ผลิตภาพเอเจนต์", tl: "Produktibidad ng Agent" },
		dashboard: { id: "Dashboard", en: "Dashboard", th: "แดชบอร์ด", tl: "Dashboard" },
		ticket: { id: "Ticket", en: "Ticket", th: "ตั๋วงาน", tl: "Ticket" },
		threads: { id: "Threads", en: "Threads", th: "เธรด", tl: "Threads" },
		csat: { id: "CSAT", en: "CSAT", th: "CSAT", tl: "CSAT" },
		wallboard: { id: "Wallboard", en: "Wallboard", th: "วอลล์บอร์ด", tl: "Wallboard" },
		workspace: { id: "Workspace", en: "Workspace", th: "พื้นที่ทำงาน", tl: "Workspace" },
		omnichat: { id: "Omnichat", en: "Omnichat", th: "ออมนิแชต", tl: "Omnichat" },
		omnichatV4: { id: "Omnichat v4", en: "Omnichat v4", th: "ออมนิแชต v4", tl: "Omnichat v4" },
		ticketing: { id: "Ticketing", en: "Ticketing", th: "ตั๋วงาน", tl: "Ticketing" },
		email: { id: "Email", en: "Email", th: "อีเมล", tl: "Email" },
		compose: { id: "Compose", en: "Compose", th: "เขียน", tl: "Sumulat" },
		inbox: { id: "Inbox", en: "Inbox", th: "กล่องขาเข้า", tl: "Inbox" },
		sent: { id: "Sent", en: "Sent", th: "ส่งแล้ว", tl: "Naipadala" },
		templates: { id: "Templates", en: "Templates", th: "เทมเพลต", tl: "Mga Template" },
		history: { id: "History", en: "History", th: "ประวัติ", tl: "Kasaysayan" },
		monitoring: { id: "Monitoring", en: "Monitoring", th: "มอนิเตอร์", tl: "Monitoring" },
		channel: { id: "Channel Interaction", en: "Channel Interaction", th: "ปฏิสัมพันธ์ช่องทาง", tl: "Interaksyon ng Channel" },
		recording: { id: "Call Recording", en: "Call Recording", th: "บันทึกการโทร", tl: "Recording ng Tawag" },
		archive: { id: "Recording Archive", en: "Recording Archive", th: "คลังบันทึก", tl: "Archive ng Recording" },
		kirana: { id: "Kirana Monitoring", en: "Kirana Monitoring", th: "มอนิเตอร์ Kirana", tl: "Monitoring ng Kirana" },
		scheduling: { id: "Scheduling", en: "Scheduling", th: "ตารางงาน", tl: "Iskedyul" },
		schedule: { id: "Agent Schedule", en: "Agent Schedule", th: "ตารางเอเจนต์", tl: "Iskedyul ng Agent" },
		workCal: { id: "Work Calendar", en: "Work Calendar", th: "ปฏิทินงาน", tl: "Kalendaryo ng Trabaho" },
		opHours: { id: "Operational Hours", en: "Operational Hours", th: "เวลาทำการ", tl: "Oras ng Operasyon" },
		report: { id: "Report", en: "Report", th: "รายงาน", tl: "Ulat" },
		users: { id: "User Management", en: "User Management", th: "จัดการผู้ใช้", tl: "Pamahalaan ang User" },
		settings: { id: "Settings", en: "Settings", th: "ตั้งค่า", tl: "Mga Setting" },
		designSystem: { id: "Design system", en: "Design system", th: "Design system", tl: "Design system" },
		secMain: { id: "Utama", en: "Main", th: "หลัก", tl: "Pangunahin" },
		secWorkspace: { id: "Workspace", en: "Workspace", th: "พื้นที่ทำงาน", tl: "Workspace" },
		secOps: { id: "Operasional", en: "Operations", th: "ปฏิบัติการ", tl: "Operasyon" }
	};
	const menuLabel = (key: string, l: Locale) => MENU_STR[key]?.[l] ?? key;

	const bottom: Single[] = [
		{ key: "report", to: "/report", icon: ChartColumn },
		{ key: "users", to: "/users", icon: Users },
		{ key: "designSystem", to: "/design-system", icon: Component },
		{ key: "settings", to: "/settings", icon: Settings }
	];

	const CHROME = {
		id: {
			search: "Cari threads, tiket, email...",
			notif: "Notifikasi", notifDesc: "Kelola pemberitahuan perangkat ini.",
			notifOn: "Aktif", notifOff: "Mati",
			notifEnabledMsg: "Notifikasi diaktifkan", notifDisabledMsg: "Notifikasi dimatikan",
			notifEmpty: "Notifikasi dimatikan — tidak ada pemberitahuan baru.",
			notifA: "menunggu assignment", notifB: "antre di omnichat", notifC: "CSAT minggu ini naik 2,1%",
			tickets: "tiket", chats: "chat",
			auxLabel: "Status kehadiran", auxHeading: "Status kehadiran",
			auxOnline: "Online", auxAux: "Aux — Istirahat", auxOffline: "Offline",
			light: "Gunakan mode terang", dark: "Gunakan mode gelap",
			operator: "Operator", cs: "Customer service", team: "Customer service team",
			language: "Bahasa", profile: "Menu profil", logout: "Keluar",
			toggleSidebar: "Buka atau ciutkan sidebar", brandHome: "Beranda DK CRM"
		},
		en: {
			search: "Search threads, tickets, emails...",
			notif: "Notifications", notifDesc: "Manage notifications on this device.",
			notifOn: "On", notifOff: "Off",
			notifEnabledMsg: "Notifications enabled", notifDisabledMsg: "Notifications disabled",
			notifEmpty: "Notifications are off — no new alerts.",
			notifA: "awaiting assignment", notifB: "queued in omnichat", notifC: "CSAT up 2.1% this week",
			tickets: "tickets", chats: "chats",
			auxLabel: "Presence status", auxHeading: "Presence status",
			auxOnline: "Online", auxAux: "Aux — Break", auxOffline: "Offline",
			light: "Use light mode", dark: "Use dark mode",
			operator: "Operator", cs: "Customer service", team: "Customer service team",
			language: "Language", profile: "Profile menu", logout: "Log out",
			toggleSidebar: "Expand or collapse sidebar", brandHome: "DK CRM home"
		},
		th: {
			search: "ค้นหาเธรด ตั๋วงาน อีเมล...",
			notif: "การแจ้งเตือน", notifDesc: "จัดการการแจ้งเตือนบนอุปกรณ์นี้",
			notifOn: "เปิด", notifOff: "ปิด",
			notifEnabledMsg: "เปิดการแจ้งเตือนแล้ว", notifDisabledMsg: "ปิดการแจ้งเตือนแล้ว",
			notifEmpty: "ปิดการแจ้งเตือนแล้ว — ไม่มีการแจ้งใหม่",
			notifA: "รอการมอบหมาย", notifB: "รอคิวในออมนิแชต", notifC: "CSAT สัปดาห์นี้ขึ้น 2.1%",
			tickets: "ตั๋วงาน", chats: "แชต",
			auxLabel: "สถานะการทำงาน", auxHeading: "สถานะการทำงาน",
			auxOnline: "ออนไลน์", auxAux: "พัก (Aux)", auxOffline: "ออฟไลน์",
			light: "ใช้โหมดสว่าง", dark: "ใช้โหมดมืด",
			operator: "โอเปอเรเตอร์", cs: "บริการลูกค้า", team: "ทีมบริการลูกค้า",
			language: "ภาษา", profile: "เมนูโปรไฟล์", logout: "ออกจากระบบ",
			toggleSidebar: "ขยายหรือย่อแถบด้านข้าง", brandHome: "หน้าแรก DK CRM"
		},
		tl: {
			search: "Maghanap ng threads, ticket, email...",
			notif: "Mga Notification", notifDesc: "Pamahalaan ang mga notification sa device na ito.",
			notifOn: "Bukas", notifOff: "Patay",
			notifEnabledMsg: "Binuksan ang notification", notifDisabledMsg: "Pinatay ang notification",
			notifEmpty: "Patay ang notification — walang bagong abiso.",
			notifA: "naghihintay ng assignment", notifB: "nakapila sa omnichat", notifC: "Tumaas ng 2.1% ang CSAT ngayong linggo",
			tickets: "ticket", chats: "chat",
			auxLabel: "Status ng presensya", auxHeading: "Status ng presensya",
			auxOnline: "Online", auxAux: "Aux — Pahinga", auxOffline: "Offline",
			light: "Gamitin ang light mode", dark: "Gamitin ang dark mode",
			operator: "Operator", cs: "Customer service", team: "Customer service team",
			language: "Wika", profile: "Menu ng profile", logout: "Umalis",
			toggleSidebar: "Palawakin o isara ang sidebar", brandHome: "Home ng DK CRM"
		}
	} as const;
	let chrome = $derived(CHROME[$locale]);

	let { children } = $props();
	let sidebarPinned = $state(true);
	let searchQuery = $state("");
	const OPEN_KEY = "dk-sidebar-open";
	let openState = $state<Record<string, boolean>>({});
	let openLoaded = $state(false);
	let notifEnabled = $state(true);
	let accountEmail = $state("");
	type AuxStatus = "online" | "aux" | "offline";
	let auxStatus = $state<AuxStatus>("online");
	let now = $state(new Date());

	const auxMeta: Record<AuxStatus, { label: string; dot: string }> = {
		online: { label: "Online", dot: "bg-emerald-500" },
		aux: { label: "Aux", dot: "bg-amber-500" },
		offline: { label: "Offline", dot: "bg-muted-foreground" }
	};

	const dateFmt = (l: Locale) => new Intl.DateTimeFormat(l === "id" ? "id-ID" : l === "en" ? "en-US" : l === "th" ? "th-TH" : "fil-PH", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
	const timeFmt = (l: Locale) => new Intl.DateTimeFormat(l === "id" ? "id-ID" : l === "en" ? "en-US" : l === "th" ? "th-TH" : "fil-PH", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

	onMount(() => {
		initTheme();
		initLocale();
		if (!localStorage.getItem('dk_token') && page.url.pathname !== '/login') goto('/login');
		accountEmail = localStorage.getItem("dk_email") ?? "";
		const t = setInterval(() => (now = new Date()), 1000);
		try {
			sidebarPinned = localStorage.getItem("dk-sidebar") !== "1";
			if (localStorage.getItem("dk-notif") === "0") notifEnabled = false;
			const s = localStorage.getItem("dk-aux");
			if (s === "aux" || s === "offline" || s === "online") auxStatus = s;
			const raw = localStorage.getItem(OPEN_KEY);
			if (raw) openState = JSON.parse(raw) as Record<string, boolean>;
		} catch { /* storage unavailable */ }
		openLoaded = true;
		return () => clearInterval(t);
	});

	/** Persist which groups the user has expanded. */
	function persistOpen() {
		try {
			localStorage.setItem(OPEN_KEY, JSON.stringify(openState));
		} catch { /* storage unavailable */ }
	}

	function setNotif(v: boolean) {
		notifEnabled = v;
		const c = CHROME[get(locale)];
		try {
			localStorage.setItem("dk-notif", v ? "1" : "0");
		} catch { /* ignore */ }
		toast.success(v ? c.notifEnabledMsg : c.notifDisabledMsg);
	}

	function accountInitials(email: string) {
		const localPart = email.split("@")[0] ?? "";
		const parts = localPart.split(/[._-]+/).filter(Boolean);
		if (parts.length > 1) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
		return localPart.slice(0, 2).toUpperCase() || "OP";
	}

	function setAux(s: AuxStatus) {
		auxStatus = s;
		const c = CHROME[get(locale)];
		const label = s === "online" ? c.auxOnline : s === "aux" ? c.auxAux : c.auxOffline;
		try {
			localStorage.setItem("dk-aux", s);
		} catch { /* ignore */ }
		toast.success(`Status: ${label}`);
	}

	/** Ctrl/Cmd+B and the Omnichat auto-collapse both land here. */
	function setSidebarPinned(open: boolean) {
		sidebarPinned = open;
		try {
			localStorage.setItem("dk-sidebar", open ? "0" : "1");
		} catch { /* storage unavailable */ }
	}

	/** `Sidebar.Provider` pushes every pinned change through here. */
	function updateSidebarPinned(open: boolean) {
		setSidebarPinned(open);
	}

	/**
	 * /chat/v4 needs the full width for its three panels, so the sidebar
	 * auto-collapses to the icon rail while you are there. Hover-peek still
	 * works, so the full labels are always one cursor away.
	 *
	 * This is ephemeral on purpose: it assigns the bindable prop directly, which
	 * never reaches `updateSidebarPinned`, so the user's own pin preference is
	 * neither overwritten nor written to localStorage.
	 */
	let sidebarRestore: boolean | null = null;

	$effect(() => {
		if (isOmnichat) {
			if (sidebarRestore === null) sidebarRestore = sidebarPinned;
			if (sidebarPinned) sidebarPinned = false;
		} else if (sidebarRestore !== null) {
			sidebarPinned = sidebarRestore;
			sidebarRestore = null;
		}
	});

	/**
	 * Only one leaf may be "current". Matching by plain prefix would light up
	 * ancestors too (e.g. `/email` while on `/email/compose`, or `/chat/v3`
	 * while on `/chat/v3/ticket/result`), so we keep the longest matching target.
	 */
	const navTargets = [...parents.flatMap((p) => p.subs.map((s) => s.to)), ...bottom.map((b) => b.to)];
	const activeTarget = $derived.by(() => {
		const path = page.url.pathname;
		let best: string | null = null;
		for (const to of navTargets) {
			const hit = (to === "/home" && path === "/") || path === to || path.startsWith(to + "/");
			if (hit && (best === null || to.length > best.length)) best = to;
		}
		return best;
	});

	function isActive(to: string) {
		return activeTarget === to;
	}

	function isParentActive(p: Parent) {
		return p.subs.some((s) => s.to === activeTarget);
	}

	/** Expand the group that owns the current route, unless the user set it. */
	$effect(() => {
		const target = activeTarget;
		if (!openLoaded || !target) return;
		for (const p of parents) {
			if (p.subs.some((s) => s.to === target) && openState[p.key] === undefined) {
				openState[p.key] = true;
			}
		}
	});

	function submitSearch(event: KeyboardEvent) {
		if (event.key === "Enter" && searchQuery.trim()) {
			goto(`/threads?q=${encodeURIComponent(searchQuery.trim())}`);
		}
	}

	const pageTitles: Record<string, string> = {
		"/home": "Home",
		"/agent/performance": "Agent Performance",
		"/agent-productivity-dashboard": "Agent Productivity",
		"/chat/v3/ticket/result": "Ticket",
		"/threads": "Threads",
		"/report/csat": "CSAT",
		"/chat/v3": "Omnichat",
		"/chat/v4": "Omnichat v4",
		"/ticketing": "Ticketing",
		"/email/compose": "Compose",
		"/email": "Email",
		"/email/send": "Sent",
		"/email/templates": "Templates",
		"/email/history": "History",
		"/spv": "Channel Interaction",
		"/recordings": "Call Recording",
		"/recording-archive": "Recording Archive",
		"/chat/v3/ticket/kirana-monitoring": "Kirana Monitoring",
		"/report": "Report",
		"/users": "User Management",
		"/settings": "Settings",
		"/design-system": "Design system",
		"/agent-schedule": "Agent Schedule",
		"/work-calendar": "Work Calendar",
		"/operational-hours": "Operational Hours",
		"/wallboard": "Wallboard"
	};
	let pageTitle = $derived.by(() => {
		const path = page.url.pathname;
		if (pageTitles[path]) return pageTitles[path];
		// Dynamic routes such as /chat/v4/[threadId] have no exact key; fall back
		// to the nearest ancestor that has one, longest prefix first.
		const ancestor = Object.keys(pageTitles)
			.filter((key) => path.startsWith(key + "/"))
			.sort((a, b) => b.length - a.length)[0];
		return ancestor ? pageTitles[ancestor] : "DK CRM";
	});
	let isWallboard = $derived(page.url.pathname === "/wallboard");
	let isPublicRoute = $derived(page.url.pathname === "/login");
	let isOmnichat = $derived(page.url.pathname.startsWith("/chat/v4"));
</script>

{#if isWallboard || isPublicRoute}
	<div class="min-h-svh bg-slate-950 text-slate-100">
		<Toaster position="top-right" />
		{@render children()}
	</div>
{:else}
<Sidebar.Provider
	bind:open={sidebarPinned}
	onOpenChange={updateSidebarPinned}
	hoverCollapseDelay={50}
	hoverExpandDelay={80}
	class="min-h-svh bg-background text-foreground"
>
	<Sidebar.Root collapsible="icon" variant="sidebar">
<Sidebar.Header>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton size="lg">
							{#snippet child({ props })}
								<a href="/home" {...props} aria-label={chrome.brandHome} class="flex min-w-0 items-center gap-2.5 transition-[gap] duration-200 ease-out group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0 motion-reduce:transition-none [&>span]:max-w-[180px] [&>span]:overflow-hidden [&>span]:transition-[max-width,height,opacity,transform] [&>span]:duration-200 [&>span]:ease-out group-data-[collapsible=icon]:[&>span]:max-w-0 group-data-[collapsible=icon]:[&>span]:h-0 group-data-[collapsible=icon]:[&>span]:translate-x-1 group-data-[collapsible=icon]:[&>span]:opacity-0 motion-reduce:[&>span]:transition-none">
									<img src="/favicon.svg" alt="Logo DK CRM" class="size-9 shrink-0 rounded-md" />
									<span class="flex flex-col gap-0.5 leading-none">
										<span class="font-semibold">DK CRM</span>
										<span class="text-meta text-muted-foreground">Contact Center</span>
									</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.Header>
		<Sidebar.Separator />
		<Sidebar.Content>
			<ScrollArea class="h-full">
				{#each sections as section (section.key)}
					<Sidebar.Group>
						<Sidebar.GroupLabel>{menuLabel(section.labelKey, $locale)}</Sidebar.GroupLabel>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each section.parents as parent (parent.key)}
									<Collapsible.Root
										open={openState[parent.key] ?? false}
										onOpenChange={(v) => { openState[parent.key] = v; persistOpen(); }}
										class="group/collapsible"
									>
										<Sidebar.MenuItem>
											<Collapsible.Trigger>
												{#snippet child({ props })}
													<Sidebar.MenuButton
														{...props}
														isActive={isParentActive(parent)}
													>
														<parent.icon data-icon="true" />
														<span>{menuLabel(parent.key, $locale)}</span>
														<ChevronDown data-icon="true" class="ms-auto transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
													</Sidebar.MenuButton>
												{/snippet}
											</Collapsible.Trigger>
											<Collapsible.Content>
												<Sidebar.MenuSub>
													{#each parent.subs as sub (sub.key)}
														<Sidebar.MenuSubItem>
															<Sidebar.MenuSubButton
																href={sub.to}
																isActive={isActive(sub.to)}
																aria-current={isActive(sub.to) ? "page" : undefined}
																class={sub.badge ? "pe-8" : undefined}
															>
																<sub.icon data-icon="true" />
																<span>{menuLabel(sub.key, $locale)}</span>
															</Sidebar.MenuSubButton>
															{#if sub.badge}<Sidebar.MenuBadge class="top-1/2 -translate-y-1/2">{sub.badge}</Sidebar.MenuBadge>{/if}
														</Sidebar.MenuSubItem>
													{/each}
												</Sidebar.MenuSub>
											</Collapsible.Content>
										</Sidebar.MenuItem>
									</Collapsible.Root>
								{/each}
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Sidebar.Group>
				{/each}
				<Sidebar.Separator />
				<Sidebar.Group>
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							{#each bottom as link (link.key)}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton isActive={isActive(link.to)}>
										{#snippet child({ props })}
											<a href={link.to} {...props} aria-current={isActive(link.to) ? "page" : undefined}>
												<link.icon data-icon="true" />
												<span>{menuLabel(link.key, $locale)}</span>
											</a>
										{/snippet}
									</Sidebar.MenuButton>
									{#if link.badge}<Sidebar.MenuBadge>{link.badge}</Sidebar.MenuBadge>{/if}
								</Sidebar.MenuItem>
							{/each}
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</Sidebar.Group>
			</ScrollArea>
		</Sidebar.Content>
	</Sidebar.Root>

	<Sidebar.Inset class="min-h-svh min-w-0 overflow-hidden">
		<header class="flex h-16 shrink-0 items-center gap-2 border-b border-border/80 bg-card/95 px-3 backdrop-blur sm:gap-3 sm:px-4 md:px-6">
			<Sidebar.Trigger class="md:hidden" srLabel={chrome.toggleSidebar} aria-label={chrome.toggleSidebar} />
			<div class="flex min-w-0 flex-col gap-0.5 leading-none">
				<h1 class="truncate text-lg font-semibold tracking-tight md:text-xl">{pageTitle}</h1>
				<p class="hidden text-meta text-muted-foreground tabular-nums sm:block" aria-live="off">
					{dateFmt($locale).format(now)} • {timeFmt($locale).format(now)}
				</p>
			</div>
			<div class="ms-auto flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2">
				<InputGroup.Root class="hidden w-full max-w-xs sm:flex lg:max-w-sm">
					<InputGroup.Addon><Search data-icon="true" /></InputGroup.Addon>
					<InputGroup.Input
						bind:value={searchQuery}
						onkeydown={submitSearch}
						placeholder={chrome.search}
						aria-label={chrome.search}
					/>
				</InputGroup.Root>
				<Separator orientation="vertical" class="mx-0.5 hidden h-7 md:block" />
				<DropdownMenu.Root>
					<DropdownMenu.Trigger aria-label={chrome.language}>
						{#snippet child({ props })}
							<Button {...props} variant="ghost" size="default" class="gap-1 px-2 text-meta font-semibold uppercase max-[420px]:size-8 max-[420px]:p-0">
								<Globe data-icon="true" />
								<span class="max-[420px]:hidden">{$locale}</span>
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-44">
						<DropdownMenu.Group>
							<DropdownMenu.GroupHeading>{chrome.language}</DropdownMenu.GroupHeading>
							{#each locales as l (l.id)}
								<DropdownMenu.Item onclick={() => setLocale(l.id)}>
									<span class={l.id === $locale ? "font-semibold" : ""}>{l.label}</span>
									{#if l.id === $locale}<span class="ms-auto text-meta">✓</span>{/if}
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
				<Popover.Root>
					<Popover.Trigger aria-label={chrome.notif}>
						{#snippet child({ props })}
							<Button {...props} variant="ghost" size="icon" class="relative text-muted-foreground">
								<Bell data-icon="true" />
								{#if notifEnabled}<Badge class="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 text-meta">3</Badge>{/if}
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content align="end" class="w-72 max-w-[calc(100vw-2rem)]">
						<Popover.Title class="text-sm font-semibold">{chrome.notif}</Popover.Title>
						<Popover.Description class="text-meta">{chrome.notifDesc}</Popover.Description>
						<div class="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-2.5 py-2">
							<span class="text-meta font-medium">{notifEnabled ? chrome.notifOn : chrome.notifOff}</span>
							<Switch checked={notifEnabled} onCheckedChange={setNotif} aria-label={chrome.notif} />
						</div>
						<Separator />
						{#if notifEnabled}
							<div class="flex flex-col gap-2 text-sm">
								<p><span class="font-medium">5 {chrome.tickets}</span> {chrome.notifA}</p>
								<p><span class="font-medium">12 {chrome.chats}</span> {chrome.notifB}</p>
								<p class="text-muted-foreground">{chrome.notifC}</p>
							</div>
						{:else}
							<p class="text-meta text-muted-foreground">{chrome.notifEmpty}</p>
						{/if}
					</Popover.Content>
				</Popover.Root>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger aria-label={chrome.auxLabel}>
						{#snippet child({ props })}
							<Button {...props} variant="outline" size="default" class="max-w-[38vw] gap-2 max-[419px]:max-w-8 max-[419px]:gap-0 max-[419px]:px-0 sm:max-w-none">
								<span class="size-2 shrink-0 rounded-full {auxMeta[auxStatus].dot}" aria-hidden="true"></span>
								<span class="min-w-0 flex-1 truncate max-[419px]:hidden">{auxStatus === "online" ? chrome.auxOnline : auxStatus === "aux" ? chrome.auxAux : chrome.auxOffline}</span>
								<ChevronDown data-icon="true" class="hidden shrink-0 min-[420px]:block" />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-52">
						<DropdownMenu.Group>
							<DropdownMenu.GroupHeading>{chrome.auxHeading}</DropdownMenu.GroupHeading>
							<DropdownMenu.Item onclick={() => setAux("online")}>
								<span class="size-2 rounded-full bg-emerald-500" aria-hidden="true"></span>{chrome.auxOnline}
							</DropdownMenu.Item>
							<DropdownMenu.Item onclick={() => setAux("aux")}>
								<span class="size-2 rounded-full bg-amber-500" aria-hidden="true"></span>{chrome.auxAux}
							</DropdownMenu.Item>
							<DropdownMenu.Item onclick={() => setAux("offline")}>
								<span class="size-2 rounded-full bg-muted-foreground" aria-hidden="true"></span>{chrome.auxOffline}
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
				<Button
					variant="ghost"
					size="icon"
					onclick={toggleTheme}
					class="text-muted-foreground"
					aria-label={$darkMode ? chrome.light : chrome.dark}
				>
					{#if $darkMode}<Sun data-icon="true" />{:else}<Moon data-icon="true" />{/if}
				</Button>
				<Separator orientation="vertical" class="mx-0.5 hidden h-7 sm:block" />
				<DropdownMenu.Root>
					<DropdownMenu.Trigger aria-label={chrome.profile}>
						{#snippet child({ props })}
							<Button {...props} variant="ghost" size="default" class="gap-2 px-1.5" aria-label={chrome.profile}>
								<Avatar.Root class="size-8">
									<Avatar.Fallback>{accountInitials(accountEmail)}</Avatar.Fallback>
								</Avatar.Root>
								<span class="hidden text-left md:block">
									<span class="block text-meta font-semibold">{chrome.operator}</span>
									<span class="block text-left text-meta text-muted-foreground">{chrome.cs}</span>
								</span>
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-64 max-w-[calc(100vw-1rem)] p-2">
						<DropdownMenu.Label class="px-2 py-2.5">
							<div class="flex min-w-0 items-center gap-3">
								<Avatar.Root class="size-10">
									<Avatar.Fallback>{accountInitials(accountEmail)}</Avatar.Fallback>
								</Avatar.Root>
								<div class="min-w-0 flex-1 text-left">
									<span class="block text-sm font-semibold leading-5 text-foreground">{chrome.operator}</span>
									<span class="block text-meta leading-5 text-muted-foreground">{chrome.cs}</span>
									<span class="block truncate text-meta leading-5 text-muted-foreground" title={accountEmail || undefined}>
										{accountEmail || chrome.team}
									</span>
								</div>
							</div>
						</DropdownMenu.Label>
						<DropdownMenu.Separator class="my-2" />
						<DropdownMenu.Item class="min-h-10 gap-2 px-2" onclick={() => goto("/settings")}>
							<Settings data-icon="true" />{menuLabel("settings", $locale)}
						</DropdownMenu.Item>
						<DropdownMenu.Separator class="my-2" />
						<DropdownMenu.Item class="min-h-10 gap-2 px-2" variant="destructive" onclick={() => { localStorage.removeItem("dk_token"); goto("/login"); }}>
							<LogOut data-icon="true" />{chrome.logout}
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</header>
		<main
			class={isOmnichat
				? "min-h-0 min-w-0 flex-1 overflow-hidden bg-background"
				: "min-h-0 min-w-0 flex-1 overflow-y-auto bg-background p-5 md:p-6"}
		>
			<Toaster position="top-right" />
			{@render children()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
{/if}
