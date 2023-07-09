/**
 * Namespace for AboutMe.html
 */
registerNamespace("Pages.AboutMe", function (ns)
{
	ns.socialsControl = null;
	ns.socialsCohostEl = null;

	var cohostEmbedBuilt = false;

	ns.buildCohostEmbed = function ()
	{
		if (cohostEmbedBuilt) { return; }

		var iframe = Common.DOMLib.createElement("iframe", ns.socialsCohostEl).el;
		iframe.setAttribute("title", "Cohost");
		iframe.setAttribute("src", "https://cohost.org/Grounded-Wren");

		cohostEmbedBuilt = true;
	};
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	Common.setUpAccessibility();
	Common.Components.registerShortcuts({
		"ALT+H": {
			action: () => { document.getElementById("homeButton").click(); },
			description: "Return to the home page"
		},
		"ALT+S": {
			action: () => { document.getElementById("shortcutsButton").click(); },
			description: "Show shortcut keys"
		},
	});

	Pages.AboutMe.socialsCohostEl = document.getElementById("socialsCtrl_page_Cohost");
	Pages.AboutMe.socialsControl = new Common.Controls.PageControl.PageControl(
		document.getElementById("socialsCtrl"),
		document.getElementById("socialsCtrl_ts"),
		document.getElementById("socialsCtrl_pgc"),
		{
			"socialsCtrl_tab_Cohost": Pages.AboutMe.socialsCohostEl,
			"socialsCtrl_tab_Tumblr": document.getElementById("socialsCtrl_page_Tumblr"),
			"socialsCtrl_tab_Other": document.getElementById("socialsCtrl_page_Other"),
		},
		"No Tab Selected",
		"Socials"
	);
	Pages.AboutMe.socialsControl.addOnActivate("socialsCtrl_tab_Cohost", Common.fcd(Pages.AboutMe, Pages.AboutMe.buildCohostEmbed));

	const timeTicker = new Common.Components.Timekeeper(
		document.getElementById("veraTime"),
		"",
		{
			timeStyle: "medium",
			timeZone: "America/Chicago"
		}
	);
	timeTicker.start();
};