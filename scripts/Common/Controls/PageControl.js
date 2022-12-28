/**
 * Namespace for a page control (tabbable pages)
 */
registerNamespace("Common.Controls.PageControl", function (ns)
{
	/**
	 * Namespace function to build a new page control
	 */
	function buildPageControl(parentEl, zeroStateMessage)
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
		return new PageControl(pageControl, tabStrip, pageContainer, {}, zeroStateMessage);
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
		constructor(pageControl, tabStrip, pageContainer, tabPageMap, zeroStateMessage)
		{
			this.controlEl = pageControl;
			this.__tabStripEl = tabStrip;
			this.__pageContainerEl = pageContainer;

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
		}

		/**
		 * Creates a new tab and associates it with the page
		 */
		addNewTab(tabText, page)
		{
			const { el: newTabEl, id: newTabId } = Common.DOMLib.createElement(
				"div",
				undefined,
				["tab-strip-tab", "button-like"]
			);
			newTabEl.innerHTML = `<span>${tabText}</span>`;
			newTabEl.tabIndex = "0";

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
			this.registerTab(newTabEl, page);
		};

		/**
		 * Registers a tab so that clickign it works
		 */
		registerTab(tab, page)
		{
			this.__tabDict[tab.id] = new Tab(tab, page);
			tab.onclick = Common.fcd(this, this.setActiveTab, [tab.id]);
		}

		/**
		 * Tab pages
		 * @param tabId id of the tab to activate
		 */
		setActiveTab(tabId)
		{
			if (this.__tabDict[tabId] == null) { return; }

			if (this.__activeTabId !== null)
			{
				this.__tabDict[this.__activeTabId].deactivate();
			}

			this.__exitZeroState();

			this.__tabDict[tabId].activate();
			this.__activeTabId = tabId;
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
		constructor(tabEl, pageEl)
		{
			this.tabEl = tabEl;
			this.__pageEl = pageEl;
		}

		/**
		 * Make the tab's page active
		 */
		activate()
		{
			this.tabEl.classList.add("selected");
			this.__pageEl.classList.add("selected");
		};

		/**
		 * Make the tab's page inactive
		 */
		deactivate()
		{
			this.tabEl.classList.remove("selected");
			this.__pageEl.classList.remove("selected");
		};
	};
});