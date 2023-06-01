registerNamespace("Common.Components", function (ns)
{
	ns.__visToggles = {};
	/**
	 * Creates and stores a toggler
	 */
	ns.RegisterVisToggle = function (
		toggler,
		togglesAry,
		handler,
		startPressed,
		ansilarryTogglers
	)
	{
		var visTog = new VisibilityToggle(toggler, togglesAry, handler, startPressed, ansilarryTogglers);
		ns.__visToggles[toggler.id] = visTog;
	}
	/**
	 * Gets a VisibilityToggler registered to this ID
	 */
	ns.GetVisToggle = function (id)
	{
		return ns.__visToggles[id];
	}
	/**
	 * Class which enables one element to toggle another
	 */
	class VisibilityToggle
	{
		//#region fields
		// The element which triggers toggling
		__toggler;
		// Array of togglable elements
		__togglesAry;
		// Whether we're enabled
		__isEnabled;
		// Handler for when vis gets toggled
		__toggleHandler;

		/**
		 * Create a VisibilityToggle
		 * @param toggler element doing the toggling
		 * @param togglesAry array of elements being toggled
		 * @param startPressed whether the current state is "pressed". Default false.
		 * @param ansilarryTogglers array of additional elements to triggle toggle.
		 */
		constructor(toggler, togglesAry, handler, startPressed, ansilarryTogglers)
		{
			this.__toggler = toggler;
			this.__togglesAry = togglesAry;

			if (!toggler.getAttribute("role"))
			{
				toggler.setAttribute("role", "button");
			}
			toggler.setAttribute("aria-pressed", !!startPressed ? "true" : "false");

			(ansilarryTogglers || []).concat([this.__toggler]).forEach(togglerEl =>
			{
				togglerEl.addEventListener("click", Common.fcd(this, this.doToggle, [undefined]));
				togglerEl.addEventListener("keyup", this.onKeyUp);
				togglerEl.addEventListener("keydown", this.onKeyDown);
			});

			this.__toggleHandler = handler || function () { };

			this.__isEnabled = true;
		};

		/**
		 * Turn behavior on or off
		 */
		setEnabled(value)
		{
			this.__isEnabled = value;
		};

		/**
		 * Keyup handler
		 */
		onKeyUp = (event) =>
		{
			if (!event.keyCode
				|| (event.keyCode !== Common.KeyCodes.Space)
			)
			{
				return;
			}
			event.preventDefault();
			this.doToggle(undefined, event);
		};

		onKeyDown = (event) =>
		{
			if (!event.keyCode
				|| (event.keyCode !== Common.KeyCodes.Space && event.keyCode !== Common.KeyCodes.Enter)
			)
			{
				return;
			}
			event.preventDefault();
			if (event.keyCode === Common.KeyCodes.Enter)
			{
				this.doToggle(undefined, event);
			}
		};

		/**
		 * Whether the toggles are currently visible
		 */
		getIsVisible = function ()
		{
			return !!this.__togglesAry[0]
				? this.__togglesAry[0].style["display"] !== "none"
				: false;
		};

		/**
		 * Performs the toggle
		 * @param state optional - visible?
		 */
		doToggle = (state, event) =>
		{
			if (!this.__isEnabled) { return; }

			var isVisible = this.getIsVisible();
			if (state === isVisible) { return; }

			this.__togglesAry.forEach(el =>
			{
				Common.DOMLib.addStyle(el, { display: isVisible ? "none" : "" });
			});

			var pressed = this.__toggler.getAttribute("aria-pressed");
			this.__toggler.setAttribute("aria-pressed", (pressed === "true") ? "false" : "true");

			this.__toggleHandler(!isVisible, event);
		};
	}
	ns.VisibilityToggle = VisibilityToggle;
});