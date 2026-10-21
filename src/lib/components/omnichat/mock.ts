import type { Locale } from "$lib/i18n";

export type Channel = "whatsapp" | "instagram" | "web" | "email" | "phone";
export type ThreadStatus = "open" | "pending" | "closed";
export type MessageKind = "customer" | "agent" | "system";

export type Agent = {
	id: string;
	name: string;
	initials: string;
	status: "online" | "away" | "busy" | "offline";
};

export type Customer = {
	id: string;
	name: string;
	initials: string;
	phone: string;
	email: string;
	location: string;
	segment: string;
	joined: string;
	totalChats: number;
};

export type Thread = {
	id: string;
	customerId: string;
	channel: Channel;
	preview: string;
	time: string;
	unread: number;
	status: ThreadStatus;
	ticketId?: string;
	assigneeId: string;
	tags: string[];
};

export type ChatMessage = {
	id: string;
	kind: MessageKind;
	text: string;
	time: string;
	attachment?: { name: string; size: string };
};

export const AGENTS: Agent[] = [
	{ id: "a1", name: "Ayu Pratiwi", initials: "AP", status: "online" },
	{ id: "a2", name: "Bima Saputra", initials: "BS", status: "busy" },
	{ id: "a3", name: "Citra Dewi", initials: "CD", status: "away" },
	{ id: "a4", name: "Doni Kurnia", initials: "DK", status: "offline" }
];

export const CUSTOMERS: Customer[] = [
	{
		id: "c1",
		name: "Rina Kusumawardani",
		initials: "RK",
		phone: "+62 812-3341-9920",
		email: "rina.k@mail.com",
		location: "Jakarta Selatan",
		segment: "Gold",
		joined: "12 Mar 2024",
		totalChats: 38
	},
	{
		id: "c2",
		name: "Bagus Prasetyo",
		initials: "BP",
		phone: "+62 813-9087-2214",
		email: "bagus.p@mail.com",
		location: "Bandung",
		segment: "Silver",
		joined: "02 Jul 2024",
		totalChats: 12
	},
	{
		id: "c3",
		name: "Nadia Rahmawati",
		initials: "NR",
		phone: "+62 852-7712-4480",
		email: "nadia.r@mail.com",
		location: "Surabaya",
		segment: "Gold",
		joined: "21 Nov 2023",
		totalChats: 64
	},
	{
		id: "c4",
		name: "Farhan Hidayat",
		initials: "FH",
		phone: "+62 811-2298-6631",
		email: "farhan.h@mail.com",
		location: "Medan",
		segment: "Bronze",
		joined: "18 Jan 2025",
		totalChats: 4
	},
	{
		id: "c5",
		name: "Sinta Maharani",
		initials: "SM",
		phone: "+62 878-5560-1134",
		email: "sinta.m@mail.com",
		location: "Makassar",
		segment: "Silver",
		joined: "09 Sep 2024",
		totalChats: 21
	},
	{
		id: "c6",
		name: "Yoga Pratama",
		initials: "YP",
		phone: "+62 895-3312-7788",
		email: "yoga.p@mail.com",
		location: "Yogyakarta",
		segment: "Bronze",
		joined: "27 Apr 2025",
		totalChats: 2
	}
];

