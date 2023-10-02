registerNamespace("Pages.Home.BiOnionring", function (ns)
{
	ns.RING_ID = "bisexualism";
	ns.RING_NAME = "Bisexualism";
	ns.INDEX_PAGE = "https://bisexualism.emeowly.gay/";

	async function onRegistration()
	{
		var response = await fetch("https://emeowly.github.io/bi/onionring-variables.js");
		if (response.ok)
		{
			response.text().then(onGotScript);
		}
	};

	const onGotScript = async (scriptText) =>
	{
		const sitesList = getSitesList(scriptText);

		var ringEl = document.getElementById(ns.RING_ID);

		thisIndex = sitesList.indexOf("https://groundedwren.com/");
		prevIndex = (thisIndex - 1 < 0) ? sitesList.length - 1 : thisIndex - 1;
		nextIndex = (thisIndex === sitesList.length - 1) ? 0 : thisIndex + 1;

		buildLink(ringEl, "←", "Previous bisexualism page", sitesList[prevIndex]);
		buildLink(ringEl, ns.RING_NAME, "Bisexualism index", ns.INDEX_PAGE);
		buildLink(ringEl, "→", "Next bisexualism page", sitesList[nextIndex]);
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

	onRegistration();
});