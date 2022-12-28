/**
 * Namespace for Blog.html
 */
registerNamespace("Pages.Blog", function (ns)
{
	ns.entryFrame = null;
	ns.entryHeader = null;
	ns.zsc = null;

	const ENTRIES_DIRECTORY = "./blog_entries/"

	function openEntry(filename, title)
	{
		ns.entryFrame.setAttribute("src", ENTRIES_DIRECTORY + filename);
		ns.entryHeader.innerHTML = `<a href="${ENTRIES_DIRECTORY + filename}">${title}</a>`;
		exitZeroState();
	}
	ns.openEntry = openEntry;

	function enterZeroState()
	{
		Common.DOMLib.addStyle(ns.entryFrame, { "display": "none" });
		Common.DOMLib.addStyle(ns.zsc, { "display": "block" });
	}
	ns.enterZeroState = enterZeroState;

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
	Pages.Blog.enterZeroState();
};