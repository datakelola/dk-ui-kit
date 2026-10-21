import { getContext, setContext } from "svelte";
import { IsMobile } from "$lib/hooks/is-mobile.svelte.js";
import { SIDEBAR_KEYBOARD_SHORTCUT } from "./constants.js";
import { SidebarHover } from "./sidebar-hover.svelte.js";

type Getter<T> = () => T;

export type SidebarStateProps = {
	/**
	 * A getter function that returns the user's *pinned* sidebar state — the one
	 * that gets persisted and that Ctrl/Cmd+B toggles.
	 * We use a getter function here to support `bind:open` on the `Sidebar.Provider`
	 * component.
	 */
	open: Getter<boolean>;

	/**
	 * A function that sets the pinned state of the sidebar. To support `bind:open`, we need
	 * a source of truth for changing the open state to ensure it will be synced throughout
	 * the sub-components and any `bind:` references.
	 */
	setOpen: (open: boolean) => void;
};

class SidebarState {
	readonly props: SidebarStateProps;
	/** Ephemeral hover state. Never persisted — see {@link effectiveOpen}. */
	readonly hover: SidebarHover;
	openMobile = $state(false);
	setOpen: SidebarStateProps["setOpen"];
	#isMobile: IsMobile;

	/** The persisted, user-controlled state. Ctrl/Cmd+B flips this. */
	pinned = $derived.by(() => this.props.open());
	/** True while the rail is hovered and the sidebar is not pinned. */
	hovering = $derived.by(() => this.hover.open);
	/** Pinned wins, so pinning keeps the sidebar open regardless of the cursor. */
	effectiveOpen = $derived.by(() => this.pinned || this.hovering);
	/** Narrower than `effectiveOpen`: true only for a hover-driven overlay. */
	peeking = $derived.by(() => !this.pinned && this.hovering);
	open = $derived.by(() => this.effectiveOpen);
	state = $derived.by(() => (this.effectiveOpen ? "expanded" : "collapsed"));

	constructor(props: SidebarStateProps, hover: SidebarHover = new SidebarHover()) {
		this.setOpen = props.setOpen;
		this.hover = hover;
		this.#isMobile = new IsMobile();
		this.props = props;
	}

	// Convenience getter for checking if the sidebar is mobile
	// without this, we would need to use `sidebar.isMobile.current` everywhere
	get isMobile() {
		return this.#isMobile.current;
	}

	// Event handler to apply to the `<svelte:window>`
	handleShortcutKeydown = (e: KeyboardEvent) => {
		if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			this.toggle();
		}
	};

	setOpenMobile = (value: boolean) => {
		this.openMobile = value;
	};

	/** Ctrl/Cmd+B — flips the persisted state, never the hover peek. */
	toggle = () => {
		if (this.#isMobile.current) {
			this.openMobile = !this.openMobile;
			return;
		}
		this.setPinned(!this.pinned);
	};

	/** Pin to whatever is currently on screen, so hovering stops fighting the pin. */
	pinCurrent = () => {
		this.setPinned(this.effectiveOpen);
	};

	private setPinned = (value: boolean) => {
		if (this.pinned === value) return;
		// Drop any in-flight grace timer so the new state is applied immediately.
		this.hover.close();
		this.setOpen(value);
	};
}

const SYMBOL_KEY = "scn-sidebar";

/**
 * Instantiates a new `SidebarState` instance and sets it in the context.
 *
 * @param props The constructor props for the `SidebarState` class.
 * @param hover The hover-peek state. A fresh one is created when omitted.
 * @returns  The `SidebarState` instance.
 */
export function setSidebar(props: SidebarStateProps, hover?: SidebarHover): SidebarState {
	return setContext(Symbol.for(SYMBOL_KEY), new SidebarState(props, hover));
}

/**
 * Retrieves the `SidebarState` instance from the context. This is a class instance,
 * so you cannot destructure it.
 * @returns The `SidebarState` instance.
 */
export function useSidebar(): SidebarState {
	return getContext(Symbol.for(SYMBOL_KEY));
}
