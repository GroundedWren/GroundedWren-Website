/**
 * Namespace for Blog.html
 */
registerNamespace("Pages.Blog", function (ns)
{
	ns.entryFrame = null;
	ns.entryHeader = null;

	const ENTRIES_DIRECTORY = "blog_entries/"

	function openEntry(filename, title)
	{
		ns.entryFrame.setAttribute("src", ENTRIES_DIRECTORY + filename);
		ns.entryHeader.innerText = title;
	}
	ns.openEntry = openEntry;
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	Pages.Blog.entryFrame = document.getElementById("entryFrame");
	Pages.Blog.entryHeader = document.getElementById("entryHeader");
};