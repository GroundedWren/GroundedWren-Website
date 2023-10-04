/**
 * Interfaces with webrings using onionring - https://garlic.garden/onionring/
 * Basically I use this to fully control how the webring is built on my site.
 */

registerNamespace("Common.Controls.VeraOnionring", function (ns)
{
	ns.siteRing = async function siteRing(variablesURL, ringID, ringName, indexPage)
	{
		var response = await fetch(variablesURL);
		if (response.ok)
		{
			return response.text().then(Common.fcd(ns, onGotScript, [ringID, ringName, indexPage]));
		}
	};

	async function onGotScript (ringID, ringName, indexPage, scriptText)
	{
		const sitesList = getSitesList(scriptText);

		var ringEl = document.getElementById(ringID);

		thisIndex = Math.max(sitesList.indexOf("https://groundedwren.com/"), 0);
		prevIndex = (thisIndex - 1 < 0) ? sitesList.length - 1 : thisIndex - 1;
		nextIndex = (thisIndex === sitesList.length - 1) ? 0 : thisIndex + 1;

		buildLink(ringEl, "← Prev.", `Previous ${ringName} page`, sitesList[prevIndex]);
		buildLink(ringEl, ringName, `${ringName} index`, indexPage);
		buildLink(ringEl, "Next →", `Next ${ringName} page`, sitesList[nextIndex]);
	};

	function getSitesList(scriptText)
	{
		const sitesListPreamble = "var sites = [";
		const sitesListEpilogue = "];";
		var sitesListText = scriptText.slice(
			scriptText.indexOf(sitesListPreamble) + sitesListPreamble.length
		);
		sitesListText = sitesListText.slice(0, sitesListText.indexOf(sitesListEpilogue));
		sitesListText = sitesListText.replaceAll("'", "");

		var sitesList = sitesListText.split(",");
		sitesList = sitesList.map(site => site.trim()).filter(site => !!site);

		return sitesList;
	};

	function buildLink(parent, text, label, href)
	{
		Common.DOMLib.createElement(
			"a",
			parent,
			{
				"aria-label": label,
				"href": href
			},
			undefined,
			text
		);
	};
});