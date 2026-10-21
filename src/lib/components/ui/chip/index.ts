import Dismiss from "./chip-dismiss.svelte";
import Label from "./chip-label.svelte";
import Root from "./chip.svelte";

export {
	Root,
	Label,
	Dismiss,
	//
	Root as Chip,
	Label as ChipLabel,
	Dismiss as ChipDismiss,
};

export { chipVariants, type ChipVariant, type ChipSize } from "./chip.svelte";
