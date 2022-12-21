/**
 * Namespace for index.html
 */
registerNamespace("Pages.Index", function (ns)
{
	ns.socialsControl = null;
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	Pages.Index.socialsControl = new Common.Controls.PageControl.PageControl(
		document.getElementById("socialsCtrl"),
		document.getElementById("socialsCtrl_ts"),
		document.getElementById("socialsCtrl_pgc"),
		{
			"socialsCtrl_tab_Cohost": document.getElementById("socialsCtrl_page_Cohost"),
			"socialsCtrl_tab_Tumblr": document.getElementById("socialsCtrl_page_Tumblr"),
			"socialsCtrl_tab_Twitter": document.getElementById("socialsCtrl_page_Twitter"),
			"socialsCtrl_tab_Other": document.getElementById("socialsCtrl_page_Other"),
		}
	);
};