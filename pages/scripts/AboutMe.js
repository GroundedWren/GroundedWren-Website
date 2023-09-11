/**
 * Namespace for AboutMe.html
 */
registerNamespace("Pages.AboutMe", function (ns)
{
	ns.miscControl = null;
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	Common.loadTheme();
	Common.setUpAccessibility();
	Common.Components.registerShortcuts({
		"ALT+H": {
			action: () => { Common.navTo('./Home.html'); },
			description: "Return to the home page"
		},
	});
	Common.SVGLib.insertIcons();

	Pages.AboutMe.miscControl = new Common.Controls.PageControl.PageControl(
		document.getElementById("miscCtrl"),
		document.getElementById("miscCtrl_ts"),
		document.getElementById("miscCtrl_pgc"),
		{
			"miscCtrl_tab_Identity": document.getElementById("miscCtrl_page_Identity"),
			"miscCtrl_tab_Opinions": document.getElementById("miscCtrl_page_Opinions"),
			"miscCtrl_tab_Favs": document.getElementById("miscCtrl_page_Favs"),
			"miscCtrl_tab_QA": document.getElementById("miscCtrl_page_QA"),
		},
		"No Tab Selected",
		"Socials"
	);

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