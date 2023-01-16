registerNamespace("Common.Components", function (ns)
{
	ns.__visToggles = {};
	/**
	 * Creates and stores a toggler
	 */
	ns.RegisterVisToggle = function (toggler, togglesAry, handler)
	{
		var visTog = new VisibilityToggle(toggler, togglesAry, handler);
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
		__toggleHandler

		/**
		 * Create a VisibilityToggle
		 * @param toggler element doing the toggling
		 * @param togglesAry array of elements being toggled
		 */
		constructor(toggler, togglesAry, handler)
		{
			this.__toggler = toggler;
			this.__togglesAry = togglesAry;

			this.__toggler.addEventListener("click", this.doToggle);

			this.__toggleHandler = handler || function () { };

			this.__isEnabled = true;
		}

		/**
		 * Turn behavior on or off
		 */
		setEnabled(value)
		{
			this.__isEnabled = value;
		}

		/**
		 * Performs the toggle
		 * @param state optional - visible?
		 */
		doToggle = (state) =>
		{
			if (!this.__isEnabled) { return; }

			var isVisible = !!this.__togglesAry[0]
				? this.__togglesAry[0].style["display"] !== "none"
				: false;
			if (state === undefined || state === isVisible) { return; }

			this.__togglesAry.forEach(el =>
			{
				Common.DOMLib.addStyle(el, { display: isVisible ? "none" : "" });
			});

			this.__toggleHandler(!isVisible);
		};
	}
	ns.VisibilityToggle = VisibilityToggle;
});