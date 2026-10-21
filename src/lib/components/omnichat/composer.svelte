<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import PaperclipIcon from "@lucide/svelte/icons/paperclip";
	import SendIcon from "@lucide/svelte/icons/send";

	type Props = {
		placeholder: string;
		attachLabel: string;
		sendLabel: string;
		removeAttachmentLabel: string;
		attachmentErrorLabel: string;
		disabled?: boolean;
		onSend?: (text: string, attachment?: { name: string; size: string }) => void;
	};

	let {
		placeholder,
		attachLabel,
		sendLabel,
		removeAttachmentLabel,
		attachmentErrorLabel,
		disabled = false,
		onSend
	}: Props = $props();

	let text = $state("");
	let fileInput = $state<HTMLInputElement | null>(null);
	let attachment = $state<{ name: string; size: string } | null>(null);
	let attachmentError = $state(false);

	function formatSize(bytes: number) {
		if (bytes < 1024) return `${bytes} B`;
		return `${Math.round((bytes / 1024) * 10) / 10} KB`;
	}

	function selectFile(event: Event) {
		const file = (event.currentTarget as HTMLInputElement).files?.[0];
		if (!file) return;
		if (file.size > 10 * 1024 * 1024) {
			attachment = null;
			attachmentError = true;
			return;
		}
		attachmentError = false;
		attachment = { name: file.name, size: formatSize(file.size) };
	}

	function removeAttachment() {
		attachment = null;
		attachmentError = false;
		if (fileInput) fileInput.value = "";
	}

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const value = text.trim();
		if (!value || disabled) return;
		onSend?.(value, attachment ?? undefined);
		text = "";
		removeAttachment();
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			submit(event as unknown as SubmitEvent);
		}
	}
</script>


<form onsubmit={submit} class="bg-background border-border flex flex-wrap items-end gap-2 border-t px-3 py-3">
	<input bind:this={fileInput} type="file" class="hidden" onchange={selectFile} />
	<Button
		type="button"
		variant="secondary"
		size="icon"
		class="min-h-10 min-w-10"
		aria-label={attachLabel}
		title={attachLabel}
		disabled={disabled}
		onclick={() => fileInput?.click()}
	>
		<PaperclipIcon class="size-4" />
	</Button>

	<textarea
		bind:value={text}
		onkeydown={onKeydown}
		rows={1}
		{placeholder}
		aria-label={placeholder}
		disabled={disabled}
		class="border-border bg-background placeholder:text-muted-foreground focus-visible:border-primary-text focus-visible:ring-ring/40 max-h-40 min-h-12 flex-1 resize-none rounded-control border px-4 py-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
	></textarea>

	{#if attachment}
		<div class="bg-primary-muted text-primary-muted-foreground order-3 flex min-w-0 basis-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs">
			<span class="min-w-0 flex-1 truncate">{attachment.name} · {attachment.size}</span>
			<button
				type="button"
				class="hover:bg-primary/10 focus-visible:ring-ring flex size-8 items-center justify-center rounded-md p-1 focus-visible:ring-2 focus-visible:outline-none"
				aria-label={removeAttachmentLabel}
				title={removeAttachmentLabel}
				onclick={removeAttachment}
			>
				&times;
			</button>
		</div>
	{:else if attachmentError}
		<p class="text-destructive order-3 basis-full text-xs" role="alert">{attachmentErrorLabel}</p>
	{/if}

	<Button type="submit" size="icon" class="min-h-10 min-w-10" aria-label={sendLabel} title={sendLabel} disabled={disabled || text.trim() === ""}>
		<SendIcon class="size-4" />
	</Button>
</form>
