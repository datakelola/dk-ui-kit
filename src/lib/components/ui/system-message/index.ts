import Content from "./system-message-content.svelte";
import Icon from "./system-message-icon.svelte";
import Time from "./system-message-time.svelte";
import Root from "./system-message.svelte";

export {
	Root,
	Icon,
	Content,
	Time,
	//
	Root as SystemMessage,
	Icon as SystemMessageIcon,
	Content as SystemMessageContent,
	Time as SystemMessageTime,
};

export {
	systemMessageVariants,
	type SystemMessageVariant,
	type SystemMessageShape,
} from "./system-message.svelte";
