/**
 * Namespace for Blog.html
 */
registerNamespace("Pages.Blog", function (ns)
{
	ns.entryFrame = null;
	ns.entryHeader = null;
	ns.zsc = null;

	const ENTRIES_DIRECTORY = "./blog_entries/";
	const BLOG_PAGE_EXTENSION = ".html";
	const ENTRY_PARAM = "entry";
	ns.ENTRY_PARAM = ENTRY_PARAM;

	ns.BlogTitles = {
		"2022_12_31": "Fate of the Flightless",
		"2022_12_20": "Hello blog!",
	};

	function openEntry(filename, event)
	{
		const page = ENTRIES_DIRECTORY + filename + BLOG_PAGE_EXTENSION;
		ns.entryFrame.setAttribute("src", page);
		ns.entryHeader.innerHTML = `<a href="${page}">${ns.BlogTitles[filename]}</a>`;
		exitZeroState();

		if (event)
		{
			event.preventDefault();
			window.history.replaceState(null, "", `?${ENTRY_PARAM}=${filename}`);
		}
	}
	ns.openEntry = openEntry;

	/**
	 * Shows the zero stage control
	 */
	function enterZeroState()
	{
		Common.DOMLib.addStyle(ns.entryFrame, { "display": "none" });
		Common.DOMLib.addStyle(ns.zsc, { "display": "block" });
	}
	ns.enterZeroState = enterZeroState;

	/**
	 * Hides the zero state control
	 */
	function exitZeroState()
	{
		Common.DOMLib.addStyle(ns.zsc, { "display": "none" });
		Common.DOMLib.addStyle(ns.entryFrame, { "display": "block" });
	}
	ns.exitZeroState = exitZeroState;
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	Pages.Blog.entryFrame = document.getElementById("entryFrame");
	Pages.Blog.entryHeader = document.getElementById("entryHeader");

	Pages.Blog.zsc = Common.Controls.ZeroState.embedZSC(document.getElementById("entryCard"), "Select an Entry");

	const params = Common.getUrlParams();
	if (params.has(Pages.Blog.ENTRY_PARAM))
	{
		const entry = params.get(Pages.Blog.ENTRY_PARAM);
		if (Pages.Blog.BlogTitles[entry])
		{
			Pages.Blog.openEntry(entry);
		}
		else
		{
			window.history.replaceState(null, "", "Blog.html");
			Pages.Blog.enterZeroState();
			Common.Controls.Popups.showModal("Blog", `Entry not found: ${entry}`);
		}
	}
	else
	{
		Pages.Blog.enterZeroState();
	}
};