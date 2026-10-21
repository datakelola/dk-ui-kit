import Action from "./ticket-banner-action.svelte";
import Icon from "./ticket-banner-icon.svelte";
import Id from "./ticket-banner-id.svelte";
import Label from "./ticket-banner-label.svelte";
import Root from "./ticket-banner.svelte";

export {
	Root,
	Icon,
	Label,
	Id,
	Action,
	//
	Root as TicketBanner,
	Icon as TicketBannerIcon,
	Label as TicketBannerLabel,
	Id as TicketBannerId,
	Action as TicketBannerAction,
};

export {
	ticketBannerVariants,
	type TicketBannerVariant,
	type TicketBannerSize,
} from "./ticket-banner.svelte";
