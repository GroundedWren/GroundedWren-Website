/**
 * Namespace for Home.html
 */
registerNamespace("Pages.Home", function (ns)
{
	// Threshold to enter "mini" or mobile mode
	ns.MINI_THRESHOLD = 755;

	ns.directoryMenu = null;

	ns.resizeListener = () =>
	{
		var directoryContainer = document.getElementById("Directory");
		if (window.innerWidth <= Pages.Home.MINI_THRESHOLD)
		{
			directoryContainer.classList.add("mini");
			ns.directoryMenu.setOrientation(Common.Controls.DropdownMenu.Orientations.vertical);
		}
		else
		{
			directoryContainer.classList.remove("mini");
			ns.directoryMenu.setOrientation(Common.Controls.DropdownMenu.Orientations.horizontal);
		}
	};

	ns.onUpdateVisToggled = (visible, event) =>
	{
		const updateChevron = document.getElementById("updateChevron");

		if (visible)
		{
			updateChevron.classList.remove("bottom");
		}
		else
		{
			updateChevron.classList.add("bottom");
		}
		event.stopPropagation();
	};
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	Common.setUpAccessibility();

	var directoryContainer = document.getElementById("Directory");
	Pages.Home.directoryMenu = Common.Controls.DropdownMenu.buildDropdownMenu(
		directoryContainer,
		{
			"Art Gallery": {
				linkHref: "./Art.html",
			},
			"Characters": {
				childActionMap: {
					"Vera": { linkHref: "./Character.html?char=Vera" },
					"Freya": { linkHref: "./Character.html?char=Freya" },
					"Orianna": { linkHref: "./Character.html?char=Orianna" },
					"Sindri": { linkHref: "./Character.html?char=Sindri" },
					"Veryn": { linkHref: "./Character.html?char=Veryn" },
				}
			},
			"Music": {
				linkHref: "./Music.html",
			},
			"Writing": {
				childActionMap: {
					"Blog": { linkHref: "./Writing.html?folder=Blog" },
					"Fiction": { linkHref: "./Writing.html?folder=Fiction" },
					"Poetry": { linkHref: "./Writing.html?folder=Poetry" },
				}
			},
			"Coding": {
				childActionMap: {
					"Text Adventure": { linkHref: "https://textadventure.groundedwren.com" },
					"DnD Workbook": { linkHref: "./DnDWorkbook.html" },
					"Winnings Calc": { linkHref: "./WinningsCalc.html" },
				}
			},
			"Misc": {
				childActionMap: {
					"About Me": { linkHref: "./AboutMe.html" },
					"Demo page": { linkHref: "./Example.html" },
					"Shortcuts": { action: () => { Common.Components.displayShortcuts(); } },
				}
			},
		}
	);

	Pages.Home.resizeListener();
	window.addEventListener("resize", Pages.Home.resizeListener);

	const updateContent = document.getElementById("updateContent");
	Common.Components.RegisterVisToggle(
		document.getElementById("updateChevron"),
		[
			updateContent
		],
		Pages.Home.onUpdateVisToggled,
		false,
		[document.getElementById("updatesCardHeader")]
	);
};