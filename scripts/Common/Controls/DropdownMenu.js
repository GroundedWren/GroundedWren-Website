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
	 *						linkHref: string
	 *						childActionMap: {
	 *							childTabName: { action: Function, linkHref: string }
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
		 *						linkHref: string
		 *						childActionMap: {
		 *							childTabName: { action: Function, linkHref: string }
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
				this.constructNewTab(
					tabName,
					tabActionMap[tabName].action,
					tabActionMap[tabName].linkHref,
					tabActionMap[tabName].childActionMap
				);
			});
		}

		/**
		 * Creates a new tab and associates it with the control
		 */
		constructNewTab(tabText, action, linkHref, childActionMap)
		{
			childActionMap = childActionMap || {};

			const { el: tabContainerEl, id: tabContainerId } = Common.DOMLib.createElement(
				"div",
				undefined,
				["tab-strip-tab"]
			);
			const newTabEl = Common.DOMLib.createElement(
				"div",
				tabContainerEl,
				["tab-strip-tab", "button-like"]
			).el;
			newTabEl.innerHTML = `<span>${tabText}</span>`;

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
			var childKeys = Object.keys(childActionMap);
			childKeys.forEach(childName =>
			{
				children.push(this.__getChildTab(
					childName,
					tabText,
					children.length,
					childKeys.length,
					childActionMap,
					tabContainerEl
				));
			});

			action = action || function ()
			{
				if (linkHref) { Common.navTo(linkHref); }
			};
			this.__tabContainerDict[tabContainerId] = new Tab(
				tabContainerEl,
				newTabEl,
				this.__getWrappedParentAction(action, tabContainerId),
				linkHref,
				children
			);

			return tabContainerId;
		};

		__getChildTab(childName, parentName, index, numChildren, childActionMap, tabContainerEl)
		{
			const childTabEl = Common.DOMLib.createElement(
				"div",
				tabContainerEl,
				["tab-strip-tab", "button-like", "child"]
			).el;
			childTabEl.innerHTML = `<span>${childName}</span>`;
			childTabEl.tabIndex = 0;
			childTabEl.setAttribute(
				"aria-label",
				childName + " child item of " + parentName + " " + (index+1) + "of " + numChildren
			);

			if (childActionMap[childName].action)
			{
				Common.DOMLib.setAsButton(childTabEl, this.__getWrappedChildAction(childActionMap[childName]));
			}
			else if (childActionMap[childName].linkHref)
			{
				Common.DOMLib.setAsLink(childTabEl, childActionMap[childName].linkHref);
			}
			Common.DOMLib.addStyle(childTabEl, { display: "none" });

			return childTabEl;
		};

		__getWrappedParentAction(action, tabContainerId)
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
		};

		__getWrappedChildAction(action)
		{
			if (!this.__durable)
			{
				return () =>
				{
					this.__toggleAllOff();
					action();
				};
			}
			else
			{
				return action;
			}
		};

		__toggleAllOff(exceptId)
		{
			Object.keys(this.__tabContainerDict).forEach(tabId =>
			{
				if (tabId !== exceptId)
				{
					this.__tabContainerDict[tabId].doToggle(false);
				}
			});
		};
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
		 * @param linkHref If this is a link, location it goes to.
		 * @param children array of children
		 */
		constructor(containerEl, tabEl, action, linkHref, children)
		{
			this.containerEl = containerEl;
			this.tabEl = tabEl;
			this.action = action || function ()
			{
				if (linkHref) { Common.navTo(linkHref); }
			};
			this.children = children;

			this.tabEl.tabIndex = 0;
			if (children.length)
			{
				if (linkHref)
				{
					debugger; //link parent elements are not supported
				}

				this.chevronEl = Common.DOMLib.createElement("span", this.tabEl, ["chevron", "bottom"]).el;
				Common.Components.RegisterVisToggle(tabEl, children, Common.fcd(this, this.__onToggle));

				var allEls = [tabEl].concat(children);
				for (var i = 0; i < allEls.length; i++)
				{
					var priorChild = i ? allEls[i - 1] : undefined;
					var nextChild = (i === allEls.length - 1) ? undefined : allEls[i + 1];
					allEls[i].addEventListener("keyup", Common.fcd(this, (nextChild, priorChild, event) =>
					{
						if (nextChild && event.keyCode === Common.KeyCodes.DownArrow)
						{
							nextChild.focus();
							event.stopPropagation();
						}
						else if (priorChild && event.keyCode === Common.KeyCodes.UpArrow)
						{
							priorChild.focus();
							event.stopPropagation();
						}
					}, [nextChild, priorChild]));
				}
			}
			else
			{
				if (linkHref)
				{
					Common.DOMLib.setAsLink(tabEl, linkHref);
				}
				else
				{
					Common.DOMLib.setAsButton(tabEl, this.action);
				}
			}
		}

		/**
		 * Toggles the tab
		 */
		doToggle(state, event)
		{
			const visToggle = Common.Components.GetVisToggle(this.tabEl.id)
			if (visToggle)
			{
				visToggle.doToggle(state);
			}
			if (event)
			{
				event.preventDefault();
			}
		}

		__onToggle(state)
		{
			if (state)
			{
				this.action();
				this.chevronEl?.classList.remove("bottom");
			}
			else
			{
				this.chevronEl?.classList.add("bottom");
			}
		}
	};
});