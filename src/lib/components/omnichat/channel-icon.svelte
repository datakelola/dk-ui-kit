<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { Channel } from "./mock";
	import AtSignIcon from "@lucide/svelte/icons/at-sign";
	import GlobeIcon from "@lucide/svelte/icons/globe";
	import MailIcon from "@lucide/svelte/icons/mail";
	import PhoneIcon from "@lucide/svelte/icons/phone";

	type Props = { channel: Channel; class?: string };
	let { channel, class: className = "" }: Props = $props();

	const MAP = {
		whatsapp: PhoneIcon,
		instagram: AtSignIcon,
		web: GlobeIcon,
		email: MailIcon,
		phone: PhoneIcon
	};

	let Icon = $derived(MAP[channel]);
</script>

<span
	class={cn(
		"bg-primary-muted text-primary-muted-foreground inline-flex size-6 shrink-0 items-center justify-center rounded-full",
		className
	)}
>
	<Icon class="size-3.5" />
</span>