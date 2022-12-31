/**
 * Namespace for index.html
 */
registerNamespace("Pages.Index", function (ns)
{
	ns.socialsControl = null;
	ns.socialsCohostEl = null

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
	Pages.Index.socialsCohostEl = document.getElementById("socialsCtrl_page_Cohost");

	Pages.Index.socialsControl = new Common.Controls.PageControl.PageControl(
		document.getElementById("socialsCtrl"),
		document.getElementById("socialsCtrl_ts"),
		document.getElementById("socialsCtrl_pgc"),
		{
			"socialsCtrl_tab_Cohost": Pages.Index.socialsCohostEl,
			"socialsCtrl_tab_Tumblr": document.getElementById("socialsCtrl_page_Tumblr"),
			"socialsCtrl_tab_Twitter": document.getElementById("socialsCtrl_page_Twitter"),
			"socialsCtrl_tab_Other": document.getElementById("socialsCtrl_page_Other"),
		},
		"No Tab Selected"
	);

	Pages.Index.socialsControl.addOnActivate("socialsCtrl_tab_Cohost", Common.fcd(Pages.Index, Pages.Index.buildCohostEmbed));
};