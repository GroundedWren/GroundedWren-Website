/**
 * Namespace for index.html
 */
registerNamespace("Pages.Index", function (ns)
{
	var subveilEl = undefined;

	function registerElements(subveil)
	{
		subveilEl = subveil;
	};
	ns.registerElements = registerElements;

	function helloButton()
	{
		var Dialog = Common.Controls.Popups.Dialog;

		var helloDialog = new Dialog(subveilEl, "Greetings", "Hi there :)");

		if (Dialog.NumberShowing > 0)
		{
			helloDialog.showAbsolute(Dialog.LastShowLeft + 50, Dialog.LastShowTop + 50);
		}
		else
		{
			helloDialog.showInView(200, 100);
		}
	};
	ns.helloButton = helloButton;
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	Pages.Index.registerElements(
		document.getElementById("subveil")
	);
};