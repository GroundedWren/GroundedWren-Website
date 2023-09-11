/**
 * Namespace for Example.html
 */
registerNamespace("Pages.Example", function (ns)
{
	ns.pageControl = null;

	function showDialog()
	{
		var Dialog = Common.Controls.Popups.Dialog;

		var dialog = new Dialog(
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

	//#region Shortcuts
	ns.shortcutIter = 0;
	ns.addShortcut = function (code)
	{
		ns.shortcutIter++;
		var shorts = {};
		shorts[code] = {
			action: Common.fcd(this, function (iter) { window.alert(iter); }, [ns.shortcutIter]),
			description: ns.shortcutIter
		};
		Common.Components.registerShortcuts(shorts);
	};

	ns.removeShortcut = function (code)
	{
		Common.Components.unregisterShortcuts([code]);
	};
	//#endregion
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
			action: () => { document.getElementById("homeLink").click(); },
			description: "Return to the home page"
		},
		"ALT+S": {
			action: () => { document.getElementById("shortcutsButton").click(); },
			description: "Show shortcut keys"
		},
		"ALT+ArrowUp": {
			action: () =>
			{
				window.scrollTo(0, 0);
			},
			description: "Jump to the top of the page"
		},
	});

	//#region greeter
	const greeter = new Common.Components.Timekeeper(
		document.getElementById("content"),
		"Central Time: ",
		{
			timeZone: "America/Chicago"
		}
	);
	greeter.start();
	//#endregion

	//#region HTML testing
	const form1El = document.getElementById("form1");
	form1El.addEventListener('submit', event =>
	{
		window.alert("form submitted :)");
		event.preventDefault();
	});
	//#endregion

	//#region Page control
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
	/*Pages.Example.pageControl.setActiveTab("pgC_t1");*/

	const { el: dynPage } = Common.DOMLib.createElement("div");
	Pages.Example.pageControl.addNewTab("Dynamic", dynPage, () => { window.alert("on activate"); });

	const nestedPageControl = Common.Controls.PageControl.buildPageControl(dynPage, "zero state");
	Common.DOMLib.addStyle(nestedPageControl.controlEl, { "height": "100%" });
	const { el: nested1 } = Common.DOMLib.createElement("div");
	const { el: nested2 } = Common.DOMLib.createElement("div");
	nested1.innerHTML = `<p>I'm a nested page</p>`;
	nested2.innerHTML = `<p>hey me too</p>`;
	nestedPageControl.addNewTab("Nested 1", nested1);
	nestedPageControl.addNewTab("Nested 2", nested2);
	//#endregion

	//#region SVG
	var SVGLib = Common.SVGLib;
	var svg = SVGLib.createChildElement(
		document.getElementById("SVGParent"),
		SVGLib.ElementTypes.svg,
		{
			"style": "border: 1px solid green",
			"width": "600",
			"height": "250",
			"class": "test-svg-class"
		}
	);
	var svgDefs = SVGLib.createChildElement(svg, SVGLib.ElementTypes.defs);
	var gradient = SVGLib.createChildElement(svgDefs, SVGLib.ElementTypes.linearGradient, { "id": "gradId" });
	SVGLib.createChildElement(gradient, SVGLib.ElementTypes.stop, { "offset": "0%", "stop-color": "rebeccapurple", "stop-opacity": 1 });
	SVGLib.createChildElement(gradient, SVGLib.ElementTypes.stop, { "offset": "100%", "stop-opacity": 0 });

	SVGLib.createChildElement(
		svg,
		SVGLib.ElementTypes.rect,
		{
			"x": "0",
			"y": "0",
			"width": "100%",
			"height": "100%",
			"stroke": "blue",
			"strokeWidth": "3",
			"fill": SVGLib.getDefsRef("gradId")
		}
	);

	SVGLib.createChildElement(
		svg,
		SVGLib.ElementTypes.text,
		{
			"x": "50%",
			"y": "50%",
			"dominant-baseline": "middle",
			"text-anchor": "middle",
			"fill": "white"
		},
		"text"
	);
	//#endregion

	//#region VisibilityToggle
	var visTogButton = document.getElementById("VisTogButton");
	Common.Components.RegisterVisToggle(
		visTogButton,
		[
			document.getElementById("togee"),
			document.getElementById("togee2")
		],
		(visible) =>
		{
			//Common.DOMLib.addStyle(visTogButton, {
			//	"background-color": visible
			//		? "green"
			//		: "red"
			//});
		}
	);
	//#endregion

	//#region Dropdown menu
	var menuContainer = document.getElementById("dropdownMenuContainer");
	Common.Controls.DropdownMenu.buildDropdownMenu(
		menuContainer,
		{
			"tab 1": {
				action: () => { window.alert("tab 1"); },
				childActionMap: {
					"child 1": { action: () => { window.alert("tab 1 child 1"); } },
					"child 2": { action: () => { window.alert("tab 1 child 2"); } },
				}
			},
			"tab 2": {
				action: () => { window.alert("tab 2"); },
				childActionMap: {
					"child 1": { action: () => { window.alert("tab 2 child 1"); } },
				}
			},
			"tab 3": {
				action: () => { window.alert("tab 3"); }
			}
		},
		false,
		false
	);
	//#endregion

	//#region Icons
	var icon = Common.SVGLib.createIcon(Common.SVGLib.Icons["circle-info"]);
	document.getElementById("iconContainer").appendChild(icon);
	Common.SVGLib.insertIcons();
	//#endregion
};