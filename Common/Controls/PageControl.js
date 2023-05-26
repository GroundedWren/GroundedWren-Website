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
		const { el: pageControl } = Common.DOMLib.createElement(
			"div",
			parentEl,
			["page-control"]
		);

		const { el: tabStrip } = Common.DOMLib.createElement(
			"div",
			pageControl,
			["tab-strip"]
		);
		Common.DOMLib.createElement(
			"div",
			tabStrip,
			["tab-gutter"]
		);

		const { el: pageContainer } = Common.DOMLib.createElement(
			"div",
			pageControl,
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

		//element id of the currently selected tab
		__activeTabId;
		//element if of the rightmost tab in the tabstrip
		__lastTabId;

		/**
		 * Create a page control from existing DOM elements
		 */
		constructor(pageControl, tabStrip, pageContainer, tabPageMap, zeroStateMessage, name)
		{
			this.controlEl = pageControl;
			this.__tabStripEl = tabStrip;
			this.__pageContainerEl = pageContainer;

			this.controlEl.setAttribute("role", "region");
			this.controlEl.setAttribute("aria-label", (name || "") + " page control");
			this.__pageContainerEl.setAttribute("aria-live", "polite");

			this.__tabDict = {};
			for (var tabId of Object.keys(tabPageMap))
			{
				this.registerTab(document.getElementById(tabId), tabPageMap[tabId]);
				this.__lastTabId = tabId;
			}

			if (zeroStateMessage != undefined)
			{
				this.__zeroStateControl = Common.Controls.ZeroState.embedZSC(this.__pageContainerEl, zeroStateMessage);
			}

			this.__activeTabId = null;

			this.controlEl.classList.remove("loading");
		}

		/**
		 * Creates a new tab and associates it with the page
		 */
		addNewTab(tabText, page, onActivate)
		{
			const { el: newTabEl, id: newTabId } = Common.DOMLib.createElement(
				"div",
				undefined,
				["tab-strip-tab", "button-like"]
			);
			newTabEl.innerHTML = `<span>${tabText}</span>`;

			if (this.__lastTabId != null)
			{
				this.__tabDict[this.__lastTabId].tabEl.after(newTabEl);
				this.__lastTabId = newTabId;
			}
			else
			{
				this.__tabStripEl.prepend(newTabEl)
				this.__lastTabId = newTabId;
			}

			this.__pageContainerEl.appendChild(page);
			page.classList.add("page-control-page")
			this.registerTab(newTabEl, page, onActivate);

			return newTabId;
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
		setActiveTab(tabId, event)
		{
			if (this.__tabDict[tabId] == null) { return; }

			if (this.__activeTabId !== null)
			{
				this.__tabDict[this.__activeTabId].deactivate();
			}

			this.__exitZeroState();

			this.__tabDict[tabId].activate();
			this.__activeTabId = tabId;

			if (event) { event.preventDefault(); }
		};

		__exitZeroState()
		{
			if (this.__zeroStateControl)
			{
				Common.DOMLib.addStyle(this.__zeroStateControl, { "display": "none" });
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
		}

		/**
		 * Make the tab's page active
		 */
		activate()
		{
			if (this.onActivate) { this.onActivate(); }
			this.tabEl.classList.add("selected");
			this.__pageEl.classList.add("selected");
			this.tabEl.setAttribute("aria-pressed", "true");
		};

		/**
		 * Make the tab's page inactive
		 */
		deactivate()
		{
			this.tabEl.classList.remove("selected");
			this.__pageEl.classList.remove("selected");
			this.tabEl.setAttribute("aria-pressed", "true");
		};
	};
});