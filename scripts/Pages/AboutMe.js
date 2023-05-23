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
	Pages.AboutMe.socialsCohostEl = document.getElementById("socialsCtrl_page_Cohost");
	Pages.AboutMe.socialsControl = new Common.Controls.PageControl.PageControl(
		document.getElementById("socialsCtrl"),
		document.getElementById("socialsCtrl_ts"),
		document.getElementById("socialsCtrl_pgc"),
		{
			"socialsCtrl_tab_Cohost": Pages.AboutMe.socialsCohostEl,
			"socialsCtrl_tab_Tumblr": document.getElementById("socialsCtrl_page_Tumblr"),
			"socialsCtrl_tab_Twitter": document.getElementById("socialsCtrl_page_Twitter"),
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