export const THREADS: Thread[] = [
	{
		id: "t1",
		customerId: "c1",
		channel: "whatsapp",
		preview: "Baik, saya tunggu konfirmasi ya kak.",
		time: "09:42",
		unread: 2,
		status: "open",
		ticketId: "JKT-9374-3U128",
		assigneeId: "a1",
		tags: ["retur", "prioritas"]
	},
	{
		id: "t2",
		customerId: "c2",
		channel: "instagram",
		preview: "Kak promo bulan ini masih berlaku?",
		time: "09:15",
		unread: 0,
		status: "open",
		assigneeId: "a2",
		tags: ["promo"]
	},
	{
		id: "t3",
		customerId: "c3",
		channel: "web",
		preview: "Terima kasih, barang sudah sampai.",
		time: "08:58",
		unread: 0,
		status: "closed",
		ticketId: "JKT-9368-1A004",
		assigneeId: "a1",
		tags: ["selesai"]
	},
	{
		id: "t4",
		customerId: "c4",
		channel: "email",
		preview: "Lampiran invoice dalam attachment.",
		time: "08:31",
		unread: 1,
		status: "pending",
		assigneeId: "a3",
		tags: ["invoice"]
	},
	{
		id: "t5",
		customerId: "c5",
		channel: "phone",
		preview: "Permintaan dihentikan sementara.",
		time: "kemarin",
		unread: 0,
		status: "open",
		assigneeId: "a2",
		tags: ["layanan"]
	},
	{
		id: "t6",
		customerId: "c6",
		channel: "whatsapp",
		preview: "Halo, mau tanya ongkir keisman.",
		time: "kemarin",
		unread: 0,
		status: "open",
		assigneeId: "a4",
		tags: ["ongkir"]
	}
];

export const MESSAGES: Record<string, ChatMessage[]> = {
	t1: [
		{
			id: "m1",
			kind: "system",
			text: "Chat telah terhubung dengan agen Ayu Pratiwi",
			time: "09:31"
		},
		{
			id: "m2",
			kind: "customer",
			text: "Halo kak, saya mau tanya soal retur barang yang saya beli minggu lalu. Nomor resinya RS-4471-A.",
			time: "09:33"
		},
		{
			id: "m3",
			kind: "agent",
			text: "Halo Kak Rina, terima kasih sudah menghubungi. Saya bantu cek retur untuk resi RS-4471-A ya.",
			time: "09:35"
		},
		{
			id: "m4",
			kind: "customer",
			text: "Iya kak, barangnya ukurannya tidak sesuai. Mohon prosesnya bisa cepat ya.",
			time: "09:38"
		},
		{
			id: "m5",
			kind: "agent",
			text: "Siap Kak. Mohon lampirkan foto barang dan nomor rekening terbaru untuk proses refund.",
			time: "09:40",
			attachment: { name: "form-retur.pdf", size: "248 KB" }
		},
		{
			id: "m6",
			kind: "customer",
			text: "Baik, saya tunggu konfirmasi ya kak.",
			time: "09:42"
		}
	],
	t2: [
		{
			id: "m1",
			kind: "system",
			text: "Percakapan dialihkan dari Instagram",
			time: "09:10"
		},
		{
			id: "m2",
			kind: "customer",
			text: "Kak promo bulan ini masih berlaku?",
			time: "09:15"
		}
	],
	t3: [
		{
			id: "m1",
			kind: "system",
			text: "Tiket JKT-9368-1A004 ditutup",
			time: "08:58"
		},
		{
			id: "m2",
			kind: "customer",
			text: "Terima kasih, barang sudah sampai.",
			time: "08:57"
		}
	],
	t4: [
		{
			id: "m1",
			kind: "customer",
			text: "Lampiran invoice dalam attachment.",
			time: "08:31",
			attachment: { name: "invoice-2026-03.pdf", size: "1,2 MB" }
		}
	],
	t5: [
		{
			id: "m1",
			kind: "customer",
			text: "Permintaan dihentikan sementara.",
			time: "17:04"
		}
	],
	t6: [
		{
			id: "m1",
			kind: "customer",
			text: "Halo, mau tanya ongkir keisman.",
			time: "16:22"
		}
	]
};

export const JOURNEY: { key: string; state: "complete" | "current" | "upcoming"; title: string; time: string }[] = [
	{ key: "received", state: "complete", title: "Percakapan diterima", time: "09:31" },
	{ key: "identified", state: "complete", title: "Identifikasi kebutuhan", time: "09:33" },
	{ key: "handling", state: "current", title: "Penanganan oleh agen", time: "09:35" },
	{ key: "resolution", state: "upcoming", title: "Resolusi & retensi", time: "—" }
];

