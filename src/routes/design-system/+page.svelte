<script lang="ts">
	import { CalendarDate, type DateValue } from '@internationalized/date';
	import { locale } from '$lib/i18n';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Field from '$lib/components/ui/field';
	import * as Select from '$lib/components/ui/select';
	import * as Calendar from '$lib/components/ui/calendar';
	import DatePicker from '$lib/components/ui/date-picker.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Switch } from '$lib/components/ui/switch';
	import { Slider } from '$lib/components/ui/slider';
	import { Button } from '$lib/components/ui/button';
	import * as Toggle from '$lib/components/ui/toggle';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { Badge } from '$lib/components/ui/badge';
	import { Chip } from '$lib/components/ui/chip';
	import { Progress } from '$lib/components/ui/progress';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Spinner } from '$lib/components/ui/spinner';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Table from '$lib/components/ui/table';
	import * as Empty from '$lib/components/ui/empty';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Popover from '$lib/components/ui/popover';
	import * as Separator from '$lib/components/ui/separator';
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Copy from '@lucide/svelte/icons/copy';
	import Info from '@lucide/svelte/icons/info';
	import Settings2 from '@lucide/svelte/icons/settings-2';

	const STR = {
		id: {
			title: 'Design system', intro: 'Referensi komponen dan pola UI yang dipakai di aplikasi DK CRM.', search: 'Cari komponen…', overview: 'Fondasi', forms: 'Formulir', actions: 'Aksi & navigasi', feedback: 'Feedback & data', overlays: 'Overlay', tokens: 'Token aktif', copy: 'Salin', copied: 'Tersalin', sample: 'Contoh interaktif', sizes: 'Ukuran yang tersedia', variants: 'Variasi', states: 'State', usage: 'Penggunaan', input: 'Input', inputDesc: 'Field teks dasar untuk nilai satu baris.', email: 'Email', textarea: 'Textarea', textareaDesc: 'Field teks untuk pesan atau catatan lebih panjang.', select: 'Select', selectDesc: 'Pilihan tunggal dari daftar.', choose: 'Pilih opsi', calendar: 'Calendar', calendarDesc: 'Pemilih tanggal tunggal dengan navigasi bulan.', datePicker: 'Date picker', datePickerDesc: 'Calendar dalam popover untuk form.', checkbox: 'Checkbox', radio: 'Radio group', switch: 'Switch', slider: 'Slider', button: 'Button', buttonDesc: 'Aksi utama, sekunder, dan ikon.', toggle: 'Toggle', tabs: 'Tabs', card: 'Card', alert: 'Alert', badge: 'Badge', chip: 'Chip', progress: 'Progress', loading: 'Loading', avatar: 'Avatar', table: 'Table', empty: 'Empty state', tooltip: 'Tooltip', dialog: 'Dialog', dropdown: 'Dropdown menu', popover: 'Popover', separators: 'Separator', disabled: 'Disabled', invalid: 'Email tidak valid', required: 'Wajib diisi', save: 'Simpan perubahan', cancel: 'Batal', openDialog: 'Buka dialog', dialogTitle: 'Konfirmasi perubahan', dialogDesc: 'Contoh dialog memakai komponen aplikasi.', confirm: 'Konfirmasi', menuAction: 'Pengaturan profil', menuHelp: 'Bantuan', popoverText: 'Konten popover ditempatkan dekat pemicunya.', emptyTitle: 'Belum ada data', emptyDesc: 'Tambahkan item pertama untuk memulai.', cell: 'Komponen', example: 'Contoh', status: 'Status', active: 'Aktif', sampleText: 'Contoh teks', complete: 'Selesai', high: 'Tinggi', medium: 'Sedang', low: 'Rendah', small: 'Small', default: 'Default', large: 'Large', extraLarge: 'Extra large', foundationDesc: 'Semua contoh memakai token tema aktif. Gunakan toggle tema pada topbar untuk membandingkan light dan dark.', color: 'Warna', typography: 'Tipografi', radius: 'Radius', spacing: 'Spacing', codeHint: 'Komponen berasal dari', reusable: 'Reusable UI kit', filterEmpty: 'Tidak ada komponen yang cocok.'
		},
		en: {
			title: 'Design system', intro: 'Reference for reusable components and UI patterns used in DK CRM.', search: 'Search components…', overview: 'Foundations', forms: 'Forms', actions: 'Actions & navigation', feedback: 'Feedback & data', overlays: 'Overlays', tokens: 'Active tokens', copy: 'Copy', copied: 'Copied', sample: 'Interactive example', sizes: 'Available sizes', variants: 'Variants', states: 'States', usage: 'Usage', input: 'Input', inputDesc: 'Basic single-line text field.', email: 'Email', textarea: 'Textarea', textareaDesc: 'Text field for longer messages or notes.', select: 'Select', selectDesc: 'Single choice from a list.', choose: 'Choose an option', calendar: 'Calendar', calendarDesc: 'Single-date picker with month navigation.', datePicker: 'Date picker', datePickerDesc: 'Calendar in a popover for forms.', checkbox: 'Checkbox', radio: 'Radio group', switch: 'Switch', slider: 'Slider', button: 'Button', buttonDesc: 'Primary, secondary, and icon actions.', toggle: 'Toggle', tabs: 'Tabs', card: 'Card', alert: 'Alert', badge: 'Badge', chip: 'Chip', progress: 'Progress', loading: 'Loading', avatar: 'Avatar', table: 'Table', empty: 'Empty state', tooltip: 'Tooltip', dialog: 'Dialog', dropdown: 'Dropdown menu', popover: 'Popover', separators: 'Separator', disabled: 'Disabled', invalid: 'Invalid email', required: 'Required', save: 'Save changes', cancel: 'Cancel', openDialog: 'Open dialog', dialogTitle: 'Confirm changes', dialogDesc: 'Dialog example using the application component.', confirm: 'Confirm', menuAction: 'Profile settings', menuHelp: 'Help', popoverText: 'Popover content sits near its trigger.', emptyTitle: 'No data yet', emptyDesc: 'Add your first item to get started.', cell: 'Component', example: 'Example', status: 'Status', active: 'Active', sampleText: 'Sample text', complete: 'Complete', high: 'High', medium: 'Medium', low: 'Low', small: 'Small', default: 'Default', large: 'Large', extraLarge: 'Extra large', foundationDesc: 'Every sample uses the active theme tokens. Use the theme toggle in the top bar to compare light and dark.', color: 'Color', typography: 'Typography', radius: 'Radius', spacing: 'Spacing', codeHint: 'Components are from', reusable: 'Reusable UI kit', filterEmpty: 'No matching components.'
		},
		th: {
			title: 'Design system', intro: 'อ้างอิงคอมโพเนนต์และรูปแบบ UI ที่ใช้ใน DK CRM', search: 'ค้นหาคอมโพเนนต์…', overview: 'พื้นฐาน', forms: 'ฟอร์ม', actions: 'การทำงานและการนำทาง', feedback: 'สถานะและข้อมูล', overlays: 'Overlay', tokens: 'โทเคนที่ใช้งาน', copy: 'คัดลอก', copied: 'คัดลอกแล้ว', sample: 'ตัวอย่างโต้ตอบได้', sizes: 'ขนาดที่รองรับ', variants: 'รูปแบบ', states: 'สถานะ', usage: 'การใช้งาน', input: 'Input', inputDesc: 'ช่องข้อความบรรทัดเดียว', email: 'อีเมล', textarea: 'Textarea', textareaDesc: 'ช่องข้อความสำหรับข้อความหรือบันทึกที่ยาวขึ้น', select: 'Select', selectDesc: 'เลือกหนึ่งรายการจากรายการ', choose: 'เลือกตัวเลือก', calendar: 'Calendar', calendarDesc: 'เลือกวันที่เดียวพร้อมนำทางเดือน', datePicker: 'Date picker', datePickerDesc: 'ปฏิทินใน Popover สำหรับฟอร์ม', checkbox: 'Checkbox', radio: 'Radio group', switch: 'Switch', slider: 'Slider', button: 'Button', buttonDesc: 'การทำงานหลัก รอง และไอคอน', toggle: 'Toggle', tabs: 'Tabs', card: 'Card', alert: 'Alert', badge: 'Badge', chip: 'Chip', progress: 'Progress', loading: 'กำลังโหลด', avatar: 'Avatar', table: 'Table', empty: 'สถานะว่าง', tooltip: 'Tooltip', dialog: 'Dialog', dropdown: 'Dropdown menu', popover: 'Popover', separators: 'Separator', disabled: 'ปิดใช้งาน', invalid: 'อีเมลไม่ถูกต้อง', required: 'จำเป็น', save: 'บันทึกการเปลี่ยนแปลง', cancel: 'ยกเลิก', openDialog: 'เปิด Dialog', dialogTitle: 'ยืนยันการเปลี่ยนแปลง', dialogDesc: 'ตัวอย่าง Dialog ใช้คอมโพเนนต์ของแอป', confirm: 'ยืนยัน', menuAction: 'ตั้งค่าโปรไฟล์', menuHelp: 'ช่วยเหลือ', popoverText: 'เนื้อหา Popover อยู่ใกล้ตัวกระตุ้น', emptyTitle: 'ยังไม่มีข้อมูล', emptyDesc: 'เพิ่มรายการแรกเพื่อเริ่มต้น', cell: 'คอมโพเนนต์', example: 'ตัวอย่าง', status: 'สถานะ', active: 'ใช้งาน', sampleText: 'ข้อความตัวอย่าง', complete: 'เสร็จสิ้น', high: 'สูง', medium: 'ปานกลาง', low: 'ต่ำ', small: 'เล็ก', default: 'ค่าเริ่มต้น', large: 'ใหญ่', extraLarge: 'ใหญ่มาก', foundationDesc: 'ตัวอย่างทั้งหมดใช้โทเคนธีมปัจจุบัน ใช้ปุ่มธีมบนแถบด้านบนเพื่อเปรียบเทียบ light และ dark', color: 'สี', typography: 'ตัวอักษร', radius: 'มุมโค้ง', spacing: 'ระยะห่าง', codeHint: 'คอมโพเนนต์จาก', reusable: 'Reusable UI kit', filterEmpty: 'ไม่พบคอมโพเนนต์ที่ตรงกัน'
		},
		tl: {
			title: 'Design system', intro: 'Sanggunian ng mga reusable component at UI pattern sa DK CRM.', search: 'Maghanap ng component…', overview: 'Mga pundasyon', forms: 'Mga form', actions: 'Mga aksyon at navigation', feedback: 'Feedback at data', overlays: 'Mga overlay', tokens: 'Mga aktibong token', copy: 'Kopyahin', copied: 'Nakopya', sample: 'Interactive na halimbawa', sizes: 'Mga available na size', variants: 'Mga variant', states: 'Mga state', usage: 'Paggamit', input: 'Input', inputDesc: 'Basic na single-line text field.', email: 'Email', textarea: 'Textarea', textareaDesc: 'Text field para sa mas mahabang mensahe o tala.', select: 'Select', selectDesc: 'Pumili ng isang opsyon mula sa listahan.', choose: 'Pumili ng opsyon', calendar: 'Calendar', calendarDesc: 'Single-date picker na may month navigation.', datePicker: 'Date picker', datePickerDesc: 'Calendar sa popover para sa mga form.', checkbox: 'Checkbox', radio: 'Radio group', switch: 'Switch', slider: 'Slider', button: 'Button', buttonDesc: 'Primary, secondary, at icon actions.', toggle: 'Toggle', tabs: 'Tabs', card: 'Card', alert: 'Alert', badge: 'Badge', chip: 'Chip', progress: 'Progress', loading: 'Naglo-load', avatar: 'Avatar', table: 'Table', empty: 'Empty state', tooltip: 'Tooltip', dialog: 'Dialog', dropdown: 'Dropdown menu', popover: 'Popover', separators: 'Separator', disabled: 'Naka-disable', invalid: 'Hindi valid ang email', required: 'Kailangan', save: 'I-save ang pagbabago', cancel: 'Kanselahin', openDialog: 'Buksan ang dialog', dialogTitle: 'Kumpirmahin ang pagbabago', dialogDesc: 'Dialog example gamit ang component ng app.', confirm: 'Kumpirmahin', menuAction: 'Profile settings', menuHelp: 'Tulong', popoverText: 'Malapit sa trigger ang popover content.', emptyTitle: 'Wala pang data', emptyDesc: 'Magdagdag ng unang item para makapagsimula.', cell: 'Component', example: 'Halimbawa', status: 'Status', active: 'Aktibo', sampleText: 'Sample na text', complete: 'Kumpleto', high: 'Mataas', medium: 'Katamtaman', low: 'Mababa', small: 'Small', default: 'Default', large: 'Large', extraLarge: 'Extra large', foundationDesc: 'Gumagamit ng active theme tokens ang mga sample. Gamitin ang theme toggle sa top bar para ihambing ang light at dark.', color: 'Kulay', typography: 'Typography', radius: 'Radius', spacing: 'Spacing', codeHint: 'Ang mga component ay mula sa', reusable: 'Reusable UI kit', filterEmpty: 'Walang tugmang component.'
		}
	} as const;
	let s = $derived(STR[$locale]);
	let search = $state('');
	let selectedDate = $state<DateValue | undefined>(new CalendarDate(2026, 9, 30));
	let exampleValue = $state('');
	let selectValue = $state('email');
	let checked = $state(true);
	let notifications = $state(false);
	let radioValue = $state('comfortable');
	let sliderValue = $state(68);
	let activeTab = $state('preview');
	let copied = $state(false);
	let togglePressed = $state(true);

	const sections = [
		{ id: 'foundations', label: 'overview', keywords: 'token colors typography radius spacing' },
		{ id: 'forms', label: 'forms', keywords: 'input textarea select calendar date picker checkbox radio switch slider' },
		{ id: 'actions', label: 'actions', keywords: 'button toggle tabs' },
		{ id: 'feedback', label: 'feedback', keywords: 'card alert badge chip progress skeleton spinner avatar table empty' },
		{ id: 'overlays', label: 'overlays', keywords: 'tooltip dialog dropdown popover' }
	];
	let visibleSections = $derived(sections.filter((section) => `${s[section.label as keyof typeof s]} ${section.keywords}`.toLowerCase().includes(search.toLowerCase().trim())));

	const buttonVariants = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const;
	const badgeVariants = ['default', 'secondary', 'outline', 'destructive', 'success', 'warning', 'info'] as const;
	const buttonSizes = ['xs', 'sm', 'default', 'lg', 'xl'] as const;
	const buttonSizeLabels: Record<(typeof buttonSizes)[number], string> = { xs: 'XS', sm: 'SM', default: 'MD', lg: 'LG', xl: 'XL' };

	async function copyUsage() {
		const snippet = `<Button variant="default" size="default">Save changes</Button>`;
		try {
			await navigator.clipboard.writeText(snippet);
			copied = true;
			setTimeout(() => (copied = false), 1600);
		} catch {
			copied = false;
		}
	}
