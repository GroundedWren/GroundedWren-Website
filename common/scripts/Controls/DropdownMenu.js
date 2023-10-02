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
		const menu = Common.DOMLib.createElement(
			"div",
			parentEl,
			undefined,
			["dropdown-menu"]
		);

		const tabStrip = Common.DOMLib.createElement(
			"div",
			menu,
			undefined,
			["tab-strip"]
		);
		Common.DOMLib.createElement(
			"div",
			tabStrip,
			undefined,
			["tab-gutter"]
		);

		return new DropdownMenu(menu, tabStrip, tabActionMap, nonExclusive, durable);
	};
	ns.buildDropdownMenu = buildDropdownMenu;

	//Available menu orientations
	ns.Orientations = {
		vertical: "vertical",
		horizontal: "horizontal",
	};

	class DropdownMenu
	{
		//#region fields
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
		__durable;
		// Index of the last focused top level tab
		__focusIndex;
		// Whether the menu has focus
		__hasFocus;
		// Control orientation
		__orientation;
		//#endregion

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
		 * @param orientation Control orientation (default=Horizontal)
		 */
		constructor(controlEl, tabStripEl, tabActionMap, nonExclusive, durable, orientation)
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

			this.__focusIndex = 0;
			this.__getTabAtIndex(this.__focusIndex).tabEl.tabIndex = "0";
			this.__tabStripEl.addEventListener("keydown", Common.fcd(this, this.__onKeyDown));

			this.setOrientation(orientation);
		}

		/**
		 * Configure the control orientation
		 */
		setOrientation(orientation)
		{
			this.__orientation = orientation || Common.Controls.DropdownMenu.Orientations.horizontal;
			if (this.__orientation === Common.Controls.DropdownMenu.Orientations.vertical)
			{
				this.controlEl.classList.add("vertical");
			}
			else
			{
				this.controlEl.classList.remove("vertical");
			}
		}

		//#region Tab construction
		/**
		 * Creates a new tab and associates it with the control
		 */
		constructNewTab(tabText, action, linkHref, childActionMap)
		{
			childActionMap = childActionMap || {};

			const tabContainerEl = Common.DOMLib.createElement(
				"div",
				undefined,
				undefined,
				["tab-strip-tab"]
			);
			const newTabEl = Common.DOMLib.createElement(
				"div",
				tabContainerEl,
				undefined,
				["tab-strip-tab", "button-like"],
				`<span class='tab-text'>${tabText}</span>`
			);

			if (this.__lastTabContainerId != null)
			{
				this.__tabContainerDict[this.__lastTabContainerId].containerEl.after(tabContainerEl);
			}
			else
			{
				this.__tabStripEl.prepend(tabContainerEl);
			}
			this.__lastTabContainerId = tabContainerEl.id;

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
			this.__tabContainerDict[tabContainerEl.id] = new Tab(
				tabContainerEl,
				newTabEl,
				this.__getWrappedParentAction(action, tabContainerEl.id),
				linkHref,
				children
			);

			return tabContainerEl.id;
		}

		__getChildTab(childName, parentName, index, numChildren, childActionMap, tabContainerEl)
		{
			const childTabEl = Common.DOMLib.createElement(
				"div",
				tabContainerEl,
				{
					"tabIndex": "-1",
					"aria-label": childName
						+ " child item of "
						+ parentName
						+ " "
						+ (index + 1)
						+ " of "
						+ numChildren,
				},
				["tab-strip-tab", "button-like", "child"],
				`<span class='tab-text'>${childName}</span>`
			);

			if (childActionMap[childName].action)
			{
				Common.DOMLib.setAsButton(
					childTabEl,
					this.__getWrappedChildAction(childActionMap[childName].action, tabContainerEl.id, index)
				);
			}
			else if (childActionMap[childName].linkHref)
			{
				Common.DOMLib.setAsLink(childTabEl, childActionMap[childName].linkHref);
			}
			Common.DOMLib.addStyle(childTabEl, { display: "none" });

			return childTabEl;
		}

		__getWrappedParentAction(action, tabContainerId)
		{
			if (this.__nonExclusive)
			{
				return (event) =>
				{
					this.__setFocus(this.__getIndexOfTabContainer(tabContainerId));
					action();

					if (event)
					{
						event.preventDefault();
					}
				};

			}
			else
			{
				return (event) =>
				{
					this.__setFocus(this.__getIndexOfTabContainer(tabContainerId));
					this.__toggleAllOff(tabContainerId);
					action();

					if (event)
					{
						event.preventDefault();
					}
				};
			}
		}

		__getWrappedChildAction(action, tabContainerId, index)
		{
			if (this.__durable)
			{
				return (event) =>
				{
					var parentIndex = this.__getIndexOfTabContainer(tabContainerId);
					this.__setFocus(parentIndex, index);

					action();

					event.preventDefault();
				};

			}
			else
			{
				return () =>
				{
					var parentIndex = this.__getIndexOfTabContainer(tabContainerId);
					this.__setFocus(parentIndex, index);

					this.__toggleAllOff();
					action();

					event.preventDefault();
				};
			}
		}
		//#endregion

		//#region focus
		__onKeyDown(event)
		{
			var leftRightEnabled = this.__orientation === Common.Controls.DropdownMenu.Orientations.horizontal;
			switch (event.keyCode)
			{
				case Common.KeyCodes.LeftArrow:
					if (leftRightEnabled)
					{
						this.__focusLeft();
					}
					event.preventDefault();
					break;
				case Common.KeyCodes.RightArrow:
					if (leftRightEnabled)
					{
						this.__focusRight();
					}
					event.preventDefault();
					break;
				case Common.KeyCodes.UpArrow:
					this.__focusUp();
					event.preventDefault();
					break;
				case Common.KeyCodes.DownArrow:
					this.__focusDown();
					event.preventDefault();
					break;
			}
		}

		__focusLeft()
		{
			if (this.__focusIndex === 0) { return; }
			this.__setFocus(this.__focusIndex - 1);
		}
		__focusRight()
		{
			if (this.__focusIndex === this.__tabStripEl.children.length - 2) { return; }
			this.__setFocus(this.__focusIndex + 1);
		}
		__focusUp()
		{
			var curTab = this.__getTabAtIndex(this.__focusIndex);
			if (this.__orientation === Common.Controls.DropdownMenu.Orientations.horizontal
				|| curTab.areChildrenShown()
			)
			{
				this.__getTabAtIndex(this.__focusIndex).focusUp();
			}
			else
			{
				this.__focusLeft();
			}
		}
		__focusDown()
		{
			var curTab = this.__getTabAtIndex(this.__focusIndex);
			if (this.__orientation === Common.Controls.DropdownMenu.Orientations.horizontal
				|| curTab.areChildrenShown()
			)
			{
				curTab.focusDown();
			}
			else
			{
				this.__focusRight();
			}
		}

		__setFocus(index, childIndex)
		{
			for (var i = 0; i < this.__tabStripEl.children.length - 1; i++)
			{
				if (i !== index)
				{
					this.__getTabAtIndex(i).clearChildFocus();
				}
			}

			this.__getTabAtIndex(this.__focusIndex).setUnfocused();
			this.__getTabAtIndex(index).setFocused(childIndex);
			this.__focusIndex = index;
		};
		//#endregion

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

		__getIndexOfTabContainer(tabContainerId)
		{
			for (var i = 0; i < this.__tabStripEl.children.length - 1; i++)
			{
				if (this.__tabStripEl.children[i].id === tabContainerId)
				{
					return i;
				}
			}
			return -1;
		}

		__getTabAtIndex(index)
		{
			return this.__tabContainerDict[this.__tabStripEl.children[index].id];
		};

	}

	/**
	 * Convenience class to represent one tab
	 */
	class Tab
	{
		//#region fields
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
		//Index of the focused child
		__focusedChildIndex;
		//#endregion

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
			this.children = children || [];
			this.__focusedChildIndex = -1;

			this.tabEl.tabIndex = "-1";
			if (this.children.length)
			{
				if (linkHref)
				{
					debugger; //link parent elements are not supported
				}

				this.chevronEl = Common.DOMLib.createElement(
					"span",
					this.tabEl,
					undefined,
					["chevron", "bottom"]
				);
				Common.Components.RegisterVisToggle(tabEl, this.children, Common.fcd(this, this.__onToggle));
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
			const visToggle = Common.Components.GetVisToggle(this.tabEl.id);
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
				this.clearChildFocus();
				this.chevronEl?.classList.add("bottom");
			}
		}

		areChildrenShown()
		{
			if (!this.children.length) { return false; }
			const visToggle = Common.Components.GetVisToggle(this.tabEl.id);
			return visToggle.getIsVisible();
		}

		//#region focus
		setFocused(childIndex)
		{
			if (childIndex !== undefined && childIndex >= 0)
			{
				this.__focusedChildIndex = childIndex;
				var child = this.children[childIndex];
				child.tabIndex = "0";
				child.focus();
			}
			else
			{
				this.tabEl.tabIndex = "0";
				this.tabEl.focus();
			}
		}
		setUnfocused()
		{
			this.tabEl.tabIndex = "-1";
			this.clearChildFocus();
		}

		clearChildFocus()
		{
			if (this.__focusedChildIndex >= 0)
			{
				this.children[this.__focusedChildIndex].tabIndex = "-1";
				this.__focusedChildIndex = -1;
				this.tabEl.tabIndex = "0";
			}
		}

		focusUp()
		{
			if (this.__focusedChildIndex === -1)
			{
				this.doToggle(false);
				return;
			}
			if (this.__focusedChildIndex === 0)
			{
				this.children[this.__focusedChildIndex].tabIndex = "-1";
				this.__focusedChildIndex = -1;
				this.setFocused();
				return;
			}
			this.children[this.__focusedChildIndex].tabIndex = "-1";
			var child = this.children[--this.__focusedChildIndex];
			child.tabIndex = "0";
			child.focus();
		}
		focusDown()
		{
			if (!this.children.length || this.__focusedChildIndex === this.children.length - 1) { return; }
			if (this.__focusedChildIndex === -1)
			{
				Common.axAlertAssertive("pressed");
				this.doToggle(true);
				this.tabEl.tabIndex = "-1";
			}
			else
			{
				this.children[this.__focusedChildIndex].tabIndex = "-1";
			}
			var child = this.children[++this.__focusedChildIndex];
			child.tabIndex = "0";
			child.focus();
		}
		//#endregion
	};
});