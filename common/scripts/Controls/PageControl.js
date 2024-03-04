/**
 * Namespace for a page control (tabbable pages)
 */
registerNamespace("Common.Controls.PageControl", function (ns)
{
	/**
	 * Namespace function to build a new page control
	 */
	function buildPageControl(parentEl, zeroStateMessage, name)
	{
		const pageControl = Common.DOMLib.createElement(
			"div",
			parentEl,
			undefined,
			["page-control"]
		);

		const tabStrip = Common.DOMLib.createElement(
			"div",
			pageControl,
			undefined,
			["tab-strip"]
		);
		Common.DOMLib.createElement(
			"div",
			tabStrip,
			undefined,
			["tab-gutter"]
		);

		const pageContainer = Common.DOMLib.createElement(
			"div",
			pageControl,
			undefined,
			["page-container"]
		);
		return new PageControl(pageControl, tabStrip, pageContainer, {}, zeroStateMessage, name);
	};
	ns.buildPageControl = buildPageControl;

	/**
	 * Primary class to manage a page control
	 */
	class PageControl
	{
		//top-level container el
		controlEl;
		//container to hold the tabs
		__tabStripEl;
		//container to hold the pages
		__pageContainerEl;
		//mapping from tab element ids to Tab objects
		__tabDict;
		//zero state control element
		__zeroStateControl;
		__gutterEl;

		//element id of the currently selected tab
		activeTabId;
		//element if of the rightmost tab in the tabstrip
		__lastTabId;

		/**
		 * Create a page control from existing DOM elements
		 */
		constructor(pageControl, tabStrip, pageContainer, tabPageMap, zeroStateMessage, name, gutterEl)
		{
			this.controlEl = pageControl;
			this.__tabStripEl = tabStrip;
			this.__gutterEl = gutterEl;
			this.__pageContainerEl = pageContainer;

			this.controlEl.setAttribute("role", "region");
			this.controlEl.setAttribute("aria-label", (name || "") + " page control");

			this.__tabDict = {};
			for (var tabId of Object.keys(tabPageMap))
			{
				this.registerTab(document.getElementById(tabId), tabPageMap[tabId]);
				this.__lastTabId = tabId;
			}

			if (zeroStateMessage != undefined)
			{
				this.__zeroStateControl = Common.Controls.ZeroState.embedZSC(
					this.__pageContainerEl,
					zeroStateMessage
				);
			}

			this.activeTabId = null;

			this.controlEl.classList.remove("loading");
		}

		/**
		 * Creates a new tab and associates it with the page
		 */
		addNewTab(tabText, page, onActivate)
		{
			const newTabEl = Common.DOMLib.createElement(
				"div",
				undefined,
				undefined,
				["tab-strip-tab", "button-like"],
				`<span>${tabText}</span>`
			);

			if (this.__lastTabId != null)
			{
				this.__tabDict[this.__lastTabId].tabEl.after(newTabEl);
				this.__lastTabId = newTabEl.id;
			}
			else
			{
				this.__tabStripEl.prepend(newTabEl)
				this.__lastTabId = newTabEl.id;
			}

			this.__pageContainerEl.appendChild(page);
			page.classList.add("page-control-page")
			this.registerTab(newTabEl, page, onActivate);

			return newTabEl.id;
		};

		/**
		 * Adds an onActivate handler to a tab
		 */
		addOnActivate(tabId, onActivate)
		{
			if (this.__tabDict[tabId] == null) { return; }

			this.__tabDict[tabId].onActivate = onActivate;
		}

		/**
		 * Registers a tab so that clicking it works
		 */
		registerTab(tab, page, onActivate)
		{
			this.__tabDict[tab.id] = new Tab(tab, page, onActivate);
			
			Common.DOMLib.setAsButton(tab, Common.fcd(this, this.setActiveTab, [tab.id]));
		}

		/**
		 * Tab pages
		 * @param tabId id of the tab to activate
		 */
		setActiveTab(tabId, event, noFocus)
		{
			if (this.__tabDict[tabId] == null) { return; }

			const prevActiveId = this.activeTabId;
			if (this.activeTabId !== null)
			{
				this.__tabDict[this.activeTabId].deactivate();
			}

			if (tabId === prevActiveId)
			{
				this.activeTabId = null;
				this.__enterZeroState();
				return;
			}

			this.__exitZeroState();

			this.__tabDict[tabId].activate(noFocus);
			this.activeTabId = tabId;

			if (event) { event.preventDefault(); }
		};

		disableTabs()
		{
			Object.values(this.__tabDict).forEach(tabObj =>
			{
				tabObj.tabEl.disabled = true;
			});
			this.__gutterEl?.classList.add("disabled");
		}
		enableTabs()
		{
			Object.values(this.__tabDict).forEach(tabObj =>
			{
				tabObj.tabEl.disabled = false;
			});
			this.__gutterEl?.classList.remove("disabled");
		}

		__exitZeroState()
		{
			if (this.__zeroStateControl)
			{
				Common.DOMLib.addStyle(this.__zeroStateControl, { "display": "none" });
			}
		}
		__enterZeroState()
		{
			if (this.__zeroStateControl)
			{
				Common.DOMLib.addStyle(this.__zeroStateControl, { "display": "block" });
			}
		}
	};
	ns.PageControl = PageControl;

	/**
	 * Convenience class to represent one tab
	 */
	class Tab
	{
		tabEl;
		__pageEl;
		onActivate;
		constructor(tabEl, pageEl, onActivate)
		{
			this.tabEl = tabEl;
			this.__pageEl = pageEl;
			this.onActivate = onActivate;

			tabEl.setAttribute("aria-pressed", "false");

			if (!this.__pageEl.hasAttribute("tabIndex"))
			{
				this.__pageEl.setAttribute("tabIndex", "-1");
			}
		}

		/**
		 * Make the tab's page active
		 */
		activate(noFocus)
		{
			if (this.onActivate) { this.onActivate(); }
			this.tabEl.classList.add("selected");
			this.__pageEl.classList.add("selected");
			this.tabEl.setAttribute("aria-pressed", "true");

			if (!noFocus)
			{
				this.__pageEl.focus();
			}
		};

		/**
		 * Make the tab's page inactive
		 */
		deactivate()
		{
			this.tabEl.classList.remove("selected");
			this.__pageEl.classList.remove("selected");
			this.tabEl.setAttribute("aria-pressed", "false");
		};
	};
});