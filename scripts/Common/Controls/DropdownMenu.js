/**
 * Namespace for a dropdown menu
 */
registerNamespace("Common.Controls.DropdownMenu", function (ns)
{
	/**
	 * Namespace function to build a new dropdown menu
	 */

	/**
	 * Creates a dropdown menu
	 * @param parentEl element into which the control will be inserted
	 * @param tabActionMap Map from tab name to an object of the form
	 *						action: Function
	 *						childActionMap: {
	 *							childTabName: Function
	 *							...
	 *						}
	 * @param nonExclusive Whether one tab can be expanded at a time
	 * @param durable Whether tabs stay expanded after a child is clicked
	 */
	function buildDropdownMenu(parentEl, tabActionMap, nonExclusive, durable)
	{
		const { el: menu } = Common.DOMLib.createElement(
			"div",
			parentEl,
			["dropdown-menu"]
		);

		const { el: tabStrip } = Common.DOMLib.createElement(
			"div",
			menu,
			["tab-strip"]
		);
		Common.DOMLib.createElement(
			"div",
			tabStrip,
			["tab-gutter"]
		);

		return new DropdownMenu(menu, tabStrip, tabActionMap, nonExclusive, durable);
	};
	ns.buildDropdownMenu = buildDropdownMenu;

	class DropdownMenu
	{
		//top-level container el
		controlEl;
		//container to hold the tabs
		__tabStripEl;
		// ID of the last inserted tab
		__lastTabContainerId;
		// Dictionary from id to tab container
		__tabContainerDict;
		// Whether one tab can be expanded at a time
		__nonExclusive;
		// Whether tabs stay expanded after a child is clicked
		__durable

		/**
		 * Creates a dropdown menu
		 * @param controlEl Top-level container Element
		 * @param tabStripEl Container to hold the tabs
		 * @param tabActionMap Map from tab name to an object of the form
		 *						action: Function
		 *						childActionMap: {
		 *							childTabName: Function
		 *							...
		 *						}
		 * @param nonExclusive Whether one tab can be expanded at a time
		 * @param durable Whether tabs stay expanded after a child is clicked
		 */
		constructor(controlEl, tabStripEl, tabActionMap, nonExclusive, durable)
		{
			this.controlEl = controlEl;
			this.__tabStripEl = tabStripEl;
			this.__tabContainerDict = {};
			this.__nonExclusive = nonExclusive;
			this.__durable = durable;
			Object.keys(tabActionMap).forEach(tabName =>
			{
				this.constructNewTab(tabName, tabActionMap[tabName].action, tabActionMap[tabName].childActionMap);
			});
		}

		/**
		 * Creates a new tab and associates it with the control
		 */
		constructNewTab(tabText, action, childActionMap)
		{
			childActionMap = childActionMap || {};
			action = action || function () { };

			const { el: tabContainerEl, id: tabContainerId } = Common.DOMLib.createElement("div", undefined, ["tab-strip-tab"]);
			const newTabEl = Common.DOMLib.createElement(
				"div",
				tabContainerEl,
				["tab-strip-tab", "button-like"]
			).el;
			newTabEl.innerHTML = `<span>${tabText}</span>`;
			newTabEl.tabIndex = "0";

			if (this.__lastTabContainerId != null)
			{
				this.__tabContainerDict[this.__lastTabContainerId].containerEl.after(tabContainerEl);
			}
			else
			{
				this.__tabStripEl.prepend(tabContainerEl);
			}
			this.__lastTabContainerId = tabContainerId;

			var children = [];
			Object.keys(childActionMap).forEach(childName =>
			{
				children.push(this.__getChildTab(childName, childActionMap, tabContainerEl));
			});
			
			this.__tabContainerDict[tabContainerId] = new Tab(
				tabContainerEl,
				newTabEl,
				this.__getWrappedAction(action, tabContainerId),
				children
			);

			return tabContainerId;
		};

		__getChildTab(childName, childActionMap, tabContainerEl)
		{
			const childTabEl = Common.DOMLib.createElement(
				"div",
				tabContainerEl,
				["tab-strip-tab", "button-like", "child"]
			).el;
			childTabEl.innerHTML = `<span>${childName}</span>`;
			childTabEl.tabIndex = 0;
			childTabEl.onclick = childActionMap[childName];
			Common.DOMLib.addStyle(childTabEl, { display: "none" });

			childTabEl.addEventListener('keydown', (keyEv) =>
			{
				if (keyEv.keyCode === Common.KeyCodes.Space
					|| keyEv.keyCode === Common.KeyCodes.Enter)
				{
					childTabEl.click();
					/*keyEv.preventDefault();*/
				}
			});

			childTabEl.addEventListener("click", () =>
			{
				if (!this.__durable)
				{
					this.__toggleAllOff();
				}
			});

			return childTabEl;
		}

		__getWrappedAction(action, tabContainerId)
		{
			if (!this.__nonExclusive)
			{
				return () =>
				{
					this.__toggleAllOff(tabContainerId);
					action();
				};
			}
			else
			{
				return action;
			}
		}

		__toggleAllOff(exceptId)
		{
			Object.keys(this.__tabContainerDict).forEach(tabId =>
			{
				if (tabId !== exceptId)
				{
					this.__tabContainerDict[tabId].doToggle(false);
				}
			});
		}
	}

	/**
	 * Convenience class to represent one tab
	 */
	class Tab
	{
		// The tab's primary element
		tabEl;
		// The tab's container
		containerEl;
		// Delegate
		action;
		// Array of children elements
		children;
		// Chevron inside the tab to denote expanded
		chevronEl;

		/**
		 * Sets up an individual tab's behavior
		 * @param containerEl The tab's container
		 * @param tabEl The tab's primary element
		 * @param action Delegate to fire on activating
		 * @param children array of children
		 */
		constructor(containerEl, tabEl, action, children)
		{
			this.containerEl = containerEl;
			this.tabEl = tabEl;
			this.action = action;
			this.children = children;

			tabEl.addEventListener('keydown', (keyEv) =>
			{
				if (keyEv.keyCode === Common.KeyCodes.Space
					|| keyEv.keyCode === Common.KeyCodes.Enter)
				{
					tabEl.click();
					keyEv.preventDefault();
				}
			});
			if (children.length)
			{
				this.chevronEl = Common.DOMLib.createElement("span", this.tabEl, ["chevron"]).el;
			}
			Common.Components.RegisterVisToggle(tabEl, children, Common.fcd(this, this.__onToggle));
		}

		/**
		 * Toggles the tab
		 */
		doToggle(state)
		{
			Common.Components.GetVisToggle(this.tabEl.id).doToggle(state);
		}

		__onToggle(state)
		{
			if (state)
			{
				this.action();
				this.chevronEl?.classList.add("bottom");
			}
			else
			{
				this.chevronEl?.classList.remove("bottom");
			}
		}
	};
});