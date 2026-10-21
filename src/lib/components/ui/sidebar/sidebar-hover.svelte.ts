/**
 * Hover state for the collapsible sidebar.
 *
 * Deliberately kept separate from the persisted `open` state so that a hover
 * peek can never overwrite the user's pinned preference. The sidebar renders
 * `pinned || hovering`, which is what makes the peek safe: it is drawn as an
 * overlay on top of the page, so the content never reflows.
 */
export class SidebarHover {
	/** True while the rail is hovered and the peek should stay open. */
	open = $state(false);

	/** Delay before entering a hover peek so incidental pointer passes do not flash it open. */
	readonly expandDelay: () => number;

	/** Grace period before collapsing so the cursor can travel to the expanded panel. */
	readonly collapseDelay: () => number;

	/** Hover is mouse-only — touch fires synthetic mouse events on tap. */
	#enabled = true;

	#timer: ReturnType<typeof setTimeout> | null = null;
	#expandTimer: ReturnType<typeof setTimeout> | null = null;

	constructor(
		collapseDelay: (() => number) | number = 150,
		expandDelay: (() => number) | number = 80
	) {
		this.collapseDelay = typeof collapseDelay === "function" ? collapseDelay : () => collapseDelay;
		this.expandDelay = typeof expandDelay === "function" ? expandDelay : () => expandDelay;
	}

	get enabled(): boolean {
		return this.#enabled;
	}

	/**
	 * Gate peeking on the pointer type. Coarse pointers (touch) are excluded so
	 * a tap on the rail does not flash the full sidebar open.
	 */
	syncPointer(query?: MediaQueryList): boolean {
		this.#enabled = query ? query.matches : true;
		if (!this.#enabled) this.close();
		return this.#enabled;
	}

	enter = (): void => {
		if (!this.#enabled) return;
		this.#clearCollapse();
		if (this.open || this.#expandTimer !== null) return;
		this.#expandTimer = setTimeout(() => {
			this.#expandTimer = null;
			this.open = true;
		}, this.expandDelay());
	};

	leave = (): void => {
		if (!this.#enabled) return;
		if (!this.open) {
			this.#clear();
			return;
		}
		if (this.#timer !== null) return;
		this.#timer = setTimeout(() => {
			this.#timer = null;
			this.open = false;
		}, this.collapseDelay());
	};

	/** Immediate close, skipping the grace period. Used by the Escape key. */
	close = (): void => {
		this.#clear();
		this.#clearCollapse();
		this.open = false;
	};

	destroy = (): void => {
		this.#clear();
		this.#clearCollapse();
	};

	#clear(): void {
		if (this.#expandTimer === null) return;
		clearTimeout(this.#expandTimer);
		this.#expandTimer = null;
	}

	#clearCollapse(): void {
		if (this.#timer === null) return;
		clearTimeout(this.#timer);
		this.#timer = null;
	}
}