export const CHAT_STR: Record<Locale, Record<string, string>> = {
	id: {
		inbox: "Kotak Masuk",
		all: "Semua",
		unread: "Belum dibaca",
		pending: "Menunggu",
		closed: "Selesai",
		search: "Cari percakapan...",
		empty: "Tidak ada percakapan",
		overview: "Ringkasan",
		endTicket: "Tutup Tiket",
		history: "Riwayat",
		ticket: "Tiket",
		assigned: "Ditangani",
		you: "Anda",
		message: "Tulis pesan...",
		send: "Kirim",
		attach: "Lampirkan berkas",
		escalate: "Eskalasi (Layer 2)",
		escalateDesc: "Teruskan ke tim spesialis bila tidak dapat diselesaikan.",
		customerInfo: "Info pelanggan",
		journey: "Interaksi",
		quickAction: "Aksi cepat",
		assign: "Ubah agen",
		endChat: "Akhiri chat",
		snooze: "Tunda",
		back: "Kembali",
		more: "Lainnya",
		copyTicket: "Salin ID tiket",
		markUnread: "Tandai belum dibaca",
		closeChat: "Tutup chat",
		copyPhone: "Salin nomor telepon",
		copyEmail: "Salin email",
		removeAttachment: "Hapus lampiran",
		attachmentError: "File harus berukuran maksimal 10 MB.",
		clipboardUnavailable: "Clipboard tidak tersedia.",
		emptySearch: "Tidak ada percakapan yang cocok dengan pencarian ini.",
		emptyFilter: "Tidak ada percakapan dalam filter ini.",
		threadNotFound: "Percakapan tidak tersedia atau sudah dihapus.",
		resetFilters: "Reset filter",
		historyCount: "Jumlah pesan",
		demoData: "Data demo",
		connected: "Percakapan telah dimulai",
		today: "Hari ini",
		yesterday: "Kemarin"
	},
	en: {
		inbox: "Inbox",
		all: "All",
		unread: "Unread",
		pending: "Pending",
		closed: "Closed",
		search: "Search conversations...",
		empty: "No conversations",
		overview: "Overview",
		endTicket: "End Chat Ticket",
		history: "History",
		ticket: "Ticket",
		assigned: "Assigned",
		you: "You",
		message: "Write a message...",
		send: "Send",
		attach: "Attach file",
		escalate: "Escalation (Layer 2)",
		escalateDesc: "Forward to the specialist team if this cannot be resolved.",
		customerInfo: "Customer info",
		journey: "Interaction",
		quickAction: "Quick actions",
		assign: "Reassign agent",
		endChat: "End chat",
		snooze: "Snooze",
		back: "Back",
		more: "More",
		copyTicket: "Copy ticket ID",
		markUnread: "Mark as unread",
		closeChat: "Close chat",
		copyPhone: "Copy phone number",
		copyEmail: "Copy email",
		removeAttachment: "Remove attachment",
		attachmentError: "File must be 10 MB or smaller.",
		clipboardUnavailable: "Clipboard is not available.",
		emptySearch: "No conversations match this search.",
		emptyFilter: "No conversations match this filter.",
		threadNotFound: "This conversation is unavailable or has been removed.",
		resetFilters: "Reset filters",
		historyCount: "Message count",
		demoData: "Demo data",
		connected: "The conversation has started",
		today: "Today",
		yesterday: "Yesterday"
	},
	th: {
		inbox: "กล่องขาเข้า",
		all: "ทั้งหมด",
		unread: "ยังไม่ได้อ่าน",
		pending: "รอดำเนินการ",
		closed: "ปิดแล้ว",
		search: "ค้นหาการสนทนา...",
		empty: "ไม่มีการสนทนา",
		overview: "ภาพรวม",
		endTicket: "ปิดตั๋ว",
		history: "ประวัติ",
		ticket: "ตั๋ว",
		assigned: "ดูแลโดย",
		you: "คุณ",
		message: "เขียนข้อความ...",
		send: "ส่ง",
		attach: "แนบไฟล์",
		escalate: "ส่งต่อ (ชั้นที่ 2)",
		escalateDesc: "ส่งต่อให้ทีมผู้เชี่ยวชาญหากยังแก้ไขไม่ได้",
		customerInfo: "ข้อมูลลูกค้า",
		journey: "การโต้ตอบ",
		quickAction: "การดำเนินการด่วน",
		assign: "เปลี่ยนเอเจนต์",
		endChat: "จบการสนทนา",
		snooze: "พักไว้",
		back: "ย้อนกลับ",
		more: "เพิ่มเติม",
		copyTicket: "คัดลอก ID ตั๋ว",
		markUnread: "ทำเครื่องหมายว่ายังไม่ได้อ่าน",
		closeChat: "ปิดการสนทนา",
		copyPhone: "คัดลอกหมายเลขโทรศัพท์",
		copyEmail: "คัดลอกอีเมล",
		removeAttachment: "ลบไฟล์แนบ",
		attachmentError: "ไฟล์ต้องมีขนาดไม่เกิน 10 MB",
		clipboardUnavailable: "ไม่สามารถใช้คลิปบอร์ดได้",
		emptySearch: "ไม่พบการสนทนาที่ตรงกับการค้นหา",
		emptyFilter: "ไม่พบการสนทนาในตัวกรองนี้",
		threadNotFound: "ไม่พบการสนทนานี้หรือถูกลบไปแล้ว",
		resetFilters: "รีเซ็ตตัวกรอง",
		historyCount: "จำนวนข้อความ",
		demoData: "ข้อมูลตัวอย่าง",
		connected: "เริ่มการสนทนาแล้ว",
		today: "วันนี้",
		yesterday: "เมื่อวาน"
	},
	tl: {
		inbox: "Inbox",
		all: "Lahat",
		unread: "Hindi pa nababasa",
		pending: "Naghihintay",
		closed: "Tapos na",
		search: "Maghanap ng usapan...",
		empty: "Walang usapan",
		overview: "Pangkalahatan",
		endTicket: "Isara ang Ticket",
		history: "Kasaysayan",
		ticket: "Ticket",
		assigned: "Kinakagawa",
		you: "Ikaw",
		message: "Magsulat ng mensahe...",
		send: "Ipadala",
		attach: "Mag-attach ng file",
		escalate: "Escalation (Layer 2)",
		escalateDesc: "Ipadala sa espesyalistang team kung hindi masolusyon.",
		customerInfo: "Impormasyon ng customer",
		journey: "Pakikipag-ugnayan",
		quickAction: "Mabilis na aksyon",
		assign: "Palitan ang agent",
		endChat: "Tapusin ang chat",
		snooze: "I-snooze",
		back: "Bumalik",
		more: "Higit pa",
		copyTicket: "Kopyahin ang ticket ID",
		markUnread: "Markahan bilang hindi pa nababasa",
		closeChat: "Isara ang chat",
		copyPhone: "Kopyahin ang numero ng telepono",
		copyEmail: "Kopyahin ang email",
		removeAttachment: "Alisin ang attachment",
		attachmentError: "Dapat 10 MB o mas maliit ang file.",
		clipboardUnavailable: "Hindi available ang clipboard.",
		emptySearch: "Walang usapang tumutugma sa paghahanap.",
		emptyFilter: "Walang usapan sa filter na ito.",
		threadNotFound: "Hindi available o nabura na ang usapang ito.",
		resetFilters: "I-reset ang mga filter",
		historyCount: "Bilang ng mensahe",
		demoData: "Demo data",
		connected: "Nagsimula na ang usapan",
		today: "Ngayon",
		yesterday: "Kahapon"
	}
};