</script>

<svelte:head><title>{s.title} — DK CRM</title></svelte:head>

<div class="mx-auto flex w-full max-w-7xl flex-col gap-8">
	<div class="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
		<div class="max-w-3xl space-y-2">
			<h2 class="text-2xl font-semibold tracking-tight md:text-3xl">{s.title}</h2>
			<p class="text-muted-foreground max-w-2xl text-sm md:text-base">{s.intro}</p>
		</div>
		<div class="flex w-full items-center gap-2 sm:w-auto">
			<Input bind:value={search} placeholder={s.search} aria-label={s.search} class="sm:w-64" />
			<Button variant="outline" size="icon" onclick={copyUsage} aria-label={copied ? s.copied : s.copy}>
				{#if copied}<Check data-icon="true" />{:else}<Copy data-icon="true" />{/if}
			</Button>
		</div>
	</div>

	{#if visibleSections.length === 0}
		<Empty.Root>
			<Empty.Header><Empty.Media><Settings2 data-icon="empty" /></Empty.Media><Empty.Title>{s.filterEmpty}</Empty.Title></Empty.Header>
		</Empty.Root>
	{:else}
		{#each visibleSections as section (section.id)}
			<section id={section.id} class="scroll-mt-6 space-y-5">
				<div class="flex flex-col gap-1">
					<h3 class="text-xl font-semibold tracking-tight">{s[section.label as keyof typeof s]}</h3>
				</div>

				{#if section.id === 'foundations'}
					<div class="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
						<Card.Root>
							<Card.Header><Card.Title>{s.tokens}</Card.Title><Card.Description>{s.foundationDesc}</Card.Description></Card.Header>
							<Card.Content class="space-y-5">
								<div class="flex flex-wrap gap-2">
									<span class="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">--primary</span>
									<span class="rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground">--secondary</span>
									<span class="rounded-md bg-muted px-3 py-2 text-sm font-medium">--muted</span>
									<span class="rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground">--destructive</span>
								</div>
								<div class="grid gap-4 sm:grid-cols-3">
									<div><p class="mb-2 text-xs font-medium text-muted-foreground">{s.typography}</p><p class="text-xl font-semibold">Aa</p><p class="text-sm text-muted-foreground">Inter · Noto Sans Thai</p></div>
									<div><p class="mb-2 text-xs font-medium text-muted-foreground">{s.radius}</p><div class="flex items-center gap-2"><span class="size-8 rounded-sm border border-primary-text/40 bg-primary/10"></span><span class="size-8 rounded-lg border border-primary-text/40 bg-primary/10"></span><span class="size-8 rounded-xl border border-primary-text/40 bg-primary/10"></span></div><p class="mt-1 text-xs text-muted-foreground">4px · 8px · 12px</p></div>
									<div><p class="mb-2 text-xs font-medium text-muted-foreground">{s.spacing}</p><div class="flex items-end gap-1"><span class="h-2 w-2 rounded-sm bg-primary"></span><span class="h-3 w-3 rounded-sm bg-primary/75"></span><span class="h-4 w-4 rounded-sm bg-primary/50"></span><span class="h-6 w-6 rounded-sm bg-primary/25"></span></div><p class="mt-1 text-xs text-muted-foreground">2 · 3 · 4 · 6</p></div>
								</div>
							</Card.Content>
						</Card.Root>
						<Card.Root>
							<Card.Header><Card.Title>{s.usage}</Card.Title><Card.Description>{s.codeHint} <code class="font-mono">$lib/components/ui</code></Card.Description></Card.Header>
							<Card.Content class="space-y-4">
								<div class="rounded-lg border bg-muted/40 p-3 font-mono text-xs leading-relaxed">import { '{ Button }' } from '$lib/components/ui/button';<br />&lt;Button variant="default" size="default"&gt;Save changes&lt;/Button&gt;</div>
								<div class="flex flex-wrap gap-2"><Button onclick={copyUsage}><Copy data-icon="inline-start" />{copied ? s.copied : s.copy}</Button><Button variant="outline">{s.reusable}</Button></div>
							</Card.Content>
						</Card.Root>
					</div>
				{:else if section.id === 'forms'}
					<div class="grid gap-4 xl:grid-cols-2">
						<Card.Root>
							<Card.Header><Card.Title>{s.input}</Card.Title><Card.Description>{s.inputDesc}</Card.Description></Card.Header>
							<Card.Content class="grid gap-4 sm:grid-cols-2">
								<Field.Field><Field.Label>{s.email}</Field.Label><Input bind:value={exampleValue} type="email" placeholder="name@example.com" /></Field.Field>
								<Field.Field><Field.Label>{s.email}</Field.Label><Input value="operator@example.com" disabled /></Field.Field>
								<Field.Field><Field.Label>{s.invalid}</Field.Label><Input value="not-an-email" aria-invalid="true" /><Field.Description>{s.invalid}</Field.Description></Field.Field>
								<Field.Field><Field.Label>{s.required}</Field.Label><Input placeholder={s.required} required /></Field.Field>
								<Field.Field class="sm:col-span-2"><Field.Label>{s.textarea}</Field.Label><Textarea placeholder={s.textareaDesc} rows={3} /></Field.Field>
							</Card.Content>
						</Card.Root>
						<Card.Root>
							<Card.Header><Card.Title>{s.select}</Card.Title><Card.Description>{s.selectDesc}</Card.Description></Card.Header>
							<Card.Content class="space-y-4">
								<Field.Field><Field.Label>{s.choose}</Field.Label><Select.Root type="single" bind:value={selectValue}><Select.Trigger class="w-full"><Select.Value placeholder={s.choose} /></Select.Trigger><Select.Content><Select.Group><Select.GroupHeading>{s.choose}</Select.GroupHeading><Select.Item value="email">Email</Select.Item><Select.Item value="chat">Chat</Select.Item><Select.Item value="phone">Phone</Select.Item></Select.Group></Select.Content></Select.Root></Field.Field>
								<div class="flex flex-wrap items-center gap-3"><Checkbox bind:checked aria-label={s.checkbox} /><span class="text-sm">{s.checkbox}</span><Switch bind:checked={notifications} aria-label={s.switch} /><span class="text-sm">{s.switch}</span></div>
								<RadioGroup.Root bind:value={radioValue} class="flex flex-wrap gap-4"><label class="flex items-center gap-2 text-sm"><RadioGroup.Item value="compact" />{s.small}</label><label class="flex items-center gap-2 text-sm"><RadioGroup.Item value="comfortable" />{s.default}</label><label class="flex items-center gap-2 text-sm"><RadioGroup.Item value="spacious" />{s.large}</label></RadioGroup.Root>
								<div class="space-y-2"><div class="flex justify-between text-sm"><span>{s.slider}</span><span>{sliderValue}%</span></div><Slider type="single" bind:value={sliderValue} max={100} step={1} /></div>
							</Card.Content>
						</Card.Root>
						<Card.Root>
							<Card.Header><Card.Title>{s.calendar}</Card.Title><Card.Description>{s.calendarDesc}</Card.Description></Card.Header>
							<Card.Content class="flex justify-center overflow-x-auto"><Calendar.Calendar bind:value={selectedDate} locale={$locale === 'id' ? 'id-ID' : $locale === 'th' ? 'th-TH' : $locale === 'tl' ? 'fil-PH' : 'en-US'} /></Card.Content>
							<Card.Footer class="text-sm text-muted-foreground">{selectedDate?.toString() ?? s.choose}</Card.Footer>
						</Card.Root>
						<Card.Root>
							<Card.Header><Card.Title>{s.datePicker}</Card.Title><Card.Description>{s.datePickerDesc}</Card.Description></Card.Header>
							<Card.Content class="max-w-sm"><DatePicker bind:value={selectedDate} label={s.datePicker} placeholder={s.choose} /></Card.Content>
						</Card.Root>
					</div>
				{:else if section.id === 'actions'}
					<div class="grid gap-4 lg:grid-cols-2">
						<Card.Root><Card.Header><Card.Title>{s.button}</Card.Title><Card.Description>{s.buttonDesc}</Card.Description></Card.Header><Card.Content class="space-y-5">
							<div class="space-y-2"><p class="text-xs font-medium text-muted-foreground">{s.variants}</p><div class="flex flex-wrap gap-2">{#each buttonVariants as variant}<Button {variant}>{variant}</Button>{/each}</div></div>
							<div class="space-y-2"><p class="text-xs font-medium text-muted-foreground">{s.sizes}</p><div class="flex flex-wrap items-center gap-2">{#each buttonSizes as size}<Button {size} variant="outline">{buttonSizeLabels[size]}</Button>{/each}<Button size="icon-xs" variant="outline" aria-label="XS"><Info /></Button><Button size="icon-sm" variant="outline" aria-label="SM"><Info /></Button><Button size="icon" variant="outline" aria-label="MD"><Info /></Button><Button size="icon-lg" variant="outline" aria-label="LG"><Info /></Button><Button size="icon-xl" variant="outline" aria-label="XL"><Info /></Button></div></div>
							<Button disabled>{s.disabled}</Button>
						</Card.Content></Card.Root>
						<Card.Root><Card.Header><Card.Title>{s.toggle} / {s.tabs}</Card.Title><Card.Description>{s.sample}</Card.Description></Card.Header><Card.Content class="space-y-5">
							<Toggle.Root bind:pressed={togglePressed} aria-label={s.toggle}><Check /></Toggle.Root>
							<Tabs.Root bind:value={activeTab} class="w-full"><Tabs.List><Tabs.Trigger value="preview">Preview</Tabs.Trigger><Tabs.Trigger value="usage">Usage</Tabs.Trigger></Tabs.List><Tabs.Content value="preview" class="pt-4 text-sm text-muted-foreground">{s.sampleText}</Tabs.Content><Tabs.Content value="usage" class="pt-4 text-sm text-muted-foreground">&lt;Tabs.Trigger value="preview" /&gt;</Tabs.Content></Tabs.Root>
						</Card.Content></Card.Root>
					</div>
				{:else if section.id === 'feedback'}
					<div class="grid gap-4 xl:grid-cols-2">
						<Card.Root><Card.Header><Card.Title>{s.feedback}</Card.Title><Card.Description>{s.variants}</Card.Description></Card.Header><Card.Content class="space-y-5">
							<div class="flex flex-wrap gap-2">{#each badgeVariants as variant}<Badge {variant}>{variant}</Badge>{/each}</div>
							<div class="flex flex-wrap gap-2"><Chip variant="default">{s.active}</Chip><Chip variant="success">{s.complete}</Chip><Chip variant="warning">{s.high}</Chip></div>
							<Alert.Root variant="info"><Info data-icon="alert" /><Alert.Title>{s.alert}</Alert.Title><Alert.Description>{s.foundationDesc}</Alert.Description></Alert.Root>
							<div class="space-y-2"><div class="flex justify-between text-sm"><span>{s.progress}</span><span>72%</span></div><Progress value={72} /></div>
							<div class="flex items-center gap-3"><Spinner /><span class="text-sm">{s.loading}</span><Skeleton class="h-8 w-32" /></div>
						</Card.Content></Card.Root>
						<Card.Root><Card.Header><Card.Title>{s.avatar} / {s.table}</Card.Title><Card.Description>{s.sample}</Card.Description></Card.Header><Card.Content class="space-y-5">
							<Avatar.Group><Avatar.Root><Avatar.Fallback>OP</Avatar.Fallback></Avatar.Root><Avatar.Root><Avatar.Fallback>RA</Avatar.Fallback></Avatar.Root><Avatar.Root><Avatar.Fallback>BK</Avatar.Fallback></Avatar.Root><Avatar.GroupCount>+2</Avatar.GroupCount></Avatar.Group>
							<Table.Root><Table.Header><Table.Row><Table.Head>{s.cell}</Table.Head><Table.Head>{s.example}</Table.Head><Table.Head>{s.status}</Table.Head></Table.Row></Table.Header><Table.Body><Table.Row><Table.Cell>Input</Table.Cell><Table.Cell>Text field</Table.Cell><Table.Cell><Badge variant="success">{s.active}</Badge></Table.Cell></Table.Row><Table.Row><Table.Cell>Select</Table.Cell><Table.Cell>Single choice</Table.Cell><Table.Cell><Badge variant="secondary">{s.active}</Badge></Table.Cell></Table.Row></Table.Body></Table.Root>
							<Empty.Root><Empty.Header><Empty.Media><Settings2 data-icon="empty" /></Empty.Media><Empty.Title>{s.emptyTitle}</Empty.Title><Empty.Description>{s.emptyDesc}</Empty.Description></Empty.Header><Empty.Content><Button variant="outline" size="sm">{s.example}</Button></Empty.Content></Empty.Root>
						</Card.Content></Card.Root>
					</div>
				{:else}
					<div class="grid gap-4 lg:grid-cols-2">
						<Card.Root><Card.Header><Card.Title>{s.overlays}</Card.Title><Card.Description>{s.sample}</Card.Description></Card.Header><Card.Content class="flex flex-wrap items-center gap-3">
							<Tooltip.Root><Tooltip.Trigger>{#snippet child({ props })}<Button variant="outline" {...props}>{s.tooltip}</Button>{/snippet}</Tooltip.Trigger><Tooltip.Content>{s.sampleText}</Tooltip.Content></Tooltip.Root>
							<Dialog.Root><Dialog.Trigger>{#snippet child({ props })}<Button {...props}>{s.openDialog}</Button>{/snippet}</Dialog.Trigger><Dialog.Content><Dialog.Header><Dialog.Title>{s.dialogTitle}</Dialog.Title><Dialog.Description>{s.dialogDesc}</Dialog.Description></Dialog.Header><Dialog.Footer><Dialog.Close><Button variant="outline">{s.cancel}</Button></Dialog.Close><Dialog.Close><Button>{s.confirm}</Button></Dialog.Close></Dialog.Footer></Dialog.Content></Dialog.Root>
							<DropdownMenu.Root><DropdownMenu.Trigger>{#snippet child({ props })}<Button variant="outline" {...props}>{s.dropdown}<ChevronDown data-icon="inline-end" /></Button>{/snippet}</DropdownMenu.Trigger><DropdownMenu.Content><DropdownMenu.Item><Settings2 data-icon="true" />{s.menuAction}</DropdownMenu.Item><DropdownMenu.Item><Info data-icon="true" />{s.menuHelp}</DropdownMenu.Item></DropdownMenu.Content></DropdownMenu.Root>
							<Popover.Root><Popover.Trigger>{#snippet child({ props })}<Button variant="outline" {...props}>{s.popoverText}</Button>{/snippet}</Popover.Trigger><Popover.Content class="max-w-64 text-sm">{s.popoverText}</Popover.Content></Popover.Root>
						</Card.Content></Card.Root>
						<Card.Root><Card.Header><Card.Title>{s.separators}</Card.Title><Card.Description>{s.sample}</Card.Description></Card.Header><Card.Content class="space-y-4"><div class="flex items-center gap-3"><span>{s.small}</span><Separator.Root orientation="vertical" class="h-5" /><span>{s.default}</span><Separator.Root orientation="vertical" class="h-5" /><span>{s.large}</span></div><Separator.Root /><p class="text-sm text-muted-foreground">{s.foundationDesc}</p></Card.Content></Card.Root>
					</div>
				{/if}
			</section>
		{/each}
	{/if}
</div>
