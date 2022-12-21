/**
 * Namespace for Example.html
 */
registerNamespace("Pages.Example", function (ns)
{
	ns.pageControl = pageControl;

	function showDialog()
	{
		var Dialog = Common.Controls.Popups.Dialog;

		var dialog = new Dialog(
			document.getElementById('subveil'),
			"title",
			"<p>Hi! I'll be your dialog this evening.</p>"
			+ "<p>Move me around uwu</p>"
		);

		if (Dialog.NumberShowing > 0)
		{
			dialog.showAbsolute(Dialog.LastShowLeft + 50, Dialog.LastShowTop + 50);
		}
		else
		{
			dialog.showInView(100, 100);
		}
	}
	ns.showDialog = showDialog;

	function showModal()
	{
		Common.Controls.Popups.showModal(
			"Ope!",
			"<p>I'll be your modal this evening!</p>"
			+ "<p>Please do not resist.</p>",
			{ width: "600px" }
		);
	}
	ns.showModal = showModal;

	function displayFileAsText()
	{
		Common.FileLib.getFileFromUserAsText(
			(text) => { window.alert(text); },
			[{ 'application/json': ['.json'] }, { 'text/plain': ['.txt'] }]
		);
	}
	ns.displayFileAsText = displayFileAsText;

	function displayFileJSONsTestProperty()
	{
		Common.FileLib.getFileFromUserAsObject(
			(object) => { window.alert(object.Test); },
			[{ 'application/json': ['.json', '.save'] }]
		);
	}
	ns.displayFileJSONsTestProperty = displayFileJSONsTestProperty;

	function saveTestFile()
	{
		Common.FileLib.saveJSONFile(
			{ text: "this is text", num: 5 },
			"New Save",
			['.save', '.json']
		);
	}
	ns.saveTestFile = saveTestFile;
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	const greeter = new Common.Components.Timekeeper(document.getElementById("content"));
	greeter.start();

	const form1El = document.getElementById("form1");
	form1El.addEventListener('submit', event =>
	{
		window.alert("form submitted :)");
		event.preventDefault();
	});

	//Page control testing :)
	const fileUploadEl = document.getElementById("fileUpload");
	fileUploadEl.addEventListener('change', (changeEv) =>
	{
		Common.FileLib.displayFileTxtContents(changeEv.target.files[0]);
	});

	Pages.Example.pageControl = new Common.Controls.PageControl.PageControl(
		document.getElementById("pgC"),
		document.getElementById("pgC_ts"),
		document.getElementById("pgC_pc"),
		{
			"pgC_t1": document.getElementById("pgC_p1"),
			"pgC_t2": document.getElementById("pgC_p2"),
		}
	);
	Pages.Example.pageControl.setActiveTab("pgC_t1");

	const { el: dynPage } = Common.DOMLib.createElement("div");
	Pages.Example.pageControl.addNewTab("Dynamic", dynPage);

	const nestedPageControl = Common.Controls.PageControl.buildPageControl(dynPage);
	Common.DOMLib.addStyle(nestedPageControl.controlEl, { "height": "100%" });
	const { el: nested1 } = Common.DOMLib.createElement("div");
	const { el: nested2 } = Common.DOMLib.createElement("div");
	nested1.innerHTML = `<p>I'm a nested page</p>`;
	nested2.innerHTML = `<p>hey me too</p>`;
	nestedPageControl.addNewTab("Nested 1", nested1);
	nestedPageControl.addNewTab("Nested 2", nested2);
};