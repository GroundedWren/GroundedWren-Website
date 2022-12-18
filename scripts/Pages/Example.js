/**
 * Namespace for Example.html
 */
registerNamespace("Pages.Example", function (ns)
{
	function showDialog()
	{
		var Dialog = Common.Controls.Popups.Dialog;

		var dialog = new Dialog(
			document.getElementById('subveil'),
			"title",
			"<p>Hi! I'll be your dialog this evening.</p>"
			+ "<p>You can do anything you want with me uwu</p>"
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

	const fileUploadEl = document.getElementById("fileUpload");
	fileUploadEl.addEventListener('change', (changeEv) =>
	{
		Common.FileLib.displayFileTxtContents(changeEv.target.files[0]);
	});
};